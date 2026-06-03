import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

import { CapabilitiesSection } from '@/components/CapabilitiesSection'
import { ContactForm } from '@/components/ContactForm'
import { ExecutiveTeam } from '@/components/ExecutiveTeam'
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

const FALLBACK_SECTORS = [
  { name: 'Multifamily', iconPath: '/uploads/2025/10/Envision-Icons-Iso-01-Multifamily.png' },
  { name: 'Hospitality', iconPath: '/uploads/2025/10/Envision-Icons-Iso-02-Hospitality.png' },
  { name: 'Industrial', iconPath: '/uploads/2025/10/Envision-Icons-Iso-03-Industrial.png' },
  { name: 'Site Development', iconPath: '/uploads/2025/10/Envision-Icons-Iso-04-Site-Development.png' },
  { name: 'Self Storage', iconPath: '/uploads/2025/10/Envision-Icons-Iso-05-Self-Storage.png' },
  { name: 'Retail', iconPath: '/uploads/2025/10/Envision-Icons-Iso-06-Retail.png' },
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

  return (
    <>
      {/* ============= HERO — BUILD WITH INTELLIGENCE. (left-aligned, fade-in) ============= */}
      <section className="env-hero-tagline">
        <h1 className="env-hero-tagline-text">
          <span className="env-hero-tagline-outline">BUILD WITH </span>
          <span className="env-hero-tagline-solid">INTELLIGENCE.</span>
        </h1>
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
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* ============= TESTIMONIAL — Ryan Pastor (right-aligned, light bg) ============= */}
      <section className="env-quote-section">
        <blockquote className="env-quote-body">
          &ldquo;The innovation tech stack Envision is building will revolutionize
          the construction industry.&rdquo;
        </blockquote>
        <div className="env-quote-author">
          <p className="env-quote-author-name">Ryan Pastor</p>
          <p className="env-quote-author-role">Manager, BuildingPoint SouthEast</p>
        </div>
      </section>

      {/* ============= CAPABILITIES (sectors + 3 photo tiles + LiDAR detail) ============= */}
      <section id="expertise" className="bg-white py-20 md:py-28">
        <div className="env-container">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-env-green">Expertise</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">Capabilities</h2>
          </div>

          {/* Sector icons row */}
          <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {sectors.map((s) => (
              <div key={s.name} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.iconPath} alt={s.name} className="mx-auto h-24 w-24 object-contain" />
                <p className="mt-3 text-sm font-medium text-neutral-800">{s.name}</p>
              </div>
            ))}
          </div>

          {/* Three 600px tiles with hover interactions + LiDAR detail expansion */}
          <div className="mt-16">
            <CapabilitiesSection />
          </div>
        </div>
      </section>

      {/* ============= EXECUTIVE TEAM (carousel, 3-at-a-time) ============= */}
      <section id="people" className="bg-white py-20 md:py-28">
        <div className="env-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-widest text-env-green">People</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">
              Meet Our Executive Team
            </h2>
          </div>
          <div className="mt-12">
            <ExecutiveTeam />
          </div>
        </div>
      </section>

      {/* ============= READY TO TALK? (contact form, light bg) ============= */}
      <section id="contact-us" className="bg-env-bg-soft text-env-dark-1 py-20 md:py-28">
        <div className="env-container max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            {page?.contactHeading ?? 'Ready to Talk?'}
          </h2>
          <p className="mt-4 text-base text-neutral-700">
            Find out more information about what we can accomplish together.
          </p>
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
  const tone = dark ? 'bg-env-dark-1 text-white' : 'bg-white text-env-dark-1'
  return (
    <section id={id} className={`${tone} py-20 md:py-28`}>
      <div className="env-container">
        {(eyebrow || heading) && (
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-widest text-env-green">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">{heading}</h2>
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
    return fallback ? (
      <p className={`text-base leading-relaxed ${className}`}>{fallback}</p>
    ) : null
  }
  return (
    <div className={`text-base leading-relaxed ${className}`}>
      <PortableText value={value} />
    </div>
  )
}
