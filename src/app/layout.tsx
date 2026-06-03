import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://envsn.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Envision Construction',
    template: '%s — Envision Construction',
  },
  description:
    'Envision Construction — commercial construction services in Georgia.',
  openGraph: {
    type: 'website',
    siteName: 'Envision Construction',
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
