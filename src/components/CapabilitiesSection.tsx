'use client'

import { useState } from 'react'

/**
 * Capabilities — three photo-backed tiles + an expandable detail panel
 * that opens below the row when a tile's CTA button is clicked.
 *
 * The current tile structure is hardcoded for the legacy three categories.
 * Tile descriptions + detail-panel content can be edited later once the
 * preConstructionPage / capability schema is extended; for now we render
 * short structural placeholders that the user replaces in Studio.
 */

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
    description: '',
    cta: { label: '3D LiDAR Mapping', detailKey: 'lidar' },
  },
  {
    key: 'arch',
    title: 'Architectural Design',
    bg: '/uploads/2024/05/architectural-bk.png',
    description: '',
  },
  {
    key: 'commercial',
    title: 'Commercial Construction',
    bg: '/uploads/2024/05/commercial-bk.png',
    description: '',
  },
]

const DETAILS: Record<string, { title: string; items: string[]; ctaHref: string; ctaLabel: string }> = {
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
  const detail = openDetail ? DETAILS[openDetail] : null

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
        ))}
      </div>

      {detail && (
        <div className="env-tiles-detail">
          <div className="env-container">
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
                {/* Placeholder for the LiDAR demo image / video — swap in actual asset */}
                <div className="w-full aspect-video bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-sm">
                  Demo image / video placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
