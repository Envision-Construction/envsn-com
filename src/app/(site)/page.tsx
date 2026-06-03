import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

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

  return (
    <>
      {/* ============= HERO ============= */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-env-dark-1 text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={page?.heroPosterUrl}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        >
          <source
            src={page?.heroVideoUrl ?? '/videos/envision-video.mp4'}
            type="video/mp4"
          />
        </video>
        <div className="relative z-10 env-container flex h-full items-center">
          <h1 className="env-animated-title home-heading max-w-3xl font-light tracking-tight">
            <span className="env-at-title block text-4xl md:text-6xl lg:text-7xl">
              {page?.heroHeadingLine1 ?? 'Construction is broken.'}
            </span>
            <span className="env-at-title env-at-title-line-2 block text-4xl md:text-6xl lg:text-7xl text-env-accent">
              {page?.heroHeadingLine2 ?? "We're fixing it."}
            </span>
          </h1>
        </div>
      </section>

      {/* ============= ABOUT ============= */}
      <Section
        id="culture"
        eyebrow={page?.aboutEyebrow ?? 'Culture'}
        heading={page?.aboutHeading ?? 'About Us'}
      >
        <PortableTextOrFallback
          value={page?.aboutBody}
          fallback="Edit this section in the Studio."
        />
      </Section>

      {/* ============= DIVERSITY ============= */}
      <Section
        eyebrow={page?.diversityEyebrow ?? 'Culture'}
        heading={page?.diversityHeading ?? 'Diversity'}
        image={page?.diversityImageUrl ?? '/uploads/2024/05/culture-diversity-f.png'}
      >
        <PortableTextOrFallback
          value={page?.diversityBody}
          fallback="Edit this section in the Studio."
        />
      </Section>

      {/* ============= TECHNOLOGY ============= */}
      <Section
        eyebrow={page?.technologyEyebrow ?? 'Culture'}
        heading={page?.technologyHeading ?? 'Technology'}
      >
        <PortableTextOrFallback
          value={page?.technologyBody}
          fallback="Edit this section in the Studio."
        />
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

      {/* ============= EXPERTISE ============= */}
      <Section
        id="expertise"
        eyebrow={page?.expertiseEyebrow ?? 'Expertise'}
        heading={page?.expertiseHeading ?? 'Sectors We Build In'}
      >
        <PortableTextOrFallback value={page?.expertiseBody} fallback="" />
        {page?.sectors && page.sectors.length > 0 && (
          <div className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {page.sectors.map((s) => (
              <div key={s._id} className="text-center">
                {s.iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.iconUrl} alt={s.name ?? ''} className="mx-auto h-20 w-20 object-contain" />
                )}
                <p className="mt-3 text-sm font-medium text-neutral-800">{s.name}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ============= PEOPLE ============= */}
      <Section
        id="people"
        eyebrow={page?.peopleEyebrow ?? 'People'}
        heading={page?.peopleHeading ?? 'Our Team'}
      >
        <PortableTextOrFallback value={page?.peopleBody} fallback="" />
        {page?.teamMembers && page.teamMembers.length > 0 && (
          <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {page.teamMembers.map((m) => (
              <div key={m._id} className="text-center">
                {m.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={m.name ?? ''}
                    className="mx-auto h-40 w-40 object-cover rounded-full"
                  />
                )}
                <p className="mt-4 text-sm font-semibold text-neutral-900">{m.name}</p>
                <p className="text-xs text-neutral-600 uppercase tracking-wider">{m.role}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ============= CONTACT ============= */}
      <Section
        id="contact-us"
        eyebrow={page?.contactEyebrow ?? 'Contact'}
        heading={page?.contactHeading ?? 'Get in touch.'}
        dark
      >
        <PortableTextOrFallback
          value={page?.contactBody}
          fallback="We respond within one business day."
          dark
        />
        <div className="mt-10">
          <ContactForm />
        </div>
      </Section>
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
