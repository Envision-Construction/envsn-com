'use client'

import { useMemo, useState } from 'react'

import type { Sector } from '@/lib/sectors'

export type PortfolioStat = { label: string; value: string }

export type PortfolioProject = {
  id: string
  name: string
  /** Sector display name — must match a `Sector.name`. */
  sector: string
  location?: string
  completed?: string
  description?: string
  stats?: PortfolioStat[]
  imageUrl?: string
  /** True for the placeholder set shipped before real jobs are loaded. */
  sample?: boolean
}

const ALL = 'all'

/**
 * Segment filter pills + project card grid for /portfolio.
 *
 * - Pills mirror the home-page Expertise icons (same PNGs) so the two
 *   surfaces read as one system. Active pill inverts to env-green.
 * - Cards borrow the capability-tile language: cover photo, dark wash,
 *   bottom-anchored title, and a rule + description + stats block that
 *   expands on hover (always visible on touch screens).
 */
export function PortfolioGrid({
  projects,
  sectors,
  initialSector,
}: {
  projects: PortfolioProject[]
  sectors: Sector[]
  initialSector?: string
}) {
  const [active, setActive] = useState<string>(
    initialSector && sectors.some((s) => s.slug === initialSector) ? initialSector : ALL,
  )

  const activeSector = sectors.find((s) => s.slug === active)

  const visible = useMemo(
    () => (activeSector ? projects.filter((p) => p.sector === activeSector.name) : projects),
    [projects, activeSector],
  )

  return (
    <div>
      <div className="env-portfolio-filters" role="tablist" aria-label="Filter projects by segment">
        <button
          type="button"
          role="tab"
          aria-selected={active === ALL}
          className={`env-portfolio-filter ${active === ALL ? 'env-portfolio-filter--active' : ''}`}
          onClick={() => setActive(ALL)}
        >
          All Segments
        </button>
        {sectors.map((s) => {
          const isActive = active === s.slug
          return (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`env-portfolio-filter ${isActive ? 'env-portfolio-filter--active' : ''}`}
              onClick={() => setActive(s.slug)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.iconPath} alt="" />
              {s.name}
            </button>
          )
        })}
      </div>

      {activeSector && (
        <div className="env-portfolio-intro">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeSector.iconPath} alt="" />
          <div>
            <p className="env-eyebrow">{activeSector.name}</p>
            <p className="mt-1 text-base leading-relaxed text-neutral-700">{activeSector.blurb}</p>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="env-portfolio-empty">
          Projects in this segment are being added. Check back soon.
        </p>
      ) : (
        <div className="env-portfolio-grid">
          {visible.map((p) => (
            <article key={p.id} className="env-portfolio-card">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="env-portfolio-card-bg" />
              ) : (
                <div className="env-portfolio-card-bg bg-env-dark-2" />
              )}
              <div className="env-portfolio-card-shadow" />
              {p.sample && <span className="env-portfolio-card-badge">Sample</span>}
              <div className="env-portfolio-card-body">
                <p className="env-portfolio-card-sector">{p.sector}</p>
                <h3 className="env-portfolio-card-title">{p.name}</h3>
                {(p.location || p.completed) && (
                  <p className="env-portfolio-card-location">
                    {[p.location, p.completed].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div className="env-portfolio-card-extras">
                  <div className="env-portfolio-card-rule" />
                  {p.description && <p className="env-portfolio-card-desc">{p.description}</p>}
                  {p.stats && p.stats.length > 0 && (
                    <dl className="env-portfolio-card-stats">
                      {p.stats.slice(0, 3).map((st) => (
                        <div key={st.label + st.value}>
                          <dd className="env-portfolio-card-stat-value">{st.value}</dd>
                          <dt className="env-portfolio-card-stat-label">{st.label}</dt>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
