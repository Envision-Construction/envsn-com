'use client'

import { useActionState, useEffect, useRef } from 'react'

import { submitContact, type ContactState } from '@/app/actions/contact'

/**
 * Contact form — matches the legacy field set:
 *   First Name · Last Name · Phone · Email · Company · How can we help you?
 *
 * Honeypot field + Cloudflare Turnstile + server-side Zod validation
 * provide bot defense. Privacy disclosures + reCAPTCHA notice rendered
 * below the submit button.
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
      className="w-full max-w-2xl space-y-4"
      noValidate
    >
      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          error={fieldError('phone')}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldError('email')}
        />
      </div>

      <Field
        label="Company"
        name="company"
        autoComplete="organization"
        error={fieldError('company')}
      />

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-neutral-700">
          How can we help you? *
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
        className="mt-1.5 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-env-green focus:ring-1 focus:ring-env-green outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
