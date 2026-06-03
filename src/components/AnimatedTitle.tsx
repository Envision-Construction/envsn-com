'use client'

import { useEffect, useRef } from 'react'

/**
 * AnimatedTitle — mirrors the legacy Divi env-animated-title module.
 * Adds the `env--is-scrolled` class to its container as soon as the user
 * scrolls past the top of the page, which triggers the line-2 color
 * transition from gray (#d3d3d3) to env-green (#016d4a) in globals.css.
 */
export function AnimatedTitle({
  line1,
  line2,
}: {
  line1: string
  line2: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      if (window.scrollY > 40) {
        el.classList.add('env--is-scrolled')
      } else {
        el.classList.remove('env--is-scrolled')
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="env-animated-title home-heading">
      <h1>
        <div className="env-at-title">{line1}</div>
        <div className="env-at-title env-at-title-line-2">{line2}</div>
      </h1>
    </div>
  )
}
