/**
 * The seven construction segments Envision builds in. Single source of truth
 * for the home-page Expertise icon row and the Portfolio page filters, so the
 * two never drift apart. Order here is display order.
 */
export type Sector = {
  name: string
  /** URL-safe key used by /portfolio?sector=… */
  slug: string
  iconPath: string
  /** One-line positioning statement shown above the filtered portfolio grid. */
  blurb: string
}

export const SECTORS: Sector[] = [
  {
    name: 'Multifamily',
    slug: 'multifamily',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-01-Multifamily.png',
    blurb:
      'Garden-style, wrap and podium communities delivered on schedule, from sitework through unit turnover.',
  },
  {
    name: 'Hospitality',
    slug: 'hospitality',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-02-Hospitality.png',
    blurb:
      'Select-service and extended-stay hotels built to brand standards and held to the opening date.',
  },
  {
    name: 'Industrial',
    slug: 'industrial',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-03-Industrial.png',
    blurb:
      'Tilt-wall distribution, flex and light-manufacturing space engineered for speed to occupancy.',
  },
  {
    name: 'Site Development',
    slug: 'site-development',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-04-Site-Development.png',
    blurb:
      'Mass grading, utilities, roads and stormwater that set every vertical build up for success.',
  },
  {
    name: 'Self Storage',
    slug: 'self-storage',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-05-Self-Storage.png',
    blurb:
      'Multi-story climate-controlled and drive-up storage delivered with tight cost control.',
  },
  {
    name: 'Retail',
    slug: 'retail',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-06-Retail.png',
    blurb:
      'Ground-up shopping centers, outparcels and tenant build-outs coordinated around opening day.',
  },
  {
    name: 'Government',
    slug: 'government',
    iconPath: '/uploads/2025/10/Envision-Icons-Iso-07-Government.png',
    blurb:
      'Municipal, public-safety and institutional facilities delivered under public procurement standards.',
  },
]

export function findSector(slugOrName?: string | null): Sector | undefined {
  if (!slugOrName) return undefined
  const key = slugOrName.toLowerCase()
  return SECTORS.find((s) => s.slug === key || s.name.toLowerCase() === key)
}
