'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * SearchOverlay — black slide-down bar that appears under the header
 * when the magnifying-glass icon is clicked.
 *
 * Search runs client-side against a small in-memory index of the
 * known pages and section anchors. For a 2-page marketing site this
 * is plenty and avoids needing a backend search API.
 */

type Entry = {
  title: string
  href: string
  snippet?: string
  keywords?: string[]
}

const INDEX: Entry[] = [
  {
    title: 'Home',
    href: '/',
    keywords: ['envision', 'construction', 'home'],
  },
  {
    title: 'About Us',
    href: '/#culture',
    keywords: ['about', 'culture'],
  },
  {
    title: 'Diversity',
    href: '/#culture',
    keywords: ['diversity', 'minority', 'minority owned'],
  },
  {
    title: 'Technology',
    href: '/#culture',
    keywords: ['technology', 'tech', 'innovation'],
  },
  {
    title: 'Capabilities',
    href: '/#expertise',
    keywords: ['capabilities', 'expertise', 'sectors'],
  },
  {
    title: 'Executive Team',
    href: '/#people',
    keywords: ['team', 'people', 'leadership', 'executives'],
  },
  {
    title: 'Pre Construction Services',
    href: '/pre-construction',
    keywords: ['preconstruction', 'pre construction', 'site planning'],
  },
  {
    title: '3D LiDAR Mapping',
    href: '/pre-construction',
    keywords: ['lidar', '3d', 'mapping', 'laser scanning'],
  },
  {
    title: 'Site Balancing',
    href: '/pre-construction',
    keywords: ['site balancing', 'cut fill'],
  },
  {
    title: 'TestFit Site Layout',
    href: '/pre-construction',
    keywords: ['testfit', 'site layout'],
  },
  {
    title: 'Careers',
    href: 'https://careers.envsn.com',
    keywords: ['careers', 'jobs', 'hiring'],
  },
  {
    title: 'Contact Us',
    href: '/#contact-us',
    keywords: ['contact', 'ready to talk', 'phone', 'email'],
  },
]

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when opened; clear on close
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200)
      return () => clearTimeout(t)
    } else {
      setQuery('')
    }
  }, [open])

  // Esc closes
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return INDEX.filter((e) => {
      const hay = [e.title, e.snippet ?? '', ...(e.keywords ?? [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    }).slice(0, 8)
  }, [query])

  return (
    <div
      aria-hidden={!open}
      className={`env-search-overlay fixed left-0 right-0 z-50 bg-black text-white overflow-hidden transition-all duration-300 ease-out ${
        open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
      }`}
      style={{ top: 60 }}
    >
      <div className="env-container py-4 flex items-center gap-4">
        <span aria-hidden className="text-lg font-bold">
          {/* magnifying glass mark */}⌕
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Envision Prime"
          className="flex-1 bg-transparent outline-none text-base placeholder:text-neutral-500"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="text-2xl leading-none hover:text-neutral-400"
        >
          ×
        </button>
      </div>

      {results.length > 0 && (
        <div className="env-container pb-6 border-t border-neutral-800">
          <ul className="divide-y divide-neutral-800">
            {results.map((r) => (
              <li key={r.title + r.href}>
                <a
                  href={r.href}
                  onClick={onClose}
                  className="block py-3 hover:text-env-green-light"
                >
                  <span className="text-base font-medium">{r.title}</span>
                  <span className="ml-3 text-xs text-neutral-500">{r.href}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="env-container pb-6 text-sm text-neutral-500">
          No matches for &ldquo;{query}&rdquo;.
        </div>
      )}
    </div>
  )
}
