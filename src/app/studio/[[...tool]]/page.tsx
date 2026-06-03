'use client'

/**
 * Embedded Sanity Studio at /studio.
 * Access: https://envsn.com/studio (or http://localhost:3000/studio in dev).
 *
 * Editors sign in with their Google Workspace identity. The Studio is
 * a single-page app — all routes under /studio are served from this
 * catch-all segment.
 */

import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export const maxDuration = 30

export default function StudioPage() {
  return <NextStudio config={config} />
}
