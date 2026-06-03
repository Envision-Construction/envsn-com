'use client'

import Link from 'next/link'
import { useState } from 'react'

import { SearchOverlay } from './SearchOverlay'

/**
 * Site header — matches the legacy Divi build.
 * Client component because it owns the SearchOverlay open/close state.
 */

type NavItem = { label: string; href: string; external?: boolean }

const NAV: NavItem[] = [
  { label: 'Culture', href: '/#culture' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'People', href: '/#people' },
  { label: 'Pre Construction', href: '/pre-construction' },
  { label: 'Careers', href: 'https://careers.envsn.com', external: true },
]

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="env-header sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="env-header-container mx-auto max-w-[1520px] flex items-center justify-between px-6 h-[60px]">
          {/* Left — logo */}
          <Link href="/" aria-label="Envision Construction — Home" className="env-header-logo flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/2024/05/logo-black_prime.png"
              alt="Envision Construction"
              className="h-8 w-auto"
            />
          </Link>

          {/* Middle — nav */}
          <nav className="env-header-menu hidden md:flex items-center gap-8">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="env-header-link text-sm uppercase tracking-wider text-neutral-800 hover:text-env-green transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="env-header-link text-sm uppercase tracking-wider text-neutral-800 hover:text-env-green transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right — Contact Us + search */}
          <div className="env-header-menu-right flex items-center gap-3">
            <Link
              href="/#contact-us"
              className="rounded-full bg-env-green text-white text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-env-green-dark transition-colors"
            >
              Contact Us
            </Link>
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="env-header-search-icon-btn flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-neutral-800 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/2025/11/search.png"
                alt=""
                className="w-[18px] h-[18px]"
              />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
