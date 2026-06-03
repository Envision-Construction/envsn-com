import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

import { ContactForm } from '@/components/ContactForm'
import { client } from '@/sanity/client'
import { preConstructionPageQuery } from '@/sanity/queries'

export const revalidate = 60

type ServiceCard = {
  title?: string
  eyebrow?: string
  headingLine1?: string
  headingLine2?: string
  body?: PortableTextBlock[]
  videoUrl?: string
  posterUrl?: string
}

type PreConstructionPage = {
  heroEyebrow?: string
  heroHeading?: string
  heroBody?: PortableTextBlock[]
  services?: ServiceCard[]
  ctaHeading?: string
  ctaBody?: PortableTextBlock[]
  metaTitle?: string
  metaDescription?: string
  ogImageUrl?: string
} | null

// Fallback service cards mirror the four sections that exist on the legacy
// site, each paired with its captured looping background video. Once the
// preConstructionPage singleton is seeded in Sanity, these defaults are
// replaced by editor-provided content.
const FALLBACK_SERVICES: ServiceCard[] = [
  { title: '3D Site Mapping', videoUrl: '/videos/3D-Site-Mapping_01.mp4' },
  { title: 'Site Balancing Analysis', videoUrl: '/videos/Site-Balancing_01.mp4' },
  { title: 'Testfit Site Layout', videoUrl: '/videos/Testfit_01.mp4' },
  { title: 'Pricing & Report', videoUrl: '/videos/Pricing-and-Report.mp4' },
]

async function getPage(): Promise<PreConstructionPage> {
  return client.fetch<PreConstructionPage>(preConstructionPageQuery).catch(() => null)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  return {
    title: page?.metaTitle ?? 'Pre-Construction',
    description: page?.metaDescription,
    openGraph: page?.ogImageUrl ? { images: [{ url: page.ogImageUrl }] } : undefined,
  }
}

export default async function PreConstructionPage() {
  const page = await getPage()
  const services =
    page?.services && page.services.length > 0 ? page.services : FALLBACK_SERVICES

  return (
    <>
      {/* ============= HERO ============= */}
      <section className="bg-white text-env-dark-1 py-24 md:py-32">
        <div className="env-container max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-env-green">
            {page?.heroEyebrow ?? 'Site Planning'}
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-light tracking-tight">
            {page?.heroHeading ?? 'Pre-Construction Services'}
          </h1>
          {page?.heroBody && page.heroBody.length > 0 && (
            <div className="mt-6 text-base md:text-lg leading-relaxed text-neutral-700">
              <PortableText value={page.heroBody} />
            </div>
          )}
        </div>
      </section>

      {/* ============= SERVICE CARDS (with looping background videos) ============= */}
      <section id="features" className="bg-env-bg-light py-20 md:py-28">
        <div className="env-container grid gap-12 md:grid-cols-2">
          {services.map((service, i) => (
            <article
              key={i}
              className="env-fullwidth-video relative aspect-video overflow-hidden rounded-lg bg-env-dark-1 group"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={service.posterUrl}
                className="env-fwv-video absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              >
                {service.videoUrl && <source src={service.videoUrl} type="video/mp4" />}
              </video>
              <div className="env-fwv-details relative z-10 flex h-full flex-col justify-end p-6 text-white">
                <h3 className="env-fwv-title text-2xl md:text-3xl font-light">
                  {service.title}
                </h3>
                {(service.headingLine1 || service.headingLine2) && (
                  <p className="env-fwv-details-title mt-2 text-lg text-env-accent">
                    {service.headingLine1}
                    {service.headingLine2 && (
                      <>
                        <br />
                        {service.headingLine2}
                      </>
                    )}
                  </p>
                )}
                {service.body && service.body.length > 0 && (
                  <div className="env-fwv-details-description mt-4 text-sm leading-relaxed text-neutral-200 max-w-md">
                    <PortableText value={service.body} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============= CLOSING CTA + FORM ============= */}
      <section className="bg-env-dark-1 text-white py-20 md:py-28">
        <div className="env-container max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            {page?.ctaHeading ?? 'Ground Breaking Starts Here'}
          </h2>
          {page?.ctaBody && page.ctaBody.length > 0 && (
            <div className="mt-6 text-base leading-relaxed text-neutral-200">
              <PortableText value={page.ctaBody} />
            </div>
          )}
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
