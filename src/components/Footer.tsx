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
 * Site footer — three-column layout matching the legacy:
 *   1) White logo + social icons + copyright
 *   2) Quick Links (Culture, Expertise, People, Pre Construction)
 *   3) Contact (phone, address) + IICRC Certified Firm badge
 *
 * The footer logo asset (logo_footer_prime.png) is dark; we invert it
 * via CSS filter to render white on the dark footer background.
 */
export async function Footer() {
  const settings = await getSiteSettings()

  const phone = settings?.contactPhone ?? '844-4-ENVSN.CO'
  const address =
    settings?.address ??
    '8601 Dunwoody Pl\nSuite 200\nSandy Springs, GA 30350'

  return (
    <footer className="env-footer bg-env-dark-1 text-white">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-16 grid gap-12 md:grid-cols-3 items-start">
        {/* Col 1 — logo + social + copyright */}
        <div className="flex flex-col items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/2024/05/logo_footer_prime.png"
            alt="Envision Construction"
            width={220}
            height={40}
            className="h-10 w-auto env-footer-logo"
          />
          <div className="mt-6 flex items-center justify-start gap-3">
            <a
              href="https://www.linkedin.com/company/envsn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-8 w-8 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/2024/05/linkedin_icon.png"
                alt=""
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://www.instagram.com/envsn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-8 w-8 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/2024/05/Insta_icon.png"
                alt=""
                className="h-6 w-6"
              />
            </a>
          </div>
          <p className="mt-8 text-xs text-neutral-400">
            © {new Date().getFullYear()} Envision Construction. All rights reserved
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div className="flex flex-col items-start">
          <h4 className="text-base font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li>
              <Link href="/#culture" className="hover:text-white">
                Culture
              </Link>
            </li>
            <li>
              <Link href="/#expertise" className="hover:text-white">
                Expertise
              </Link>
            </li>
            <li>
              <Link href="/#people" className="hover:text-white">
                People
              </Link>
            </li>
            <li>
              <Link href="/pre-construction" className="hover:text-white">
                Pre Construction
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 — Contact + IICRC badge */}
        <div className="flex flex-col items-start">
          <h4 className="text-base font-semibold text-white">Contact Us</h4>
          <p className="mt-4 text-sm text-neutral-300">
            <a href={`tel:${phone.replace(/[^0-9A-Za-z]/g, '')}`} className="hover:text-white">
              {phone}
            </a>
          </p>
          <address className="mt-4 not-italic text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
            {address}
          </address>
          <div className="mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/2024/05/footer-c-firm.png"
              alt="IICRC Certified Firm"
              className="h-24 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
