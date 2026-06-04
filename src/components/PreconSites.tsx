'use client'

import { useEffect, useRef, useState } from 'react'

export type PreconService = {
  title?: string
  videoUrl?: string
  posterUrl?: string
}

type AnimState = 'closed' | 'opening' | 'open' | 'closing'

const ANIM_MS = 450
const NAVBAR_PX = 60

/**
 * Stacked, full-width video panels for the Pre-Construction page.
 *
 * - Each panel shows its video paused at the first frame; on hover it
 *   plays the loop muted, on leave it pauses + rewinds.
 * - Clicking a panel captures its bounding rect, mounts a fullscreen
 *   overlay starting at that rect's position+size (via transform), then
 *   transitions to the full viewport-minus-navbar — giving a smooth
 *   "the card expands into the player" animation. Close reverses it.
 * - Body scroll is locked while open; Esc closes.
 */
export function PreconSites({ services }: { services: PreconService[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [animState, setAnimState] = useState<AnimState>('closed')
  const [startRect, setStartRect] = useState<DOMRect | null>(null)

  const isMounted = openIdx !== null
  const active = isMounted ? services[openIdx!] : null

  // Lock body scroll while the overlay is mounted
  useEffect(() => {
    if (!isMounted) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isMounted])

  // Esc closes when overlay is open
  useEffect(() => {
    if (!isMounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const openCard = (idx: number, el: HTMLElement) => {
    setStartRect(el.getBoundingClientRect())
    setOpenIdx(idx)
    setAnimState('opening')
    // Double rAF guarantees the initial transform is committed to the
    // DOM *before* we flip to identity — otherwise the browser collapses
    // both into the same frame and there's no animation.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'))
    })
  }

  const closeCard = () => {
    setAnimState('closing')
    window.setTimeout(() => {
      setOpenIdx(null)
      setAnimState('closed')
      setStartRect(null)
    }, ANIM_MS)
  }

  // Build the initial (shrunken-to-card) transform when we have a start
  // rect. Origin is top-left so the math is simple. Falls back to
  // identity (no transform) if we're missing a rect.
  let stageStyle: React.CSSProperties = {}
  if (active && startRect && typeof window !== 'undefined') {
    const targetW = window.innerWidth
    const targetH = window.innerHeight - NAVBAR_PX
    const scaleX = startRect.width / targetW
    const scaleY = startRect.height / targetH
    const tx = startRect.left
    const ty = startRect.top - NAVBAR_PX
    const shrunk = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`
    const isShrunkPhase = animState === 'opening' || animState === 'closing'
    stageStyle = {
      transformOrigin: 'top left',
      transform: isShrunkPhase ? shrunk : 'none',
      transition: `transform ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
    }
  }

  return (
    <section id="precon-services" className="env-precon-services">
      {services.map((s, i) => (
        <PreconCard
          key={(s.title ?? '') + i}
          service={s}
          onOpen={(el) => openCard(i, el)}
        />
      ))}

      {active && active.videoUrl && (
        <>
          <div
            className="env-precon-fullscreen"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            style={stageStyle}
          >
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
          <button
            type="button"
            className="env-precon-close"
            aria-label="Close video"
            onClick={closeCard}
            style={{
              opacity: animState === 'open' ? 1 : 0,
              transition: 'opacity 200ms ease',
              pointerEvents: animState === 'open' ? 'auto' : 'none',
            }}
          >
            ×
          </button>
        </>
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
  onOpen: (el: HTMLElement) => void
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
      onClick={(e) => onOpen(e.currentTarget)}
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
