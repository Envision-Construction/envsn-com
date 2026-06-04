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

const OPEN_MS = 750

// Cubic ease-in-out — visually matches the height transition's
// cubic-bezier(0.4, 0, 0.2, 1) closely enough that the scroll motion
// and the panel growth feel like one coordinated animation.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateScrollTo(targetY: number, duration: number) {
  if (typeof window === 'undefined') return
  const startY = window.scrollY
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return
  const startTime = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration)
    const eased = easeInOutCubic(t)
    window.scrollTo(0, startY + diff * eased)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * Stacked, full-width video panels for the Pre-Construction page.
 *
 * - At rest each panel shows its video paused at the first frame, with
 *   the service title centered on top; hover plays the loop muted,
 *   leave pauses + rewinds.
 * - Clicking a panel expands it inline to fill the viewport-minus-navbar
 *   and snaps it flush below the navbar. Other panels stay where they
 *   are — closed at 380px or open at full height — so multiple panels
 *   can be open simultaneously. Each open panel only closes when its
 *   own × button is clicked (or Esc closes them all).
 */
export function PreconSites({ services }: { services: PreconService[] }) {
  const [openSet, setOpenSet] = useState<ReadonlySet<number>>(new Set())
  const cardRefs = useRef<Array<HTMLElement | null>>([])

  // Esc closes every open panel at once.
  useEffect(() => {
    if (openSet.size === 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSet(new Set())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSet.size])

  const openCard = (idx: number) => {
    if (openSet.has(idx)) return
    const el = cardRefs.current[idx]
    if (!el) {
      setOpenSet((prev) => new Set(prev).add(idx))
      return
    }
    // Run our own RAF-driven scroll on the same duration + easing as
    // the height transition (OPEN_MS / easeInOutCubic). Native
    // window.scrollTo({behavior: 'smooth'}) finishes on its own clock
    // (often ~300ms regardless of distance), so the scroll lands
    // before the panel finishes growing and the motions feel split.
    // With matched durations both glide together as a single motion.
    const rect = el.getBoundingClientRect()
    const targetY = Math.max(0, window.scrollY + rect.top - 60)
    animateScrollTo(targetY, OPEN_MS)
    setOpenSet((prev) => new Set(prev).add(idx))
  }

  const closeCard = (idx: number) => {
    setOpenSet((prev) => {
      if (!prev.has(idx)) return prev
      const next = new Set(prev)
      next.delete(idx)
      return next
    })
  }

  return (
    <section id="precon-services" className="env-precon-services">
      {services.map((s, i) => {
        const isOpen = openSet.has(i)
        return (
          <PreconCard
            key={(s.title ?? '') + i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            service={s}
            isOpen={isOpen}
            onOpen={() => openCard(i)}
            onClose={() => closeCard(i)}
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

  // Always reset to the first-frame still when the open state changes
  // — the video only plays while the cursor is over the card, never
  // automatically while it's expanded.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0.05
  }, [isOpen])

  const handlePointerEnter = () => {
    const v = videoRef.current
    if (!v) return
    void v.play().catch(() => undefined)
  }

  const handlePointerLeave = () => {
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
