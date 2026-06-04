'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { SearchOverlay } from './SearchOverlay'

type NavItem = { label: string; href: string; external?: boolean }

const NAV: NavItem[] = [
  { label: 'Culture', href: '/#culture' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'People', href: '/#people' },
  { label: 'Pre Construction', href: '/pre-construction' },
  { label: 'Careers', href: 'https://careers.envsn.com', external: true },
]

/**
 * Site header — sticky, white, with logo / nav / Contact Us + search.
 * Client component because it owns the SearchOverlay open state and
 * the active-nav highlight that animates a green underline left→right
 * on the clicked item.
 *
 * Active nav resolution priority:
 *   1. Whatever the user most recently clicked (click state)
 *   2. The current pathname when the page first loads (so /pre-construction
 *      shows the Pre Construction link as active out of the gate)
 */

export function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [clickedNav, setClickedNav] = useState<string | null>(null)

  // Pathname-based default on first render: highlight the nav item whose
  // href matches the current route (ignoring the hash so /#culture maps
  // to '/'). Cleared whenever the user navigates by clicking — clickedNav
  // takes over after the first click.
  useEffect(() => {
    if (clickedNav !== null) return
    const match = NAV.find((n) => {
      if (n.external) return false
      const path = n.href.split('#')[0] || '/'
      return path === pathname
    })
    if (match && (pathname === '/pre-construction' || pathname === '/')) {
      // Only auto-highlight Pre Construction on its own route; on '/' don't
      // pre-select anything (every section anchor matches '/').
      if (pathname === '/pre-construction' && match.label === 'Pre Construction') {
        setClickedNav('Pre Construction')
      }
    }
  }, [pathname, clickedNav])

  const activeLabel = clickedNav

  return (
    <>
      <header className="env-header sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="env-header-container mx-auto max-w-[1520px] flex items-center justify-between px-6 h-[60px]">
          <Link href="/" aria-label="Envision Construction — Home" className="env-header-logo flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/2024/05/logo-black_prime.png"
              alt="Envision Construction"
              className="h-8 w-auto"
            />
          </Link>

          <nav className="env-header-menu hidden md:flex items-center gap-8">
            {NAV.map((item) => {
              const isActive = activeLabel === item.label
              const className = `env-header-link text-sm uppercase tracking-wider text-neutral-800 hover:text-env-green transition-colors ${
                isActive ? 'env-header-link--active' : ''
              }`
              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    onClick={() => setClickedNav(item.label)}
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={className}
                  onClick={() => setClickedNav(item.label)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

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
