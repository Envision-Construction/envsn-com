'use client'

import { useEffect, useRef } from 'react'

/**
 * Toggles `env-in-view` on the wrapped element based on viewport intersection.
 * Pair with `.env-fade-in-section` in globals.css for the visual transition
 * (opacity + translateY). Re-fires every time the section scrolls back into
 * focus — entering view = fade up; leaving view = reset to faded/offset.
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
          } else {
            entry.target.classList.remove('env-in-view')
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
