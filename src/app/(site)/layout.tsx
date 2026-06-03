import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

/**
 * Marketing-site layout — wraps every public route under the (site) group
 * (home, /pre-construction, future marketing pages) with the global Header
 * and Footer. The Studio at /studio bypasses this layout entirely because
 * it lives outside the route group.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
