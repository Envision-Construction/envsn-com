import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from 'next-sanity'

import { ContactForm } from '@/components/ContactForm'
import { PreconSites } from '@/components/PreconSites'
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
// site, each paired with its captured looping background video plus the
// expanded heading + body copy. Once the preConstructionPage singleton is
// seeded in Sanity, these defaults are replaced by editor-provided content.
const FALLBACK_SERVICES = [
  {
    title: '3D Site Mapping',
    videoUrl: '/videos/3D-Site-Mapping_01.mp4',
    headingBold: 'Elevate',
    headingRest: 'Your',
    headingLine2: 'Vantage Point.',
    bodyParagraphs: [
      "Have a plot or property to survey? Get it done quickly and benefit your bottom line. With the help of aerial drones, lidar mapping, and photogrammetry, you'll cut the time and effort of a typical survey team down to an hour-long, one-man process. Once complete, you'll receive a pinpoint accurate 3D representation of your site and our expert analysis.",
    ],
  },
  {
    title: 'Site Balancing Analysis',
    videoUrl: '/videos/Site-Balancing_01.mp4',
    headingBold: 'Minimize Costs.',
    headingRest: '',
    headingLine2: 'Maximize Possibilities.',
    bodyParagraphs: [
      "Rugged, uneven plot? We'll show you just how much potential is hidden beneath the surface. Once 3D site mapping is complete, our experts go to work utilizing your data to optimize your site, maximizing the area you can build on. With this, we balance your site, minimizing land brought in and maximizing the return on land taken out.",
    ],
  },
  {
    title: 'Testfit Site Layout',
    videoUrl: '/videos/Testfit_01.mp4',
    headingBold: 'Explore',
    headingRest: 'Every',
    headingLine2: 'Possibility at Once.',
    bodyParagraphs: [
      'Unmatched, immediate cost insights, visibility into every opportunity in your plot, and real-time 3D renders - our partnership with TestFit™ takes our expertise to another level.',
      "Using the AI-driven TestFit system, we'll build your site from parcel data to evaluate design schemes and their financial impact immediately. We compare the cost of production with your estimated ROI data to produce a return timeline and pro forma valuation in real-time. From there, we'll iterate all potential concept designs rapidly while considering zoning, building code, unit mixes, and other parameters. Then, the fun part — we'll bring your build to life in fully comprehensive and detailed 3D renderings.",
    ],
  },
  {
    title: 'Pricing & Report',
    videoUrl: '/videos/Pricing-and-Report.mp4',
    headingBold: 'Plan',
    headingRest: 'with',
    headingLine2: 'Transparency.',
    bodyParagraphs: [
      'Quick planning makes for a quicker start to your build. Utilizing AI technology, we identify your break-even point, craft a complete project timeline, and provide a full cost analysis report so you can get started on what matters most - getting the job done right.',
    ],
  },
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
      {/* ============= HERO (faded construction-site backdrop + arrow CTA) ============= */}
      <section className="env-precon-hero">
        <div className="env-precon-hero-content">
          <p className="env-eyebrow">
            {page?.heroEyebrow ?? 'Site Planning'}
          </p>
          <h1 className="env-precon-hero-heading">
            {page?.heroHeading ?? 'Next-Gen Preconstruction Services'}
          </h1>
          {page?.heroBody && page.heroBody.length > 0 ? (
            <div className="env-precon-hero-body">
              <PortableText value={page.heroBody} />
            </div>
          ) : (
            <div className="env-precon-hero-body">
              <p>
                Whether it&apos;s the construction industry as a whole or your
                property, we&apos;re in the business of transformation. It all
                starts with analyzing your site and crafting the perfect plan
                to maximize your investment. Utilizing the latest tech, like
                aerial drones, photogrammetry, TestFit technology, and AI
                analysis, we turn weeks of planning into days, and guesswork
                into precise evaluations.
              </p>
            </div>
          )}
        </div>
        <a
          href="#precon-services"
          className="env-precon-hero-arrow"
          aria-label="Scroll to 3D Site Mapping"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* ============= 4 FULL-WIDTH VIDEO PANELS (click to expand) ============= */}
      <PreconSites services={services} />

      {/* ============= CONTACT FORM — above the global footer ============= */}
      <section id="contact-us" className="bg-env-bg-soft text-env-dark-1 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-env-green">
            {page?.ctaHeading ?? 'Ground Breaking Starts Here'}
          </h2>
          {page?.ctaBody && page.ctaBody.length > 0 ? (
            <div className="mt-6 text-base leading-relaxed text-neutral-700">
              <PortableText value={page.ctaBody} />
            </div>
          ) : (
            <div className="mt-6 text-base leading-relaxed text-neutral-700 space-y-4">
              <p>
                If you&apos;re wondering where to start, we&apos;ve got your
                back. Need us to pick up where someone left off? We can help
                with that too. We&apos;ll craft a game plan fit for your
                practical and financial realities.
              </p>
              <p>
                For project examples, questions, and more, reach out today.
              </p>
            </div>
          )}
          <div className="mt-12 flex justify-center">
            <ContactForm
              messageLabel="What services are you interested in?"
              source="Preconstruction"
            />
          </div>
        </div>
      </section>
    </>
  )
}
