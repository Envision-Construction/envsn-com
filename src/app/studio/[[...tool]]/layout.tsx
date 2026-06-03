/**
 * Studio uses its own minimal layout to avoid inheriting the site header / footer.
 * The Studio mounts at /studio and is its own SPA.
 */
export const metadata = {
  title: 'envsn.com — Studio',
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
