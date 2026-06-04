'use client'

import { useEffect, useRef, useState } from 'react'
import { PortableText, type PortableTextBlock } from 'next-sanity'

export type ExecMember = {
  name: string
  role?: string
  photoUrl?: string
  bio?: PortableTextBlock[] | string
}

const FALLBACK_TEAM: ExecMember[] = [
  { name: 'Avi Reddy', role: 'Chief Executive Officer', photoUrl: '/uploads/2024/06/Avi_Reddy.png' },
  { name: 'Zach Walldorff', role: 'Vice President of Construction', photoUrl: '/uploads/2024/06/Zach_Walldorff.png' },
  { name: 'David Epps', role: 'Chief Technology Officer', photoUrl: '/uploads/2024/06/David_Epps.png' },
  { name: 'Adam Meier', role: 'Director of Visual Design', photoUrl: '/uploads/2025/09/Adam-Meier.png' },
  { name: 'Donald Hayes', role: 'Operations Manager', photoUrl: '/uploads/2025/12/Donald-Hayes.png' },
]

const PER_PAGE_DESKTOP = 3
const GAP_PX = 32

export function ExecutiveTeam({
  members,
}: {
  members?: ExecMember[]
}) {
  const list = members && members.length > 0 ? members : FALLBACK_TEAM

  const [start, setStart] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Compute the per-page count from the actual viewport — 1 on mobile, 3 on desktop
  const perPage = () => {
    if (typeof window === 'undefined') return PER_PAGE_DESKTOP
    return window.matchMedia('(max-width: 767px)').matches ? 1 : PER_PAGE_DESKTOP
  }

  const maxStart = Math.max(0, list.length - perPage())

  // Update the track's translateX whenever start changes or viewport resizes
  useEffect(() => {
    const update = () => {
      const v = viewportRef.current
      const t = trackRef.current
      if (!v || !t) return
      const pp = perPage()
      const slidePlusGap = (v.clientWidth + GAP_PX) / pp
      // Clamp start in case the viewport changed perPage (5 members, 1 visible -> max 4)
      const clampedStart = Math.min(start, Math.max(0, list.length - pp))
      t.style.transform = `translateX(-${clampedStart * slidePlusGap}px)`
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [start, list.length])

  return (
    <div>
      <div ref={viewportRef} className="env-ts-viewport">
        <div ref={trackRef} className="env-ts-track">
          {list.map((m) => (
            <div key={m.name} className="env-ts-slide">
              <div className="env-ts-member">
                <div className="env-ts-member-image">
                  <div className="env-ts-member-image-bg" />
                  {m.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photoUrl} alt={m.name} />
                  )}
                </div>
                <p className="env-ts-member-name">{m.name}</p>
                {m.role && <p className="env-ts-member-position">{m.role}</p>}
                {renderBio(m.bio)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {list.length > PER_PAGE_DESKTOP && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            className="env-ts-arrow"
            aria-label="Previous executives"
            disabled={start === 0}
            onClick={() => setStart((s) => Math.max(0, s - 1))}
          >
            ‹
          </button>
          <button
            type="button"
            className="env-ts-arrow"
            aria-label="Next executives"
            disabled={start === maxStart}
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

function renderBio(bio: ExecMember['bio']) {
  if (!bio) return null
  if (typeof bio === 'string') {
    return (
      <p className="env-ts-member-bio mt-3 text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
        {bio}
      </p>
    )
  }
  if (Array.isArray(bio) && bio.length > 0) {
    return (
      <div className="env-ts-member-bio mt-3 text-sm leading-relaxed text-neutral-700 space-y-2">
        <PortableText
          value={bio}
          components={{
            marks: {
              link: ({ value, children }) => (
                <a
                  href={value?.href}
                  target={value?.href?.startsWith('http') ? '_blank' : undefined}
                  rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-env-green underline hover:no-underline"
                >
                  {children}
                </a>
              ),
            },
          }}
        />
      </div>
    )
  }
  return null
}
