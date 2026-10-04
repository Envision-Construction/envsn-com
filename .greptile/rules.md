# envsn-com review standards

envsn-com is the public marketing site for Envision Construction: a Next.js App Router app with an embedded Sanity Studio and a Turnstile-protected contact form that sends mail through Resend. It is not an application backend: it has no user accounts, no database and no API routes, and its only server-side side effect is the inquiry email.

## Invariants that need explanation
- Each page that renders the contact form has its own `source` value: the home page relies on the prop's default, Construction, and the pre-construction page passes Preconstruction. Why: the value labels the lead in the email and selects that form's optional recipient override, so a new page that omits it is reported as a home-page lead. Source: `src/components/ContactForm.tsx` and the two pages under `src/app/(site)/`.
  A violating diff adds the form to a new page with no `source`, or reuses another page's value.
- The CAPTCHA widget is rendered by hand on each mount and torn down on unmount. Why: Cloudflare's script scans for its marker class only when it first loads, so a form remounted by client-side navigation would otherwise appear with no challenge and every submission would be rejected for a missing CAPTCHA token. Source: the comments in `src/components/ContactForm.tsx`.
  A violating diff moves the widget back to markup-only auto-discovery.
- Content-Security-Policy is deliberately absent. Why: a strict allow-list broke the Turnstile widget and Next.js server actions, and the Studio and the form pages need different allowances. Source: the comment above `securityHeaders` in `next.config.ts`.
  A violating diff adds one site-wide CSP header; an acceptable one is scoped per route and tested on the form pages and the Studio.
- A CMS outage degrades the page instead of breaking it. Why: home, pre-construction and the footer catch a failed Sanity fetch to null and render built-in copy, and the route-level `revalidate` export is the only way Studio edits reach live pages (there is no on-demand revalidation endpoint). Source: `src/components/Footer.tsx` and the pages under `src/app/`.
  A violating diff awaits a Sanity fetch without a catch, or drops `revalidate` from a CMS-backed page.
- The embedded Studio stays outside the site route group with its own layout and noindex robots metadata. Why: it is a client-side single-page app that must not inherit the public header and footer or be indexed. Source: the studio catch-all route under `src/app/`.
  A violating diff moves it under the site group or removes the robots metadata.
- The build needs the Sanity project id and dataset variables. Why: `src/sanity/env.ts` throws at import when either is undefined, and the Studio config, read client and image builder all import it.
  A violating diff documents the site as buildable without them, or replaces the throw with a silent default.

## Generated or vendored (review the generator, not the output)
- `package-lock.json` is produced by `npm install` from `package.json`.
- `public/uploads/` and `public/videos/` hold static media served as-is; review the code that references a file, not the binary.
