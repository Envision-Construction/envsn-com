'use server'

import { Resend } from 'resend'
import { z } from 'zod'

/**
 * Contact form server action.
 *
 * Field set matches the legacy form: First Name, Last Name, Phone, Email,
 * Company, "How can we help you?" — plus a hidden honeypot and a
 * Cloudflare Turnstile token. Verified server-side via Zod + Cloudflare
 * siteverify, then routed to Resend.
 *
 * Env vars required for the action to actually send:
 *   - RESEND_API_KEY
 *   - LEADS_EMAIL_TO
 *   - LEADS_EMAIL_FROM (must be on a verified Resend domain)
 *   - TURNSTILE_SECRET_KEY
 */

const ContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(120),
  lastName: z.string().min(1, 'Last name is required').max(120),
  email: z.string().email('Valid email is required').max(200),
  phone: z.string().max(40).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long'),
  // Honeypot
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  turnstileToken: z.string().min(1, 'CAPTCHA token missing'),
})

export type ContactState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

async function verifyTurnstile(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { success: false, reason: 'TURNSTILE_SECRET_KEY not set' }
  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body })
    const json = (await res.json()) as { success: boolean }
    return { success: json.success, reason: 'CAPTCHA failed verification' }
  } catch {
    return { success: false, reason: 'CAPTCHA verification request failed' }
  }
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    firstName: formData.get('firstName') ?? '',
    lastName: formData.get('lastName') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    company: formData.get('company') ?? '',
    message: formData.get('message') ?? '',
    website: formData.get('website') ?? '',
    turnstileToken: formData.get('cf-turnstile-response') ?? '',
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? 'form')
      if (!fieldErrors[k]) fieldErrors[k] = issue.message
    }
    return {
      status: 'error',
      message: 'Please correct the highlighted fields and try again.',
      fieldErrors,
    }
  }

  const { firstName, lastName, email, phone, company, message, turnstileToken } =
    parsed.data

  const captcha = await verifyTurnstile(turnstileToken)
  if (!captcha.success) {
    return {
      status: 'error',
      message:
        'We could not verify the CAPTCHA. Please reload the page and try again.',
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEADS_EMAIL_TO
  const from = process.env.LEADS_EMAIL_FROM
  if (!apiKey || !to || !from) {
    return {
      status: 'error',
      message:
        'The contact form is not yet configured. Please email us directly.',
    }
  }

  const fullName = `${firstName} ${lastName}`.trim()
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New contact form submission — ${fullName}`,
    text: [
      `Name:    ${fullName}`,
      `Email:   ${email}`,
      `Phone:   ${phone || '(not provided)'}`,
      `Company: ${company || '(not provided)'}`,
      '',
      'How can we help you?',
      message,
    ].join('\n'),
  })

  if (error) {
    return {
      status: 'error',
      message: 'Sending failed. Please try again in a moment.',
    }
  }

  return {
    status: 'success',
    message: 'Thanks — we received your message and will reach out shortly.',
  }
}
