'use client'

import { useEffect, useRef } from 'react'

/**
 * Adds `env-in-view` to the wrapped element once it scrolls into view.
 * Pair with `.env-fade-in-section` in globals.css for the visual transition
 * (opacity + translateY). One-shot: once revealed, stays revealed.
 */
export function ScrollFade({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section'
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('env-in-view')
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('env-in-view')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    obs.observe(el)

    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      // @ts-expect-error generic ref OK at runtime
      ref={ref}
      className={`env-fade-in-section ${className}`}
    >
      {children}
    </Tag>
  )
}
