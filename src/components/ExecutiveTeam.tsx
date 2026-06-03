'use client'

import { useState } from 'react'

/**
 * Executive team carousel — shows 3 members at a time, paginated by arrows.
 * Default order matches the legacy: Avi, Zach, David first; arrows reveal
 * Adam and Donald. Roles are short job titles captured from legacy alt text;
 * full bios live in Sanity (teamMember.bio) and replace these fallbacks once
 * seeded.
 */

type Member = {
  name: string
  role: string
  photo: string
}

const TEAM: Member[] = [
  { name: 'Avi Reddy', role: 'Chief Executive Officer', photo: '/uploads/2024/06/Avi_Reddy.png' },
  { name: 'Zach Walldorff', role: 'Vice President of Construction', photo: '/uploads/2024/06/Zach_Walldorff.png' },
  { name: 'David Epps', role: 'Chief Technology Officer', photo: '/uploads/2024/06/David_Epps.png' },
  { name: 'Adam Meier', role: 'Director of Visual Design', photo: '/uploads/2025/09/Adam-Meier.png' },
  { name: 'Donald Hayes', role: 'Operations Manager', photo: '/uploads/2025/12/Donald-Hayes.png' },
]

const PER_PAGE = 3

export function ExecutiveTeam() {
  const [start, setStart] = useState(0)
  const maxStart = Math.max(0, TEAM.length - PER_PAGE)
  const visible = TEAM.slice(start, start + PER_PAGE)

  return (
    <div>
      <div className="env-ts-track">
        {visible.map((m) => (
          <div key={m.name} className="env-ts-member">
            <div className="env-ts-member-image">
              <div className="env-ts-member-image-bg" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo} alt={m.name} />
            </div>
            <p className="env-ts-member-name">{m.name}</p>
            <p className="env-ts-member-position">{m.role}</p>
          </div>
        ))}
      </div>

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
    </div>
  )
}
