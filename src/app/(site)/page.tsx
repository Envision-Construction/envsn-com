import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

import { AnimatedTitle } from '@/components/AnimatedTitle'
import { ContactForm } from '@/components/ContactForm'
import { client } from '@/sanity/client'
import { homePageQuery } from '@/sanity/queries'

export const revalidate = 60

type Feature = {
  title?: string
  description?: string
  imageUrl?: string
}

type Sector = {
  _id: string
  name?: string
  description?: string
  iconUrl?: string
  order?: number
}

type TeamMember = {
  _id: string
  name?: string
  role?: string
  photoUrl?: string
  order?: number
}

type HomePage = {
  heroHeadingLine1?: string
  heroHeadingLine2?: string
  heroVideoUrl?: string
  heroPosterUrl?: string
  aboutEyebrow?: string
  aboutHeading?: string
  aboutBody?: PortableTextBlock[]
  diversityEyebrow?: string
  diversityHeading?: string
  diversityBody?: PortableTextBlock[]
  diversityImageUrl?: string
  technologyEyebrow?: string
  technologyHeading?: string
  technologyBody?: PortableTextBlock[]
  technologyFeatures?: Feature[]
  expertiseEyebrow?: string
  expertiseHeading?: string
  expertiseBody?: PortableTextBlock[]
  sectors?: Sector[]
  peopleEyebrow?: string
  peopleHeading?: string
  peopleBody?: PortableTextBlock[]
  teamMembers?: TeamMember[]
  contactEyebrow?: string
  contactHeading?: string
  contactBody?: PortableTextBlock[]
  metaTitle?: string
  metaDescription?: string
  ogImageUrl?: string
} | null

async function getHomePage(): Promise<HomePage> {
  return client.fetch<HomePage>(homePageQuery).catch(() => null)
}

/* ============================================================
 * Fallback content — used when the Sanity document is empty.
 * Mirrors the section structure of the legacy site so a visitor
 * sees the same layout even before Sanity is seeded.
 * ============================================================ */

const FALLBACK_SECTORS = [
  { name: 'Multifamily', iconPath: '/uploads/2025/10/Envision-Icons-Iso-01-Multifamily.png' },
  { name: 'Hospitality', iconPath: '/uploads/2025/10/Envision-Icons-Iso-02-Hospitality.png' },
  { name: 'Industrial', iconPath: '/uploads/2025/10/Envision-Icons-Iso-03-Industrial.png' },
  { name: 'Site Development', iconPath: '/uploads/2025/10/Envision-Icons-Iso-04-Site-Development.png' },
  { name: 'Self Storage', iconPath: '/uploads/2025/10/Envision-Icons-Iso-05-Self-Storage.png' },
  { name: 'Retail', iconPath: '/uploads/2025/10/Envision-Icons-Iso-06-Retail.png' },
]

const FALLBACK_CAPABILITY_TILES = [
  { title: 'Pre Construction', bg: '/uploads/2024/05/preconsteuction-bk.png', href: '/pre-construction' },
  { title: 'Architectural Design', bg: '/uploads/2024/05/architectural-bk.png', href: '#' },
  { title: 'Commercial Construction', bg: '/uploads/2024/05/commercial-bk.png', href: '#' },
]

const FALLBACK_TEAM = [
  { name: 'Avi Reddy', photo: '/uploads/2024/06/Avi_Reddy.png' },
  { name: 'Zach Walldorff', photo: '/uploads/2024/06/Zach_Walldorff.png' },
  { name: 'David Epps', photo: '/uploads/2024/06/David_Epps.png' },
  { name: 'Adam Meier', photo: '/uploads/2025/09/Adam-Meier.png' },
  { name: 'Donald Hayes', photo: '/uploads/2025/12/Donald-Hayes.png' },
]

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage()
  return {
    title: page?.metaTitle,
    description: page?.metaDescription,
    openGraph: page?.ogImageUrl ? { images: [{ url: page.ogImageUrl }] } : undefined,
  }
}

