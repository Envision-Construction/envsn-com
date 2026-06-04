'use client'

import { useEffect, useState } from 'react'

export type CapabilityTile = {
  title: string
  description?: string
  imageUrl?: string
  href?: string
  ctaLabel?: string
  ctaDetailKey?: string
}

/**
 * Fallback used only when Sanity has no capabilityTiles yet — keeps the
 * legacy 3-tile layout populated. Once tiles are added in Studio, those
 * replace these defaults.
 */
const FALLBACK_TILES: CapabilityTile[] = [
  {
    title: 'Preconstruction Services',
    imageUrl: '/uploads/2024/05/preconsteuction-bk.png',
    ctaLabel: '3D LiDAR Mapping',
    ctaDetailKey: 'lidar',
    href: '/pre-construction',
  },
  {
    title: 'Architectural Design',
    imageUrl: '/uploads/2024/05/architectural-bk.png',
  },
  {
    title: 'Commercial Construction',
    imageUrl: '/uploads/2024/05/commercial-bk.png',
  },
]

const DETAILS: Record<
  string,
  {
    title: string
    items: string[]
    ctaHref: string
    ctaLabel: string
    videoUrl?: string
  }
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
    videoUrl: '/videos/env-lidar-video.mp4',
  },
}

export function CapabilitiesSection({
  tiles,
}: {
  tiles?: CapabilityTile[]
}) {
  const list = tiles && tiles.length > 0 ? tiles : FALLBACK_TILES

  const [openDetail, setOpenDetail] = useState<string | null>(null)
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
        {list.map((tile, idx) => (
          <div key={tile.title + idx} className="env-tiles-tile">
            {tile.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tile.imageUrl} alt="" className="env-tiles-tile-bg" />
            )}
            <div className="env-tiles-tile-shadow" />
            <div className="env-tiles-tile-body">
              <h3 className="env-tiles-tile-title">{tile.title}</h3>
              <div className="env-tiles-tile-extras">
                <div className="env-tiles-tile-rule" />
                {tile.description && (
                  <p className="env-tiles-tile-desc">{tile.description}</p>
                )}
                {tile.ctaLabel && tile.ctaDetailKey && (
                  <button
                    type="button"
                    onClick={() => setOpenDetail(tile.ctaDetailKey!)}
                    className="env-tiles-tile-button"
                  >
                    {tile.ctaLabel} <span aria-hidden>›</span>
                  </button>
                )}
                {tile.ctaLabel && !tile.ctaDetailKey && tile.href && (
                  <a href={tile.href} className="env-tiles-tile-button">
                    {tile.ctaLabel} <span aria-hidden>›</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
                <span aria-hidden>×</span> CLOSE
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
                {detail.videoUrl ? (
                  <video
                    src={detail.videoUrl}
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    className="w-full aspect-video object-cover rounded"
                  />
                ) : (
                  <div className="w-full aspect-video bg-neutral-800 rounded" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
