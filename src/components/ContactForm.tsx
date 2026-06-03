'use client'

import { useActionState, useEffect, useRef } from 'react'

import { submitContact, type ContactState } from '@/app/actions/contact'

/**
 * Contact form component.
 * Wraps the `submitContact` server action with Cloudflare Turnstile +
 * honeypot + accessible field rendering. Field set matches the legacy site:
 * Name, Email, Phone (optional), Message.
 *
 * Turnstile widget loads only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set;
 * if missing, the form still renders but submissions will fail server-side
 * with a clear "not configured" message.
 */

const initialState: ContactState = { status: 'idle' }

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => void
      reset: (id?: string) => void
    }
  }
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Reset Turnstile widget after each submission attempt so a new token is issued
  useEffect(() => {
    if (state.status !== 'idle' && typeof window !== 'undefined' && window.turnstile) {
      window.turnstile.reset()
    }
    if (state.status === 'success' && formRef.current) {
      formRef.current.reset()
    }
  }, [state])

  const fieldError = (k: string) =>
    state.status === 'error' ? state.fieldErrors?.[k] : undefined

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full max-w-xl mx-auto space-y-4"
      noValidate
    >
      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label="Name"
        name="name"
        autoComplete="name"
        required
        error={fieldError('name')}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fieldError('email')}
      />
      <Field
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        error={fieldError('phone')}
      />
      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-neutral-700">
          Message *
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
        className="mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
