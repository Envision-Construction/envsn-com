'use client'

import Link from 'next/link'
import { useEffect } from 'react'

type NavItem = { label: string; href: string; external?: boolean }

/**
 * Mobile slide-in menu — exposes the navbar items plus the Contact Us CTA.
 * Renders only on viewports <=767px; the parent <Header> controls when to
 * mount it (hamburger click). Lock body scroll while open + Esc closes.
 */
export function MobileMenu({
  open,
  nav,
  onClose,
}: {
  open: boolean
  nav: NavItem[]
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      className={`env-mobile-menu ${open ? 'env-mobile-menu--open' : ''}`}
    >
      <div className="env-mobile-menu-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/2024/05/logo-black_prime.png"
          alt="Envision Construction"
          className="h-8 w-auto"
        />
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="env-mobile-menu-close"
        >
          ×
        </button>
      </div>
      <nav className="env-mobile-menu-nav">
        {nav.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="env-mobile-menu-link"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="env-mobile-menu-link"
            >
              {item.label}
            </Link>
          ),
        )}
        <Link
          href="/#contact-us"
          onClick={onClose}
          className="env-mobile-menu-cta"
        >
          Contact Us
        </Link>
      </nav>
    </div>
  )
}
