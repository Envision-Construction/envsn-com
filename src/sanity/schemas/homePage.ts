import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'diversity', title: 'Diversity' },
    { name: 'technology', title: 'Technology' },
    { name: 'expertise', title: 'Expertise' },
    { name: 'people', title: 'People' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---------- Hero ----------
    defineField({
      name: 'heroHeadingLine1',
      title: 'Hero heading — line 1',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadingLine2',
      title: 'Hero heading — line 2',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero video (mp4)',
      type: 'file',
      options: { accept: 'video/mp4' },
      group: 'hero',
    }),
    defineField({
      name: 'heroPosterImage',
      title: 'Hero poster image (fallback)',
      type: 'image',
      group: 'hero',
    }),

    // ---------- About ----------
    defineField({
      name: 'aboutEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'Heading',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),

    // ---------- Diversity ----------
    defineField({
      name: 'diversityEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'diversity',
    }),
    defineField({
      name: 'diversityHeading',
      title: 'Heading',
      type: 'string',
      group: 'diversity',
    }),
    defineField({
      name: 'diversityBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'diversity',
    }),
    defineField({
      name: 'diversityImage',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      group: 'diversity',
    }),

    // ---------- Technology ----------
    defineField({
      name: 'technologyEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'technology',
    }),
    defineField({
      name: 'technologyHeading',
      title: 'Heading',
      type: 'string',
      group: 'technology',
    }),
    defineField({
      name: 'technologyBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'technology',
    }),
    defineField({
      name: 'technologyFeatures',
      title: 'Features',
      type: 'array',
      group: 'technology',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),

    // ---------- Expertise / Sectors ----------
    defineField({
      name: 'expertiseEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'expertise',
    }),
    defineField({
      name: 'expertiseHeading',
      title: 'Heading',
      type: 'string',
      group: 'expertise',
    }),
    defineField({
      name: 'expertiseBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'expertise',
    }),
    defineField({
      name: 'sectors',
      title: 'Sectors shown',
      type: 'array',
      group: 'expertise',
      of: [{ type: 'reference', to: [{ type: 'sector' }] }],
    }),
    defineField({
      name: 'capabilityTiles',
      title: 'Capability Tiles',
      description:
        'The 3 photo-backed tiles below the sector icons. Each shows the title at rest and reveals the description + CTA on hover.',
      type: 'array',
      group: 'expertise',
      of: [
        {
          type: 'object',
          name: 'capabilityTile',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            },
            {
              name: 'description',
              title: 'Description (shown on hover)',
              type: 'text',
              rows: 4,
            },
            {
              name: 'image',
              title: 'Background image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'href',
              title: 'Link target (optional)',
              description:
                'If set, clicking the title navigates here. Leave blank if the tile only has a CTA button.',
              type: 'string',
            },
            {
              name: 'ctaLabel',
              title: 'CTA button label (optional)',
              description:
                'e.g. "3D LiDAR Mapping". Leave blank to hide the button.',
              type: 'string',
            },
            {
              name: 'ctaDetailKey',
              title: 'Detail panel key (optional)',
              description:
                'Key into the in-code DETAILS lookup (currently only "lidar" is wired up). Set this on the Preconstruction tile.',
              type: 'string',
            },
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),

    // ---------- People / Team ----------
    defineField({
      name: 'peopleEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'people',
    }),
    defineField({
      name: 'peopleHeading',
      title: 'Heading',
      type: 'string',
      group: 'people',
    }),
    defineField({
      name: 'peopleBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'people',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team members',
      type: 'array',
      group: 'people',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),

    // ---------- Contact section ----------
    defineField({
      name: 'contactEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactHeading',
      title: 'Heading',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'contact',
    }),

    // ---------- SEO ----------
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
