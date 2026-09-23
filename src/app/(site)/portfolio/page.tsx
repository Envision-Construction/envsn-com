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

// Placeholder projects — two per segment — so the page demonstrates the
// layout before real jobs and photos are entered in Sanity. Photos are
// reused from elsewhere on the site. Every entry is flagged `sample` so the
// card shows a small "Sample" badge; the flag (and this list) go away once
// portfolioProject documents exist.
const SAMPLE_PROJECTS: PortfolioProject[] = [
  {
    id: 'mf-1',
    sample: true,
    sector: 'Multifamily',
    name: 'Alston Commons',
    location: 'Atlanta, GA',
    completed: '2024',
    description:
      'Four-story wrap community with a structured parking deck, resort-style amenity courtyard and 12,000 SF of ground-floor retail.',
    stats: [
      { value: '286', label: 'Units' },
      { value: '4', label: 'Stories' },
      { value: '18 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/2961-Alston-SD-Model-lvl1.jpg',
  },
  {
    id: 'mf-2',
    sample: true,
    sector: 'Multifamily',
    name: 'Riverbend Flats',
    location: 'Chattanooga, TN',
    completed: '2023',
    description:
      'Garden-style community across nine residential buildings and a clubhouse, delivered in three phased turnovers to start leasing early.',
    stats: [
      { value: '212', label: 'Units' },
      { value: '9', label: 'Buildings' },
      { value: '3', label: 'Phases' },
    ],
    imageUrl: '/uploads/2024/05/Homepage_Drone.jpg',
  },
  {
    id: 'ho-1',
    sample: true,
    sector: 'Hospitality',
    name: 'Airport District Select-Service Hotel',
    location: 'Atlanta, GA',
    completed: '2023',
    description:
      'Five-story select-service hotel built to brand prototype with a rooftop bar, fitness center and 3,200 SF of meeting space.',
    stats: [
      { value: '118', label: 'Keys' },
      { value: '5', label: 'Stories' },
      { value: '14 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/envision-image3-989695.png',
  },
  {
    id: 'ho-2',
    sample: true,
    sector: 'Hospitality',
    name: 'Extended-Stay Hotel',
    location: 'Greenville, SC',
    completed: '2024',
    description:
      'Four-story extended-stay hotel with full in-room kitchens, delivered ahead of the brand opening date on a tight urban site.',
    stats: [
      { value: '96', label: 'Keys' },
      { value: '4', label: 'Stories' },
      { value: '62K', label: 'SF' },
    ],
    imageUrl: '/uploads/2024/05/bg-img-home-section-3-1-778519.jpg',
  },
  {
    id: 'in-1',
    sample: true,
    sector: 'Industrial',
    name: 'Northgate Logistics Center',
    location: 'Columbus, OH',
    completed: '2024',
    description:
      "Cross-dock tilt-wall distribution center with 40' clear height, 90 dock doors and ESFR sprinklers, built speculative and leased before turnover.",
    stats: [
      { value: '412K', label: 'SF' },
      { value: "40'", label: 'Clear' },
      { value: '90', label: 'Dock doors' },
    ],
    imageUrl: '/uploads/2024/05/header_bkd.jpg',
  },
  {
    id: 'in-2',
    sample: true,
    sector: 'Industrial',
    name: 'Flex Industrial Park, Phase II',
    location: 'Charlotte, NC',
    completed: '2023',
    description:
      'Three rear-load flex buildings with demisable bays from 6,000 SF, shared truck courts and full site infrastructure.',
    stats: [
      { value: '168K', label: 'SF' },
      { value: '3', label: 'Buildings' },
      { value: '11 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/commercial-bk.png',
  },
  {
    id: 'sd-1',
    sample: true,
    sector: 'Site Development',
    name: 'Highway 20 Commerce Park Sitework',
    location: 'Cumming, GA',
    completed: '2024',
    description:
      'Mass grading, site balancing and wet/dry utilities for a 64-acre commerce park, with drone-surveyed earthwork verified weekly.',
    stats: [
      { value: '64', label: 'Acres' },
      { value: '410K', label: 'CY moved' },
      { value: '7 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/Homepage_Drone.jpg',
  },
  {
    id: 'sd-2',
    sample: true,
    sector: 'Site Development',
    name: 'Lakeside Parkway Extension',
    location: 'Gainesville, GA',
    completed: '2023',
    description:
      'New 1.8-mile parkway with two signalized intersections, regional stormwater ponds and utility corridors serving three future pads.',
    stats: [
      { value: '1.8 mi', label: 'Roadway' },
      { value: '2', label: 'Signals' },
      { value: '3', label: 'Pads served' },
    ],
    imageUrl: '/uploads/2024/05/preconsteuction-bk.png',
  },
  {
    id: 'ss-1',
    sample: true,
    sector: 'Self Storage',
    name: 'Peachtree Climate-Controlled Storage',
    location: 'Peachtree Corners, GA',
    completed: '2024',
    description:
      'Four-story climate-controlled facility with a ground-floor showroom, two freight elevators and covered drive-through loading.',
    stats: [
      { value: '108K', label: 'SF' },
      { value: '812', label: 'Units' },
      { value: '4', label: 'Stories' },
    ],
    imageUrl: '/uploads/2024/05/architectural-bk.png',
  },
  {
    id: 'ss-2',
    sample: true,
    sector: 'Self Storage',
    name: 'Midtown Drive-Up Storage',
    location: 'Nashville, TN',
    completed: '2023',
    description:
      'Single-story drive-up storage across six buildings with gated access, LED site lighting and an on-site management office.',
    stats: [
      { value: '62K', label: 'SF' },
      { value: '6', label: 'Buildings' },
      { value: '9 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/bg-img-home-section-3-1-778519.jpg',
  },
  {
    id: 're-1',
    sample: true,
    sector: 'Retail',
    name: 'Village Center Shops',
    location: 'Alpharetta, GA',
    completed: '2024',
    description:
      'Ground-up neighborhood center with twelve in-line tenants, two restaurant end caps with patios and a coordinated multi-tenant opening.',
    stats: [
      { value: '48K', label: 'SF' },
      { value: '12', label: 'Tenants' },
      { value: '10 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/envision-image3-989695.png',
  },
  {
    id: 're-2',
    sample: true,
    sector: 'Retail',
    name: 'Grocery-Anchored Retail Pad',
    location: 'Birmingham, AL',
    completed: '2023',
    description:
      'Shell and site delivery for a grocery-anchored outparcel, including a drive-through pharmacy lane and shared-access improvements.',
    stats: [
      { value: '22K', label: 'SF' },
      { value: '1', label: 'Anchor' },
      { value: '8 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/commercial-bk.png',
  },
  {
    id: 'go-1',
    sample: true,
    sector: 'Government',
    name: 'County Fire Station No. 7',
    location: 'Forsyth County, GA',
    completed: '2024',
    description:
      'Three-bay fire station with dormitories, training tower and emergency generator, delivered under a competitively bid public contract.',
    stats: [
      { value: '14.5K', label: 'SF' },
      { value: '3', label: 'Bays' },
      { value: '13 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/header_bkd.jpg',
  },
  {
    id: 'go-2',
    sample: true,
    sector: 'Government',
    name: 'Municipal Public Works Facility',
    location: 'Marietta, GA',
    completed: '2023',
    description:
      'Administrative offices, heavy-equipment maintenance bays and covered fleet storage on a consolidated city operations campus.',
    stats: [
      { value: '38K', label: 'SF' },
      { value: '6', label: 'Maint. bays' },
      { value: '12 mo', label: 'Schedule' },
    ],
    imageUrl: '/uploads/2024/05/2961-Alston-SD-Model-lvl1.jpg',
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
  return real.length > 0 ? real : SAMPLE_PROJECTS
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
