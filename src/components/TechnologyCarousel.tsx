'use client'

import { useEffect, useRef, useState } from 'react'

type Feature = {
  title: string
  description: string
  imageUrl: string
}

const FALLBACK_FEATURES: Feature[] = [
  {
    title: 'Laser Scanning',
    description: '',
    imageUrl: '/uploads/2024/05/envision-image3-989695.png',
  },
  {
    title: '3D Rendering',
    description: '',
    imageUrl: '/uploads/2024/05/2961-Alston-SD-Model-lvl1.jpg',
  },
  {
    title: 'Drone Technology',
    description: '',
    imageUrl: '/uploads/2024/05/Homepage_Drone.jpg',
  },
]

/**
 * Technology carousel — single-slide-at-a-time view using the same
 * sliding flex-track pattern as ExecutiveTeam: all slides render in
 * a row that's translated by JS based on viewport width. Each slide
 * is full-width and contains its image + caption together, so the
 * whole slide eases left/right on prev/next.
 */
export function TechnologyCarousel({
  features,
}: {
  features?: Feature[]
}) {
  const list = features && features.length > 0 ? features : FALLBACK_FEATURES
  const [index, setIndex] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const v = viewportRef.current
      const t = trackRef.current
      if (!v || !t) return
      t.style.transform = `translateX(-${index * v.clientWidth}px)`
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [index, list.length])

  const go = (delta: number) => {
    setIndex((i) => (i + delta + list.length) % list.length)
  }

  return (
    <div className="env-tech-carousel">
      <div ref={viewportRef} className="env-tech-viewport">
        <div ref={trackRef} className="env-tech-track">
          {list.map((f, i) => (
            <div key={f.title + i} className="env-tech-slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.imageUrl}
                alt={f.title}
                className="env-culture-image w-full max-h-[600px] object-cover"
              />
              <div className="mt-6 w-full">
                <h3 className="text-base font-bold uppercase tracking-wider text-env-dark-1">
                  {f.title}
                </h3>
                {f.description && (
                  <p className="mt-2 text-base text-neutral-700 leading-relaxed">
                    {f.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {list.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            className="env-ts-arrow"
            aria-label="Previous technology"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <div className="flex items-center gap-2 px-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? 'bg-env-dark-1' : 'bg-neutral-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            className="env-ts-arrow"
            aria-label="Next technology"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
