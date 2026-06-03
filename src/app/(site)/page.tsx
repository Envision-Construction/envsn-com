import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

import { CapabilitiesSection } from '@/components/CapabilitiesSection'
import { ContactForm } from '@/components/ContactForm'
import { ExecutiveTeam } from '@/components/ExecutiveTeam'
import { HeroTagline } from '@/components/HeroTagline'
import { ScrollFade } from '@/components/ScrollFade'
import { TechnologyCarousel } from '@/components/TechnologyCarousel'
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

type TeamMemberDoc = {
  _id: string
  name?: string
  role?: string
  bio?: string
  photoUrl?: string
  order?: number
}

type CapabilityTileDoc = {
  title?: string
  description?: string
  imageUrl?: string
  href?: string
  ctaLabel?: string
  ctaDetailKey?: string
}

type HomePage = {
  heroHeadingLine1?: string
  heroHeadingLine2?: string
  heroVideoUrl?: string
  heroPosterUrl?: string
  aboutEyebrow?: string
  aboutHeading?: string
  aboutBody?: PortableTextBlock[]
  aboutImageUrl?: string
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
  capabilityTiles?: CapabilityTileDoc[]
  peopleEyebrow?: string
  peopleHeading?: string
  teamMembers?: TeamMemberDoc[]
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

  const technologyFeatures = page?.technologyFeatures?.map((f) => ({
    title: f.title ?? '',
    description: f.description ?? '',
    imageUrl: f.imageUrl ?? '',
  }))

  return (
    <>
      {/* ============= HERO — BUILD WITH INTELLIGENCE. (scroll-centered) ============= */}
      <HeroTagline />

      {/* ============= HERO VIDEO ============= */}
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

      {/* ============= ABOUT (image+text split) ============= */}
      <ScrollFade>
        <CultureSection
          id="culture"
          eyebrow={page?.aboutEyebrow ?? 'Culture'}
          heading={page?.aboutHeading ?? 'About Us'}
          image={page?.aboutImageUrl}
          body={page?.aboutBody}
        />
      </ScrollFade>

      {/* ============= DIVERSITY (image+text split) ============= */}
      <ScrollFade>
        <CultureSection
          eyebrow={page?.diversityEyebrow ?? 'Culture'}
          heading={page?.diversityHeading ?? 'Diversity'}
          image={page?.diversityImageUrl ?? '/uploads/2024/05/culture-diversity-f.png'}
          body={page?.diversityBody}
        />
      </ScrollFade>

      {/* ============= TECHNOLOGY (text left, carousel right — matches Diversity/About layout) ============= */}
      <ScrollFade>
        <section className="bg-white py-20 md:py-28">
          <div className="env-container-narrow">
            <div className="env-section-head">
              <p className="env-eyebrow">{page?.technologyEyebrow ?? 'Culture'}</p>
              <h2>{page?.technologyHeading ?? 'Technology'}</h2>
            </div>
            <div className="env-section-body env-section-split">
              <div className="text-base leading-relaxed text-neutral-700">
                <PortableTextOrFallback value={page?.technologyBody} fallback="" />
              </div>
              <TechnologyCarousel features={technologyFeatures} />
            </div>
          </div>
        </section>
      </ScrollFade>

      {/* ============= TESTIMONIAL — Ryan Pastor ============= */}
      <ScrollFade>
        <section className="env-quote-section">
          <blockquote className="env-quote-body">
            &ldquo;The innovation tech stack Envision is building{' '}
            <span className="env-quote-emphasis">
              will revolutionize the construction industry.&rdquo;
            </span>
          </blockquote>
          <div className="env-quote-author">
            <p className="env-quote-author-name">Ryan Pastor</p>
            <p className="env-quote-author-role">Manager, BuildingPoint SouthEast</p>
          </div>
        </section>
      </ScrollFade>

      {/* ============= CAPABILITIES ============= */}
      <ScrollFade>
        <section id="expertise" className="bg-white py-20 md:py-28">
          <div className="env-container-narrow">
            <div className="env-section-head">
              <p className="env-eyebrow">{page?.expertiseEyebrow ?? 'Expertise'}</p>
              <h2>{page?.expertiseHeading ?? 'Capabilities'}</h2>
            </div>
            <div className="env-section-body">
              <PortableTextOrFallback value={page?.expertiseBody} fallback="" />
            </div>

            <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {sectors.map((s) => (
                <div key={s.name} className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.iconPath} alt={s.name} className="mx-auto h-24 w-24 object-contain" />
                  <p className="mt-3 text-sm font-medium text-neutral-800">{s.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <CapabilitiesSection
                tiles={page?.capabilityTiles
                  ?.filter((t): t is CapabilityTileDoc & { title: string } =>
                    Boolean(t.title),
                  )
                  .map((t) => ({
                    title: t.title,
                    description: t.description,
                    imageUrl: t.imageUrl,
                    href: t.href,
                    ctaLabel: t.ctaLabel,
                    ctaDetailKey: t.ctaDetailKey,
                  }))}
              />
            </div>
          </div>
        </section>
      </ScrollFade>

      {/* ============= EXECUTIVE TEAM ============= */}
      <section id="people" className="bg-white py-20 md:py-28">
        <div className="env-container-narrow">
          <div className="env-section-head text-center mx-auto">
            <p className="env-eyebrow">{page?.peopleEyebrow ?? 'People'}</p>
            <h2>{page?.peopleHeading ?? 'Meet Our Executive Team'}</h2>
          </div>
          <div className="mt-12">
            <ExecutiveTeam
              members={page?.teamMembers
                ?.filter((m): m is TeamMemberDoc & { name: string } =>
                  Boolean(m.name),
                )
                .map((m) => ({
                  name: m.name,
                  role: m.role,
                  bio: m.bio,
                  photoUrl: m.photoUrl,
                }))}
            />
          </div>
        </div>
      </section>

      {/* ============= READY TO TALK? ============= */}
      <section id="contact-us" className="bg-env-bg-soft text-env-dark-1 py-20 md:py-28">
        <div className="env-container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            {page?.contactHeading ?? 'Ready to Talk?'}
          </h2>
          <p className="mt-4 text-base text-neutral-700">
            Find out more information about what we can accomplish together.
          </p>
          <div className="mt-12 flex justify-center">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}

/* ============================================================
 * CultureSection — image+text split with tighter spacing,
 * larger image column, and the new env-eyebrow / env-section-head /
 * env-section-split classes from globals.css.
 * ============================================================ */
function CultureSection({
  id,
  eyebrow,
  heading,
  image,
  body,
}: {
  id?: string
  eyebrow: string
  heading: string
  image?: string
  body?: PortableTextBlock[]
}) {
  return (
    <section id={id} className="bg-white py-20 md:py-28">
      <div className="env-container-narrow">
        <div className="env-section-head">
          <p className="env-eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <div className={image ? 'env-section-body env-section-split' : 'env-section-body'}>
          <div className="text-base leading-relaxed text-neutral-700">
            <PortableTextOrFallback value={body} fallback="" />
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="env-culture-image w-full object-cover" />
          )}
        </div>
      </div>
    </section>
  )
}

function PortableTextOrFallback({
  value,
  fallback,
}: {
  value?: PortableTextBlock[]
  fallback?: string
}) {
  if (!value || value.length === 0) {
    return fallback ? (
      <p className="text-base leading-relaxed text-neutral-700">{fallback}</p>
    ) : null
  }
  return (
    <div className="text-base leading-relaxed text-neutral-700">
      <PortableText value={value} />
    </div>
  )
}
