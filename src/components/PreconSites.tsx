'use client'

import { useEffect, useRef, useState } from 'react'

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
        <PreconCard
          key={(s.title ?? '') + i}
          service={s}
          onOpen={() => setOpenIdx(i)}
        />
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

/**
 * One preview panel. The video shows its first frame as a still poster
 * (loaded via preload="metadata"); on pointer-enter it starts playing
 * muted, on pointer-leave it pauses + rewinds. Click opens fullscreen.
 *
 * Touch devices fire pointerenter on tap, so a quick tap will both
 * preview-play and open the fullscreen — which is fine since opening
 * fullscreen swaps to a controlled autoplaying video anyway.
 */
function PreconCard({
  service,
  onOpen,
}: {
  service: PreconService
  onOpen: () => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Once metadata loads, nudge currentTime so the first frame renders as
  // a still poster instead of a black box.
  const handleLoadedMetadata = () => {
    const v = videoRef.current
    if (v && v.currentTime === 0) v.currentTime = 0.05
  }

  const handlePointerEnter = () => {
    const v = videoRef.current
    if (!v) return
    void v.play().catch(() => {
      /* autoplay block — fine, the click handler still opens it */
    })
  }

  const handlePointerLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0.05
  }

  return (
    <button
      type="button"
      className="env-precon-card"
      onClick={onOpen}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      aria-label={service.title ? `Open ${service.title} video` : 'Open video'}
    >
      {service.videoUrl && (
        <video
          ref={videoRef}
          src={service.videoUrl}
          poster={service.posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          className="env-precon-card-video"
        />
      )}
      <div className="env-precon-card-overlay" />
      {service.title && (
        <span className="env-precon-card-title">{service.title}</span>
      )}
    </button>
  )
}
