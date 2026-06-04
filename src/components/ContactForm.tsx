'use client'

import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => void
      reset: (id?: string) => void
    }
  }
}

/** Format US phone: (XXX) XXX-XXXX. Caps at 10 digits. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/** Walk the formatted string to find the position that follows
 *  the same number of digits as the cursor's original position. */
function cursorPositionAfterFormat(
  formatted: string,
  digitsBeforeCursor: number,
): number {
  if (digitsBeforeCursor === 0) {
    // After the leading "(" if any digits will follow
    return formatted.startsWith('(') ? 1 : 0
  }
  let pos = 0
  let digitCount = 0
  for (let i = 0; i < formatted.length; i++) {
    pos = i + 1
    if (/\d/.test(formatted[i])) {
      digitCount++
      if (digitCount === digitsBeforeCursor) break
    }
  }
  return pos
}

export function ContactForm({
  messageLabel = 'How can we help you?',
  source = 'Construction',
}: {
  messageLabel?: string
  /** Tag identifying which form was submitted ("Construction" on the
   * homepage, "Preconstruction" on /pre-construction). Travels through
   * the server action into the email subject + body so leads are
   * routable by origin. */
  source?: string
} = {}) {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const pendingCursor = useRef<number | null>(null)
  const [phone, setPhone] = useState('')
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (state.status !== 'idle' && typeof window !== 'undefined' && window.turnstile) {
      window.turnstile.reset()
    }
    if (state.status === 'success' && formRef.current) {
      formRef.current.reset()
      setPhone('')
    }
  }, [state])

  // Restore caret position after React re-renders the formatted phone value
  useLayoutEffect(() => {
    if (pendingCursor.current != null && phoneRef.current) {
      const pos = pendingCursor.current
      phoneRef.current.setSelectionRange(pos, pos)
      pendingCursor.current = null
    }
  }, [phone])

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const rawValue = input.value
    const cursorRaw = input.selectionStart ?? rawValue.length
    const digitsBeforeCursor = rawValue
      .slice(0, cursorRaw)
      .replace(/\D/g, '').length
    const formatted = formatPhone(rawValue)
    pendingCursor.current = cursorPositionAfterFormat(formatted, digitsBeforeCursor)
    setPhone(formatted)
  }

  const fieldError = (k: string) =>
    state.status === 'error' ? state.fieldErrors?.[k] : undefined

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full max-w-2xl space-y-4 text-left"
      noValidate
    >
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Form source — tells the server action / email which page sent it */}
      <input type="hidden" name="source" value={source} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          required
          error={fieldError('firstName')}
        />
        <Field
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          required
          error={fieldError('lastName')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-neutral-700">
            Phone
          </label>
          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={onPhoneChange}
            placeholder="(555) 555-5555"
            pattern="^\(\d{3}\) \d{3}-\d{4}$"
            title="Phone must be (XXX) XXX-XXXX"
            maxLength={14}
            className="env-form-field mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
          />
          {fieldError('phone') && (
            <p className="mt-1 text-xs text-red-600">{fieldError('phone')}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="name@example.com"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Please include @ and a domain ending (e.g. name@example.com)"
            className="env-form-field mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
          />
          {fieldError('email') && (
            <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p>
          )}
        </div>
      </div>

      <Field
        label="Company"
        name="company"
        autoComplete="organization"
        error={fieldError('company')}
      />

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-neutral-700">
          {messageLabel} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
        />
        {fieldError('message') && (
          <p className="mt-1 text-xs text-red-600">{fieldError('message')}</p>
        )}
      </div>

      {turnstileSiteKey ? (
        <>
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="light"
          />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          />
        </>
      ) : (
        <p className="text-xs text-neutral-500 italic">
          CAPTCHA not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-env-green text-white text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:bg-env-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Sending…' : 'Send'}
      </button>

      {state.status === 'success' && (
        <p role="status" className="text-sm text-env-green font-medium">
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <div className="pt-4 space-y-3 text-xs leading-relaxed text-neutral-500">
        <p>
          Envision needs the contact information you provide to us to contact you
          about our products and services. You may unsubscribe from these
          communications at any time. For information on how to unsubscribe, as
          well as our privacy practices and commitment to protecting your
          privacy, please review our{' '}
          <a href="/privacy" className="underline hover:text-env-green">
            Privacy Policy
          </a>
          .
        </p>
        <p>
          By clicking the box, you consent to allow Envision to store and process
          the personal information submitted above to provide you the content
          requested.
        </p>
        <p>
          This site is protected by reCAPTCHA. The Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-env-green"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-env-green"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-widest text-neutral-700">
        {label}
        {required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className="env-form-field mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
