'use client'

import { useEffect, useRef, useState } from 'react'

export type PreconService = {
  title?: string
  videoUrl?: string
  posterUrl?: string
  /** First word of the heading, rendered bold. */
  headingBold?: string
  /** Rest of the first heading line, rendered light. */
  headingRest?: string
  /** Optional second heading line (also light). */
  headingLine2?: string
  /** Body copy paragraphs shown beneath the heading when expanded. */
  bodyParagraphs?: string[]
}

/**
 * Stacked, full-width video panels for the Pre-Construction page.
 *
 * - At rest each panel shows its video paused at the first frame, with
 *   the service title centered on top; hover plays the loop muted,
 *   leave pauses + rewinds.
 * - Clicking a panel expands it inline to fill the viewport-minus-navbar.
 *   The other three panels collapse to height 0 (smooth transition),
 *   the video starts autoplaying, and the heading + body copy fade in
 *   over a darker overlay. A close (×) button in the top-right collapses
 *   everything back to the four-panel resting state.
 */
export function PreconSites({ services }: { services: PreconService[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])

  // Esc closes the expanded panel.
  useEffect(() => {
    if (openIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIdx])

  const openCard = (idx: number) => {
    const el = cardRefs.current[idx]
    if (!el) {
      setOpenIdx(idx)
      return
    }
    // Measure against the closed-state layout, then scroll the card's
    // top edge to right below the 60px sticky navbar BEFORE flipping the
    // open state. Scrolling first guarantees the card is properly framed
    // when the height transition starts (no matter where the click came
    // from). If we're already aligned within a couple of pixels, skip
    // the scroll and open immediately.
    const rect = el.getBoundingClientRect()
    const targetY = Math.max(0, window.scrollY + rect.top - 60)
    const delta = Math.abs(targetY - window.scrollY)

    if (delta < 2) {
      setOpenIdx(idx)
      return
    }

    window.scrollTo({ top: targetY, behavior: 'smooth' })
    // Approximate Chrome/Firefox smooth-scroll duration scales with the
    // distance; cap at ~450ms so long scrolls aren't waiting too long.
    const wait = Math.min(450, 180 + delta * 0.25)
    window.setTimeout(() => setOpenIdx(idx), wait)
  }

  return (
    <section id="precon-services" className="env-precon-services">
      {services.map((s, i) => {
        const isOpen = openIdx === i
        return (
          <PreconCard
            key={(s.title ?? '') + i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            service={s}
            isOpen={isOpen}
            onOpen={() => openCard(i)}
            onClose={() => setOpenIdx(null)}
          />
        )
      })}
    </section>
  )
}

/**
 * One stacked panel. Renders three states via the className modifiers
 * controlled by the parent:
 *
 * - rest: video paused at the first frame, title overlay centered.
 * - open: video autoplays muted, heading + body fade in, close button
 *   becomes interactive.
 * - collapsed: height transitions to 0, contents clipped via overflow.
 */
const PreconCard = function PreconCard({
  service,
  isOpen,
  onOpen,
  onClose,
  ref,
}: {
  service: PreconService
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  ref: (el: HTMLElement | null) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Once metadata loads, render the first frame as a still poster.
  const handleLoadedMetadata = () => {
    const v = videoRef.current
    if (v && v.currentTime === 0) v.currentTime = 0.05
  }

  // When the card opens, start the loop playing; when it closes or
  // collapses, pause + rewind so the next interaction starts fresh.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isOpen) {
      void v.play().catch(() => undefined)
    } else {
      v.pause()
      v.currentTime = 0.05
    }
  }, [isOpen])

  const handlePointerEnter = () => {
    if (isOpen) return
    const v = videoRef.current
    if (!v) return
    void v.play().catch(() => undefined)
  }

  const handlePointerLeave = () => {
    if (isOpen) return
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0.05
  }

  const className = [
    'env-precon-card',
    isOpen ? 'env-precon-card--open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      ref={ref}
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Click target — fills the panel at rest; while open it's pointer
          disabled so the close button is the only way out. */}
      <button
        type="button"
        className="env-precon-card-hit"
        onClick={onOpen}
        aria-label={service.title ? `Open ${service.title}` : 'Open'}
        tabIndex={isOpen ? -1 : 0}
        disabled={isOpen}
      />

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

      {/* Resting title — fades out when the panel opens */}
      {service.title && (
        <span className="env-precon-card-title">{service.title}</span>
      )}

      {/* Expanded content — heading + body, fades in only when open */}
      <div className="env-precon-card-content">
        {(service.headingBold || service.headingRest) && (
          <h2 className="env-precon-card-heading">
            {service.headingBold && (
              <strong>{service.headingBold}</strong>
            )}
            {service.headingRest && (
              <>
                {service.headingBold ? ' ' : ''}
                {service.headingRest}
              </>
            )}
            {service.headingLine2 && (
              <>
                <br />
                {service.headingLine2}
              </>
            )}
          </h2>
        )}
        {service.bodyParagraphs && service.bodyParagraphs.length > 0 && (
          <div className="env-precon-card-body">
            {service.bodyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* Close (only interactive while open) */}
      <button
        type="button"
        className="env-precon-close"
        aria-label="Close"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
      >
        ×
      </button>
    </article>
  )
}
