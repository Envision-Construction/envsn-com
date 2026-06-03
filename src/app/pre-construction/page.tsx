import { client } from '@/sanity/client'

import type { Metadata } from 'next'

export const revalidate = 60

async function getPreConstructionPage() {
  return client.fetch<{
    heroEyebrow?: string
    heroHeading?: string
    metaTitle?: string
    metaDescription?: string
  } | null>(
    `*[_type == "preConstructionPage"][0]{
      heroEyebrow,
      heroHeading,
      metaTitle,
      metaDescription
    }`,
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPreConstructionPage().catch(() => null)
  return {
    title: page?.metaTitle ?? 'Pre-Construction',
    description: page?.metaDescription ?? undefined,
  }
}

export default async function PreConstructionPage() {
  const page = await getPreConstructionPage().catch(() => null)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        {page?.heroEyebrow ?? 'Pre-Construction'}
      </p>
      <h1 className="mt-3 text-4xl md:text-6xl font-light tracking-tight max-w-3xl">
        {page?.heroHeading ?? 'Pre-Construction Services'}
      </h1>
      <p className="mt-6 text-sm text-neutral-500 max-w-md">
        Page rebuild in progress. Edit content in the Studio at{' '}
        <a href="/studio" className="underline hover:text-neutral-900">
          /studio
        </a>
        .
      </p>
    </main>
  )
}
