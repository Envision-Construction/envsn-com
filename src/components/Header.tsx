import Link from 'next/link'

/**
 * Site header — matches the legacy Divi build's nav structure.
 * Renders on every page via the root layout.
 *
 * Anchor links target sections on the home page (Culture, Expertise, People,
 * Contact Us). Pre Construction routes to /pre-construction. Careers is
 * external (separate subdomain, out of scope for this migration).
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
  return (
    <header className="env-header sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="env-container flex items-center justify-between py-4">
        <Link href="/" aria-label="Envision Construction — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/2024/05/logo_footer_prime.png"
            alt="Envision Construction"
            width={200}
            height={36}
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
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
          <Link
            href="/#contact-us"
            className="rounded-full bg-env-green text-white text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-env-green-dark transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile placeholder — full menu can be added later */}
        <Link
          href="/#contact-us"
          className="md:hidden rounded-full bg-env-green text-white text-xs font-semibold uppercase tracking-wider px-4 py-2"
        >
          Contact
        </Link>
      </div>
    </header>
  )
}
