'use client'

import { useState } from 'react'
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

const PER_PAGE = 3

export function ExecutiveTeam({
  members,
}: {
  members?: ExecMember[]
}) {
  const list = members && members.length > 0 ? members : FALLBACK_TEAM

  const [start, setStart] = useState(0)
  const maxStart = Math.max(0, list.length - PER_PAGE)
  const visible = list.slice(start, start + PER_PAGE)

  return (
    <div>
      <div className="env-ts-track">
        {visible.map((m) => (
          <div key={m.name} className="env-ts-member">
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
        ))}
      </div>

      {list.length > PER_PAGE && (
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

/** Render either a Sanity Portable Text array (rich text with bold/italic/
 *  links) or a plain string (legacy/fallback). */
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
