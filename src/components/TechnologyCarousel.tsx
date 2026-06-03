'use client'

import { useState } from 'react'

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

export function TechnologyCarousel({
  features,
}: {
  features?: Feature[]
}) {
  const list = features && features.length > 0 ? features : FALLBACK_FEATURES
  const [index, setIndex] = useState(0)
  const current = list[index]

  const go = (delta: number) => {
    setIndex((i) => (i + delta + list.length) % list.length)
  }

  return (
    <div className="env-tech-carousel relative">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full max-h-[600px] object-cover rounded"
        />

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="env-tech-arrow absolute left-4 top-1/2 -translate-y-1/2"
        >
          ←
        </button>
        {/* Right arrow */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="env-tech-arrow absolute right-4 top-1/2 -translate-y-1/2"
        >
          →
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-bold uppercase tracking-wider text-env-dark-1">
          {current.title}
        </h3>
        {current.description && (
          <p className="mt-2 text-base text-neutral-700 leading-relaxed max-w-2xl">
            {current.description}
          </p>
        )}
      </div>

      {/* Dots indicator */}
      <div className="mt-4 flex gap-2">
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
    </div>
  )
}
