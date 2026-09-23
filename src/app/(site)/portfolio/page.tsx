import type { Metadata } from 'next'

import { ContactForm } from '@/components/ContactForm'
import { PortfolioGrid, type PortfolioProject } from '@/components/PortfolioGrid'
import { SECTORS, findSector } from '@/lib/sectors'
import { client } from '@/sanity/client'
import { portfolioProjectsQuery } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Completed construction projects by Envision across multifamily, hospitality, industrial, site development, self storage, retail and government.',
}

type PortfolioProjectDoc = {
  _id: string
  name?: string
  sector?: string
  location?: string
  completed?: string
  description?: string
  stats?: { label?: string; value?: string }[]
  imageUrl?: string
}

// Built-in project set, sourced from the Envision Statement of Qualifications
// (SOQ Rev. 7). Sanity `portfolioProject` documents take precedence once any
// exist; until then this list is what renders. Contract values are
// intentionally left off the public site.
const PROJECTS: PortfolioProject[] = [
  {
    id: 'ss-storagemax-flowood',
    sector: 'Self Storage',
    name: 'StorageMax',
    location: 'Flowood, MS',
    description:
      'New ground-up, three-story climate-controlled facility supplementing four existing drive-up buildings, adding 556 units and nearly 70,000 SF of storage to the site.',
    stats: [
      { value: '105K', label: 'SF' },
      { value: '556', label: 'Climate units' },
      { value: '3', label: 'Stories' },
    ],
    imageUrl: '/uploads/2026/09/storagemax-flowood.jpg',
  },
  {
    id: 'ss-storage-sense-macon',
    sector: 'Self Storage',
    name: 'Storage Sense',
    location: 'Macon, GA',
    description:
      'Full retrofit of an existing warehouse on a 7-acre lot into a two-story storage facility with 575 climate-controlled units and more than 63,000 SF of rentable storage.',
    stats: [
      { value: '85K', label: 'SF' },
      { value: '575', label: 'Climate units' },
      { value: '7', label: 'Acres' },
    ],
    imageUrl: '/uploads/2026/09/storage-sense-macon.jpg',
  },
  {
    id: 'ss-peachtree-valley',
    sector: 'Self Storage',
    name: 'Peachtree Valley Storage',
    location: 'Midtown Atlanta, GA',
    description:
      'Ground-up, in-fill, high-rise Class A storage facility on a quarter-acre site. The structure doubles as a retaining wall for a municipal street and enabled the expansion of the neighboring parking structure.',
    stats: [
      { value: '125K', label: 'SF' },
      { value: '10', label: 'Stories' },
      { value: '0.24', label: 'Acres' },
    ],
    imageUrl: '/uploads/2026/09/peachtree-valley-storage.jpg',
  },
  {
    id: 'ss-fairhope',
    sector: 'Self Storage',
    name: 'Fairhope Self-Storage',
    location: 'Fairhope, AL',
    description:
      'New ground-up Class A self-storage facility engineered to withstand hurricanes, built to Miami-Dade standards for a Category 1 hurricane-rated wind zone.',
    stats: [
      { value: '65K', label: 'SF' },
      { value: 'Class A', label: 'Facility' },
      { value: 'Cat 1', label: 'Wind rated' },
    ],
    imageUrl: '/uploads/2026/09/fairhope-self-storage.jpg',
  },
  {
    id: 'in-xpo-west-columbia',
    sector: 'Industrial',
    name: 'XPO Logistics',
    location: 'West Columbia, SC',
    description:
      'Renovation and expansion of an operating logistics terminal: 14,200 SF of existing space renovated plus an 18,000 SF addition, for 85 dock doors and 3,200 SF of renovated office.',
    stats: [
      { value: '32K', label: 'SF' },
      { value: '85', label: 'Dock doors' },
      { value: '18K', label: 'SF addition' },
    ],
    imageUrl: '/uploads/2026/09/xpo-west-columbia.jpg',
  },
  {
    id: 'in-xpo-columbus',
    sector: 'Industrial',
    name: 'XPO Logistics',
    location: 'Columbus, OH',
    description:
      'Dock addition to an existing 164,300 SF logistics facility with an enclosed dock office, new foundations and structural framing, full MEP and fire protection, life-safety and ADA upgrades, and site paving, grading and drainage.',
    stats: [
      { value: '74.1K', label: 'SF addition' },
      { value: '164K', label: 'SF facility' },
      { value: '3.6K', label: 'SF dock office' },
    ],
    imageUrl: '/uploads/2026/09/xpo-columbus.jpg',
  },
]

async function getProjects(): Promise<PortfolioProject[]> {
  const docs = await client
    .fetch<PortfolioProjectDoc[]>(portfolioProjectsQuery)
    .catch(() => [] as PortfolioProjectDoc[])
  const real = docs
    .filter((d) => d.name && d.sector)
    .map<PortfolioProject>((d) => ({
      id: d._id,
      name: d.name ?? '',
      sector: d.sector ?? '',
      location: d.location,
      completed: d.completed,
      description: d.description,
      stats: d.stats
        ?.filter((s) => s.label && s.value)
        .map((s) => ({ label: s.label ?? '', value: s.value ?? '' })),
      imageUrl: d.imageUrl,
    }))
  return real.length > 0 ? real : PROJECTS
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>
}) {
  const [projects, params] = await Promise.all([getProjects(), searchParams])
  const initialSector = findSector(params.sector)?.slug

  return (
    <>
      {/* ============= HERO ============= */}
      <section className="env-portfolio-hero">
        <div className="env-portfolio-hero-inner">
          <p className="env-eyebrow">Portfolio</p>
          <h1>Built Across Every Segment</h1>
          <p className="env-portfolio-hero-body">
            From podium multifamily to public-safety facilities, every project
            we deliver runs on the same disciplined process: transparent
            pricing, technology-driven planning and a team that sweats the
            details. Filter by segment to see how that plays out on the ground.
          </p>
        </div>
      </section>

      {/* ============= FILTERS + GRID ============= */}
      <section id="projects" className="bg-white py-16 md:py-20">
        <div className="env-container-narrow">
          <PortfolioGrid projects={projects} sectors={SECTORS} initialSector={initialSector} />
          <p className="mt-8 text-xs leading-relaxed text-neutral-500">
            Peachtree Valley Storage and Fairhope Self-Storage showcase recent project
            experience of the Envision Construction leadership team.
          </p>
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section id="contact-us" className="bg-env-bg-soft text-env-dark-1 py-20 md:py-28">
        <div className="env-container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Have a Project in Mind?
          </h2>
          <p className="mt-4 text-base text-neutral-700">
            Tell us about the site, the program and the timeline. We&apos;ll
            show you what it takes to build it right.
          </p>
          <div className="mt-12 flex justify-center">
            <ContactForm messageLabel="Tell us about your project" source="Portfolio" />
          </div>
        </div>
      </section>
    </>
  )
}
