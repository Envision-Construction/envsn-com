import Link from 'next/link'

import { client } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'

type SiteSettings = {
  contactEmail?: string
  contactPhone?: string
  address?: string
  careersUrl?: string
  footerLogoUrl?: string
} | null

async function getSiteSettings(): Promise<SiteSettings> {
  return client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null)
}

/**
 * Site footer — mirrors the legacy structure (logo, contact, minority-owned
 * statement, address, ENVSN.COM mark). Pulls editable content from Sanity
 * siteSettings singleton; falls back to literal values from the legacy site
 * so the page renders correctly before Sanity is seeded.
 */
export async function Footer() {
  const settings = await getSiteSettings()

  const address =
    settings?.address ??
    '8601 Dunwoody Place, Ste 200\nSandy Springs, GA 30350'
  const phone = settings?.contactPhone ?? '470.228.0766'
  const email = settings?.contactEmail ?? 'info@envsn.com'
  const logoUrl =
    settings?.footerLogoUrl ?? '/uploads/2024/05/logo_footer_prime.png'

  return (
    <footer className="env-footer bg-env-dark-1 text-white">
      <div className="env-container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Envision Construction"
              width={220}
              height={40}
              className="h-10 w-auto invert brightness-200"
            />
            <p className="mt-6 text-sm text-neutral-300 leading-relaxed">
              Envision Construction is a Minority Owned Business.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-env-accent">
              Office
            </h4>
            <address className="mt-3 not-italic text-sm text-neutral-200 whitespace-pre-line leading-relaxed">
              {address}
            </address>
            <p className="mt-3 text-sm text-neutral-200">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-white">
                {phone}
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-env-accent">
              Contact
            </h4>
            <p className="mt-3 text-sm text-neutral-200">
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </p>
            <p className="mt-3 text-sm">
              <Link
                href={settings?.careersUrl ?? 'https://careers.envsn.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-200 hover:text-white uppercase tracking-wider"
              >
                Careers →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            ENVSN.COM
          </p>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Envision Construction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
