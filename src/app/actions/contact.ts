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
 *   - LEADS_EMAIL_TO (default destination)
 *   - LEADS_EMAIL_FROM (must be on a verified Resend domain)
 *   - TURNSTILE_SECRET_KEY
 *
 * Optional per-source overrides — when set, submissions from that form
 * use these instead of the defaults. Suffix matches the `source` value
 * uppercased and stripped of non-alphanumerics:
 *   - LEADS_EMAIL_TO_PRECONSTRUCTION       / LEADS_EMAIL_FROM_PRECONSTRUCTION
 *   - LEADS_EMAIL_TO_CONSTRUCTION          / LEADS_EMAIL_FROM_CONSTRUCTION
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
  // Identifies which form on the site sent this submission
  // ("Construction" from the homepage, "Preconstruction" from the
  // pre-construction page). Optional so older clients still work.
  source: z.string().max(60).optional().or(z.literal('')),
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
    source: formData.get('source') ?? '',
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

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    message,
    turnstileToken,
    source,
  } = parsed.data
  const formSource = source && source.trim() ? source.trim() : 'Construction'

  const captcha = await verifyTurnstile(turnstileToken)
  if (!captcha.success) {
    return {
      status: 'error',
      message:
        'We could not verify the CAPTCHA. Please reload the page and try again.',
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  // Per-source overrides: LEADS_EMAIL_TO_<SOURCE> / LEADS_EMAIL_FROM_<SOURCE>
  // fall back to the defaults when unset.
  const sourceKey = formSource.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const to =
    process.env[`LEADS_EMAIL_TO_${sourceKey}`] || process.env.LEADS_EMAIL_TO
  const from =
    process.env[`LEADS_EMAIL_FROM_${sourceKey}`] ||
    process.env.LEADS_EMAIL_FROM
  if (!apiKey || !to || !from) {
    return {
      status: 'error',
      message:
        'The contact form is not yet configured. Please email us directly.',
    }
  }

  const fullName = `${firstName} ${lastName}`.trim()
  const subject = `[${formSource}] New inquiry from ${fullName}${company ? ` (${company})` : ''}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text: [
      `New inquiry from envsn.com`,
      `Source:  ${formSource}`,
      ``,
      `Name:    ${fullName}`,
      `Email:   ${email}`,
      `Phone:   ${phone || '(not provided)'}`,
      `Company: ${company || '(not provided)'}`,
      '',
      'Message:',
      message,
      '',
      '— envsn.com',
    ].join('\n'),
    html: renderInquiryHtml({
      fullName,
      firstName,
      email,
      phone: phone || '',
      company: company || '',
      message,
      source: formSource,
    }),
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

// ---------------------------------------------------------------------------
// Branded HTML email — follows the Envision 2026 brand standard (Email surface):
// White 600px canvas, Helvetica Neue web stack, black body, brand green
// #007A53 for the single accent, grey #929296 footer, no background floods.
// Logo absolute URL so it loads in any recipient client. Table-based layout
// for maximum email-client compatibility (Outlook, Gmail, Apple Mail).
// ---------------------------------------------------------------------------

const ENVISION_GREEN = '#007A53'
const ENVISION_LIGHT_GREEN = '#CAE8E0'
const ENVISION_DARK = '#111111'
const ENVISION_GREY = '#929296'
const ENVISION_LIGHT_GREY = '#E6E6E6'
const ENVISION_FONT =
  "'Helvetica Neue', Helvetica, Arial, sans-serif"

// Vercel auto-sets VERCEL_PROJECT_PRODUCTION_URL to the canonical
// production alias (envsn-com.vercel.app while DNS for envsn.com is
// still parked at GoDaddy). NEXT_PUBLIC_SITE_URL overrides for the
// eventual envsn.com cutover.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://envsn-com.vercel.app')

const LOGO_URL = `${SITE_URL}/uploads/2024/05/logo-black_prime.png`

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${ENVISION_LIGHT_GREY};vertical-align:top;width:96px;">
        <span style="font-family:${ENVISION_FONT};font-size:11px;font-weight:700;line-height:1.5;color:${ENVISION_GREEN};text-transform:uppercase;letter-spacing:0.1em;">${label}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${ENVISION_LIGHT_GREY};vertical-align:top;">
        <span style="font-family:${ENVISION_FONT};font-size:15px;font-weight:400;line-height:1.5;color:${ENVISION_DARK};">${value}</span>
      </td>
    </tr>`
}

function renderInquiryHtml(d: {
  fullName: string
  firstName: string
  email: string
  phone: string
  company: string
  message: string
  source: string
}): string {
  const phoneCell = d.phone
    ? escapeHtml(d.phone)
    : `<span style="color:${ENVISION_GREY};">Not provided</span>`
  const companyCell = d.company
    ? escapeHtml(d.company)
    : `<span style="color:${ENVISION_GREY};">Not provided</span>`
  const emailCell = `<a href="mailto:${escapeHtml(d.email)}" style="color:${ENVISION_GREEN};text-decoration:none;">${escapeHtml(d.email)}</a>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New inquiry from envsn.com</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:${ENVISION_FONT};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f4;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;max-width:600px;width:100%;">

        <!-- Top brand bar — full-width green strip across the email -->
        <tr>
          <td style="height:6px;line-height:6px;font-size:0;background:${ENVISION_GREEN};">&nbsp;</td>
        </tr>

        <tr>
          <td style="padding:32px 40px 8px;">
            <img src="${LOGO_URL}" alt="ENVISION" width="160" style="display:block;border:0;outline:0;height:auto;max-width:160px;">
          </td>
        </tr>

        <tr>
          <td style="padding:4px 40px 0;">
            <div style="height:3px;width:64px;background:${ENVISION_GREEN};line-height:3px;font-size:0;">&nbsp;</div>
          </td>
        </tr>

        <!-- Source badge — shows which form on the site produced this inquiry -->
        <tr>
          <td style="padding:18px 40px 0;">
            <span style="display:inline-block;padding:6px 12px;background:${ENVISION_LIGHT_GREEN};color:${ENVISION_GREEN};font-family:${ENVISION_FONT};font-size:11px;font-weight:700;line-height:1;text-transform:uppercase;letter-spacing:0.12em;border-radius:2px;">
              ${escapeHtml(d.source)} form
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding:12px 40px 8px;">
            <h1 style="margin:0;font-family:${ENVISION_FONT};font-size:22px;font-weight:700;line-height:1.2;color:${ENVISION_DARK};letter-spacing:-0.01em;">
              New inquiry from ${escapeHtml(d.fullName)}
            </h1>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 20px;">
            <p style="margin:0;font-family:${ENVISION_FONT};font-size:15px;line-height:1.5;color:${ENVISION_DARK};">
              ${escapeHtml(d.firstName)} reached out through the envsn.com contact form.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              ${detailRow('Name', escapeHtml(d.fullName))}
              ${detailRow('Email', emailCell)}
              ${detailRow('Phone', phoneCell)}
              ${detailRow('Company', companyCell)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 40px 8px;">
            <p style="margin:0 0 10px;font-family:${ENVISION_FONT};font-size:11px;font-weight:700;line-height:1.5;color:${ENVISION_GREEN};text-transform:uppercase;letter-spacing:0.1em;">
              Message
            </p>
            <div style="padding:20px 22px;background:${ENVISION_LIGHT_GREEN};border-left:4px solid ${ENVISION_GREEN};">
              <p style="margin:0;font-family:${ENVISION_FONT};font-size:15px;line-height:1.65;color:${ENVISION_DARK};white-space:pre-wrap;">${escapeHtml(d.message)}</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 40px 8px;">
            <a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;padding:12px 22px;background:${ENVISION_GREEN};color:#ffffff;font-family:${ENVISION_FONT};font-size:12px;font-weight:700;line-height:1;text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">
              Reply to ${escapeHtml(d.firstName)}
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;border-top:1px solid ${ENVISION_LIGHT_GREY};margin-top:24px;">
            <p style="margin:0;font-family:${ENVISION_FONT};font-size:12px;line-height:1.6;color:${ENVISION_GREY};">
              <a href="https://envsn.com" style="color:${ENVISION_GREEN};text-decoration:none;font-weight:500;">envsn.com</a><br>
              Envision Construction<br>
              8601 Dunwoody Pl, Suite 200<br>
              Sandy Springs, GA 30350
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}
