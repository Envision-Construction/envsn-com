'use client'

import { useEffect, useRef } from 'react'

/**
 * Hero tagline that stays vertically centered in the visible white space
 * between the sticky navbar (60px from top) and the bottom of the section
 * as the user scrolls. Uses requestAnimationFrame to throttle the scroll
 * listener; only applies a translateY when part of the section is offscreen.
 *
 * The text also retains its initial fade-up animation on page load — that
 * runs on the inner <h1> via the env-hero-tagline-text class, while this
 * outer wrapper handles the scroll-driven vertical recentering.
 */

const NAVBAR_HEIGHT = 60

export function HeroTagline() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackerRef = useRef<HTMLDivElement | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const tracker = trackerRef.current
    if (!section || !tracker) return

    const update = () => {
      raf.current = null
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight

      // Mobile: the hero section collapses to its compact natural height.
      // Skip scroll-centering + fade logic entirely so the tagline just
      // sits in the small padded band.
      if (rect.height < 240) {
        tracker.style.transform = ''
        tracker.style.opacity = ''
        return
      }

      // Visible portion of the section, in viewport coords
      const visibleTop = Math.max(rect.top, NAVBAR_HEIGHT)
      const visibleBottom = Math.min(rect.bottom, viewportH)
      const visibleHeight = visibleBottom - visibleTop

      // If section is entirely above or below the viewport, hide
      if (visibleHeight <= 0) {
        tracker.style.transform = 'translateY(0px)'
        tracker.style.opacity = '0'
        return
      }

      // Center of the visible white space in viewport coords
      const visibleCenter = (visibleTop + visibleBottom) / 2

      // Natural center of the text wrapper in viewport coords (no transform)
      const naturalCenter = rect.top + rect.height / 2

      // Offset needed to move the text from natural to visible center
      const offset = visibleCenter - naturalCenter
      tracker.style.transform = `translateY(${offset.toFixed(1)}px)`

      // Fade out when the visible white space gets too small to comfortably
      // hold the tagline — start fade at 320px, fully invisible at 140px.
      const FADE_START = 320
      const FADE_END = 140
      let opacity = 1
      if (visibleHeight < FADE_START) {
        opacity = Math.max(0, (visibleHeight - FADE_END) / (FADE_START - FADE_END))
      }
      tracker.style.opacity = opacity.toFixed(2)
    }

    const schedule = () => {
      if (raf.current != null) return
      raf.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className="env-hero-tagline">
      <div ref={trackerRef} className="env-hero-tagline-tracker">
        <h1 className="env-hero-tagline-text">
          <span className="env-hero-tagline-outline">BUILD WITH </span>
          <span className="env-hero-tagline-solid">INTELLIGENCE.</span>
        </h1>
      </div>
    </section>
  )
}
