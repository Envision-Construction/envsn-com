'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'

type NavItem = { label: string; href: string; external?: boolean }

const NAV: NavItem[] = [
  { label: 'Culture', href: '/#culture' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'People', href: '/#people' },
  { label: 'Pre Construction', href: '/pre-construction' },
  { label: 'Careers', href: 'https://careers.envsn.com', external: true },
]

export function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clickedNav, setClickedNav] = useState<string | null>(null)

  useEffect(() => {
    if (clickedNav !== null) return
    if (pathname === '/pre-construction') {
      setClickedNav('Pre Construction')
    }
  }, [pathname, clickedNav])

  const activeLabel = clickedNav

  return (
    <>
      <header className="env-header sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="env-header-container mx-auto max-w-[1520px] grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center px-6 h-[60px]">
          {/* Column 1 — logo. Desktop: right-aligned w/ mr to sit near nav.
              Mobile: left-aligned at the page edge. */}
          <Link
            href="/"
            aria-label="Envision Construction — Home"
            className="env-header-logo flex-shrink-0 justify-self-start md:justify-self-end md:mr-12"
            onClick={() => {
              setMobileMenuOpen(false)
              setClickedNav(null)
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/2024/05/logo-black_prime.png"
              alt="Envision Construction"
              className="h-8 w-auto"
            />
          </Link>

          {/* Column 2 — nav, desktop only */}
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

          {/* Column 3 — Contact + search on desktop, hamburger on mobile */}
          <div className="env-header-menu-right flex items-center gap-3 justify-self-end">
            <Link
              href="/#contact-us"
              className="hidden md:inline-flex rounded-full bg-env-green text-white text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-env-green-dark transition-colors"
            >
              Contact Us
            </Link>
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden md:flex env-header-search-icon-btn items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-neutral-800 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/2025/11/search.png"
                alt=""
                className="w-[18px] h-[18px]"
              />
            </button>
            {/* Mobile hamburger — visible <=767px only */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden env-mobile-hamburger"
            >
              <span aria-hidden></span>
              <span aria-hidden></span>
              <span aria-hidden></span>
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileMenuOpen} nav={NAV} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
