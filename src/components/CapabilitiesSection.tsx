'use client'

import { useEffect, useState } from 'react'

type Tile = {
  key: string
  title: string
  bg: string
  description?: string
  cta?: { label: string; detailKey: string }
}

const TILES: Tile[] = [
  {
    key: 'precon',
    title: 'Preconstruction Services',
    bg: '/uploads/2024/05/preconsteuction-bk.png',
    cta: { label: '3D LiDAR Mapping', detailKey: 'lidar' },
  },
  {
    key: 'arch',
    title: 'Architectural Design',
    bg: '/uploads/2024/05/architectural-bk.png',
  },
  {
    key: 'commercial',
    title: 'Commercial Construction',
    bg: '/uploads/2024/05/commercial-bk.png',
  },
]

const DETAILS: Record<
  string,
  { title: string; items: string[]; ctaHref: string; ctaLabel: string }
> = {
  lidar: {
    title: '3D LiDAR Mapping',
    items: [
      'As-Built Laser Scanning of Existing Conditions',
      '2D CAD As-Built Conversions from LIDAR Scanning',
      '3D Revit As-Built Model from LIDAR Scanning',
      'Topography Analysis & Quantification Studies of Existing Sites',
      'Ongoing Civil Sitework Verification',
      'Site Balancing & Cut/Fill Studies of Existing Sites',
      'Floor Flatness Analysis Studies',
    ],
    ctaHref: '/pre-construction',
    ctaLabel: 'Pre Construction Services',
  },
}

export function CapabilitiesSection() {
  const [openDetail, setOpenDetail] = useState<string | null>(null)
  // Keep the content rendered briefly after openDetail goes null so the
  // close animation (max-height + opacity) can run before unmounting.
  const [renderedDetail, setRenderedDetail] = useState<string | null>(null)

  useEffect(() => {
    if (openDetail) {
      setRenderedDetail(openDetail)
      return
    }
    const t = setTimeout(() => setRenderedDetail(null), 550)
    return () => clearTimeout(t)
  }, [openDetail])

  const detail = renderedDetail ? DETAILS[renderedDetail] : null

  return (
    <>
      <div className="env-tiles-row">
        {TILES.map((tile) => (
          <div key={tile.key} className="env-tiles-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tile.bg} alt="" className="env-tiles-tile-bg" />
            <div className="env-tiles-tile-shadow" />
            <div className="env-tiles-tile-body">
              <h3 className="env-tiles-tile-title">{tile.title}</h3>
              <div className="env-tiles-tile-extras">
                <div className="env-tiles-tile-rule" />
                {tile.description && (
                  <p className="env-tiles-tile-desc">{tile.description}</p>
                )}
                {tile.cta && (
                  <button
                    type="button"
                    onClick={() => setOpenDetail(tile.cta!.detailKey)}
                    className="env-tiles-tile-button"
                  >
                    {tile.cta.label} <span aria-hidden>›</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel — always in DOM so max-height transition can animate.
          Content updates when openDetail changes; closed state collapses to 0. */}
      <div
        className="env-tiles-detail-wrap"
        data-open={openDetail ? 'true' : 'false'}
        aria-hidden={!openDetail}
      >
        {detail && (
          <div className="env-tiles-detail-inner">
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => setOpenDetail(null)}
                className="env-tiles-detail-back"
                aria-label="Close detail panel"
              >
                <span aria-hidden>‹</span> BACK
              </button>
            </div>
            <div className="env-tiles-detail-grid">
              <div>
                <h3 className="env-tiles-detail-title">{detail.title}</h3>
                <div className="env-tiles-detail-rule" />
                <ul className="env-tiles-detail-list">
                  {detail.items.map((item) => (
                    <li key={item} className="env-tiles-detail-list-item">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={detail.ctaHref} className="env-tiles-detail-cta">
                  {detail.ctaLabel} <span aria-hidden>›</span>
                </a>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full aspect-video bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-sm">
                  Demo image / video placeholder
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
