import { client } from '@/sanity/client'

import type { Metadata } from 'next'

export const revalidate = 60

// Pulls the home-page document from Sanity. Returns null if no document
// exists yet (which is the case until content is created in the Studio).
async function getHomePage() {
  return client.fetch<{
    heroHeadingLine1?: string
    heroHeadingLine2?: string
    metaTitle?: string
    metaDescription?: string
  } | null>(
    `*[_type == "homePage"][0]{
      heroHeadingLine1,
      heroHeadingLine2,
      metaTitle,
      metaDescription
    }`,
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage().catch(() => null)
  return {
    title: page?.metaTitle ?? undefined,
    description: page?.metaDescription ?? undefined,
  }
}

export default async function HomePage() {
  const page = await getHomePage().catch(() => null)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-light tracking-tight max-w-3xl">
        {page?.heroHeadingLine1 ?? 'Envision Construction'}
      </h1>
      {page?.heroHeadingLine2 && (
        <h2 className="text-2xl md:text-4xl font-light tracking-tight mt-2 text-neutral-600">
          {page.heroHeadingLine2}
        </h2>
      )}
      <p className="mt-6 text-sm text-neutral-500 max-w-md">
        Site rebuild in progress. Content is managed in the Studio at{' '}
        <a href="/studio" className="underline hover:text-neutral-900">
          /studio
        </a>
        .
      </p>
    </main>
  )
}
