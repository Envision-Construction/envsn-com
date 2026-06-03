'use client'

import { useState } from 'react'

export type ExecMember = {
  name: string
  role?: string
  photoUrl?: string
  bio?: string
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
            {m.bio && (
              <p className="env-ts-member-bio mt-3 text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                {m.bio}
              </p>
            )}
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
