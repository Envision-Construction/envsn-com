'use client'

import { useEffect, useState } from 'react'

export type PreconService = {
  title?: string
  videoUrl?: string
  posterUrl?: string
}

/**
 * Stacked, full-width video panels for the Pre-Construction page.
 *
 * - Each panel autoplays its looping video muted as a preview, with the
 *   service title centered on top.
 * - Clicking a panel opens that video in a fullscreen overlay anchored
 *   below the 60px sticky navbar, with a close button in the upper right.
 *   Body scroll is locked while open; Esc closes.
 */
export function PreconSites({ services }: { services: PreconService[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useEffect(() => {
    if (openIdx === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [openIdx])

  const active = openIdx !== null ? services[openIdx] : null

  return (
    <section id="precon-services" className="env-precon-services">
      {services.map((s, i) => (
        <button
          key={(s.title ?? '') + i}
          type="button"
          className="env-precon-card"
          onClick={() => setOpenIdx(i)}
          aria-label={s.title ? `Open ${s.title} video` : 'Open video'}
        >
          {s.videoUrl && (
            <video
              src={s.videoUrl}
              poster={s.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="env-precon-card-video"
            />
          )}
          <div className="env-precon-card-overlay" />
          {s.title && <span className="env-precon-card-title">{s.title}</span>}
        </button>
      ))}

      {active && active.videoUrl && (
        <div
          className="env-precon-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            className="env-precon-close"
            aria-label="Close video"
            onClick={() => setOpenIdx(null)}
          >
            ×
          </button>
          <video
            key={openIdx}
            src={active.videoUrl}
            autoPlay
            loop
            playsInline
            controls
            className="env-precon-fullscreen-video"
          />
        </div>
      )}
    </section>
  )
}
