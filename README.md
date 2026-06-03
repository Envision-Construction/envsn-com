# envsn.com

Self-managed marketing site for Envision Construction. Replaces the previous HSS-hosted WordPress + Divi build with a Vercel-deployed Next.js app backed by Sanity CMS.

**Live:** envsn.com (cutover pending — see [Migration plan](#migration-plan))
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Sanity Studio (embedded at `/studio`) · Resend (contact form) · Cloudflare Turnstile (CAPTCHA)
**Hosting:** Vercel
**DNS:** GoDaddy (no Cloudflare in the path — see decision log)

---

## Quick start

```bash
git clone git@github.com:Envision-Construction/envsn-com.git
cd envsn-com
npm install
cp .env.example .env.local   # then fill in keys
npm run dev
```

- Site: http://localhost:3000
- Studio: http://localhost:3000/studio (Google Workspace sign-in via Sanity)

## Project structure

```
envsn-com/
├─ sanity.config.ts             # Studio config — schema list, plugins, /studio basePath
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx             # Root layout — global metadata + viewport
│  │  ├─ page.tsx               # Home (data from Sanity homePage singleton)
│  │  ├─ pre-construction/      # /pre-construction route
│  │  ├─ studio/[[...tool]]/    # Embedded Sanity Studio at /studio
│  │  └─ actions/
│  │     └─ contact.ts          # Contact form server action (Resend + Turnstile)
│  └─ sanity/
│     ├─ env.ts                 # Env var validation
│     ├─ client.ts              # Read-only Sanity client (CDN-cached)
│     ├─ image.ts               # @sanity/image-url builder
│     └─ schemas/
│        ├─ index.ts            # Schema barrel
│        ├─ siteSettings.ts     # Singleton — logo, address, email, etc.
│        ├─ homePage.ts         # Singleton — all home page content
│        ├─ preConstructionPage.ts  # Singleton
│        ├─ teamMember.ts       # Repeatable — Avi, David, Zach, Adam, Donald
│        └─ sector.ts           # Repeatable — Multifamily, Hospitality, etc.
├─ .env.example                 # Documented env-var template
└─ .env.local                   # Local secrets (gitignored)
```

## Environment variables

See `.env.example` for the full list. The site builds without any of them; the form is what requires Resend + Turnstile.

| Variable | Required for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | All site builds | Sanity → Manage → Project (`1p12t4ew`) |
| `NEXT_PUBLIC_SANITY_DATASET` | All site builds | `production` |
| `SANITY_API_TOKEN` | Draft mode | sanity.io/manage → API → Tokens |
| `RESEND_API_KEY` | Contact form | resend.com (verify envsn.com sending domain first) |
| `LEADS_EMAIL_TO` | Contact form | Currently `dtomic@envsn.com`; will move to `leads@envsn.com` |
| `LEADS_EMAIL_FROM` | Contact form | `noreply@envsn.com` (must be verified at Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Contact form | Cloudflare → Turnstile → Add site |
| `TURNSTILE_SECRET_KEY` | Contact form | Same — server-side counterpart |

## Content editing

All site content lives in Sanity. Edit at `https://envsn.com/studio` (production) or `http://localhost:3000/studio` (local).

Content model singletons (one of each, never delete):

- **Site Settings** — logo, footer logo, favicon, contact email/phone, address, careers URL
- **Home Page** — every section on the home page, organized by tab (Hero / About / Diversity / Technology / Expertise / People / Contact / SEO)
- **Pre-Construction Page** — hero, 4 service cards (each with a looping background video), closing CTA, SEO

Repeatable types:

- **Team Members** — name, role, photo, optional bio, display order
- **Sectors** — name, icon, short description, display order (Multifamily / Hospitality / Industrial / Site Development / Self Storage / Retail)

## Deployment

The site auto-deploys to Vercel on every push to `main`. Each pull request gets its own preview URL.

Vercel team: [`envision-construction`](https://vercel.com/envision-construction)

### First-time setup

1. In Vercel, **Import Project** → select this GitHub repo
2. Framework Preset: Next.js (auto-detected)
3. Add the env vars from `.env.example` to **Project Settings → Environment Variables**
4. Set custom domain `envsn.com` in **Project Settings → Domains** — Vercel will tell you what DNS record to add at GoDaddy

### Cutover from HSS to Vercel

At Phase 4 (cutover), change the `A` record for `envsn.com` at GoDaddy DNS from HSS's IP (`205.174.26.54`) to Vercel's edge IP (Vercel will display the value during domain setup). TTL was already lowered in advance, so propagation is fast.

## Migration plan

Detailed plan documents live in `~/Downloads/`:

- `ENVSN_DOT_COM_MIGRATION_PLAN.md` — phase-by-phase plan
- `ENVSN_DOT_COM_PHASE_0_RECON.md` — DNS audit, site inventory, brand alignment gaps
- `envsn_site_mirror/MANIFEST.md` — captured HTML, CSS, media, and screenshots from the legacy site (~470 MB)

The plan is six phases:

1. **Phase 0 (complete)** — Recon, asset mirror, vendor identification (HSS)
2. **Phase 1 (skipped)** — DNS migration to Cloudflare. We chose to keep DNS at GoDaddy.
3. **Phase 2 (in progress)** — Build new site on Vercel + Sanity
4. **Phase 3** — Content migration (light — only 2 pages of source content)
5. **Phase 4** — Cutover (one A-record change at GoDaddy)
6. **Phase 5–6** — Stabilize and offboard HSS

## Decision log

- **2026-06-03** — Stack chosen: Next.js + Sanity + Resend, hosted on Vercel. DNS stays at GoDaddy.
- **2026-06-03** — Visual direction: 1:1 replica of legacy site. No brand refresh in this migration.
- **2026-06-03** — Form approach: single Vercel server action + Resend + Turnstile + honeypot. Drop both Gravity Forms and HubSpot embed.
- **2026-06-03** — GitHub repo created in `Envision-Construction` org.