export default async function HomePage() {
  const page = await getHomePage()

  const sectors =
    page?.sectors && page.sectors.length > 0
      ? page.sectors.map((s) => ({
          name: s.name ?? '',
          iconPath: s.iconUrl ?? '',
        }))
      : FALLBACK_SECTORS

  const team =
    page?.teamMembers && page.teamMembers.length > 0
      ? page.teamMembers.map((m) => ({
          name: m.name ?? '',
          photo: m.photoUrl ?? '',
        }))
      : FALLBACK_TEAM

  return (
    <>
      {/* ============= TAGLINE BAND (fades in on initial load) ============= */}
      <div className="env-tagline-band">BUILD WITH INTELLIGENCE.</div>

      {/* ============= ANIMATED TITLE (own section, above the video) ============= */}
      <section className="bg-white">
        <AnimatedTitle
          line1={page?.heroHeadingLine1 ?? 'Construction is broken.'}
          line2={page?.heroHeadingLine2 ?? "We're fixing it."}
        />
      </section>

      {/* ============= HERO VIDEO (separate section, full-bleed) ============= */}
      <section className="env-video-section relative w-full overflow-hidden bg-env-dark-1">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={page?.heroPosterUrl}
          className="block w-full h-auto"
        >
          <source
            src={page?.heroVideoUrl ?? '/videos/envision-video.mp4'}
            type="video/mp4"
          />
        </video>
      </section>

      {/* ============= ABOUT ============= */}
      <Section
        id="culture"
        eyebrow={page?.aboutEyebrow ?? 'Culture'}
        heading={page?.aboutHeading ?? 'About Us'}
      >
        <PortableTextOrFallback value={page?.aboutBody} fallback="" />
      </Section>

      {/* ============= DIVERSITY ============= */}
      <Section
        eyebrow={page?.diversityEyebrow ?? 'Culture'}
        heading={page?.diversityHeading ?? 'Diversity'}
        image={page?.diversityImageUrl ?? '/uploads/2024/05/culture-diversity-f.png'}
      >
        <PortableTextOrFallback value={page?.diversityBody} fallback="" />
      </Section>

      {/* ============= TECHNOLOGY ============= */}
      <Section
        eyebrow={page?.technologyEyebrow ?? 'Culture'}
        heading={page?.technologyHeading ?? 'Technology'}
      >
        <PortableTextOrFallback value={page?.technologyBody} fallback="" />
        {page?.technologyFeatures && page.technologyFeatures.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {page.technologyFeatures.map((f, i) => (
              <article key={i} className="rounded-lg overflow-hidden bg-white shadow-sm border border-neutral-200">
                {f.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.imageUrl} alt={f.title ?? ''} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-env-green">{f.title}</h3>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* ============= TESTIMONIAL — Ryan Pastor ============= */}
      <section className="bg-env-bg-soft py-20 md:py-28">
        <div className="env-container max-w-3xl text-center">
          <blockquote className="text-2xl md:text-3xl font-light leading-snug text-env-dark-1">
            &ldquo;The innovation tech stack Envision is building will
            revolutionize the construction industry.&rdquo;
          </blockquote>
          <p className="mt-8 text-lg font-semibold text-env-green">Ryan Pastor</p>
          <p className="text-sm uppercase tracking-wider text-neutral-600">
            Manager, BuildingPoint SouthEast
          </p>
        </div>
      </section>

      {/* ============= CAPABILITIES (6 sector icons + 3 service tiles) ============= */}
      <section id="expertise" className="bg-white py-20 md:py-28">
        <div className="env-container">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-env-green">
              Expertise
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">
              Capabilities
            </h2>
          </div>

          {/* Sector icons grid */}
          <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {sectors.map((s) => (
              <div key={s.name} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.iconPath}
                  alt={s.name}
                  className="mx-auto h-24 w-24 object-contain"
                />
                <p className="mt-3 text-sm font-medium text-neutral-800">
                  {s.name}
                </p>
              </div>
            ))}
          </div>

          {/* Service tiles (photo-backgrounded cards) */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {FALLBACK_CAPABILITY_TILES.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                className="env-tiles-tile relative block aspect-[4/3] overflow-hidden rounded-lg group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.bg}
                  alt=""
                  className="env-tiles-tile-background absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-2xl font-light text-white">
                  {tile.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============= EXECUTIVE TEAM ============= */}
      <section id="people" className="bg-env-bg-light py-20 md:py-28">
        <div className="env-container">
          <div className="max-w-3xl text-center mx-auto">
            <p className="text-xs uppercase tracking-widest text-env-green">
              People
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">
              Meet Our Executive Team
            </h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={m.name}
                  className="mx-auto h-48 w-48 object-cover rounded-full"
                />
                <p className="mt-4 text-base font-semibold text-neutral-900">
                  {m.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= READY TO TALK? (contact form) ============= */}
      <section id="contact-us" className="bg-env-dark-1 text-white py-20 md:py-28">
        <div className="env-container max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-env-accent">
            {page?.contactEyebrow ?? 'Contact'}
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">
            {page?.contactHeading ?? 'Ready to Talk?'}
          </h2>
          <PortableTextOrFallback
            value={page?.contactBody}
            fallback=""
            dark
          />
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}

/* ============================================================
 * Local helpers
 * ============================================================ */

function Section({
  id,
  eyebrow,
  heading,
  image,
  dark = false,
  children,
}: {
  id?: string
  eyebrow?: string
  heading?: string
  image?: string
  dark?: boolean
  children?: React.ReactNode
}) {
  const tone = dark
    ? 'bg-env-dark-1 text-white'
    : 'bg-white text-env-dark-1'
  return (
    <section id={id} className={`${tone} py-20 md:py-28`}>
      <div className="env-container">
        {(eyebrow || heading) && (
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-widest text-env-green">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">
                {heading}
              </h2>
            )}
          </div>
        )}
        <div className={`mt-8 ${image ? 'grid md:grid-cols-2 gap-12 items-center' : ''}`}>
          <div className="prose max-w-none">{children}</div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full rounded-lg object-cover" />
          )}
        </div>
      </div>
    </section>
  )
}

function PortableTextOrFallback({
  value,
  fallback,
  dark = false,
}: {
  value?: PortableTextBlock[]
  fallback?: string
  dark?: boolean
}) {
  const className = dark ? 'text-neutral-200' : 'text-neutral-700'
  if (!value || value.length === 0) {
    return fallback ? <p className={`text-base leading-relaxed ${className}`}>{fallback}</p> : null
  }
  return (
    <div className={`text-base leading-relaxed ${className}`}>
      <PortableText value={value} />
    </div>
  )
}
