import { defineField, defineType } from 'sanity'

export const preConstructionPage = defineType({
  name: 'preConstructionPage',
  title: 'Pre-Construction Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'services', title: 'Services' },
    { name: 'cta', title: 'Closing CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---------- Hero ----------
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Heading',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroBody',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'hero',
    }),

    // ---------- Services (the 4 cards with looping videos) ----------
    defineField({
      name: 'services',
      title: 'Service cards',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          name: 'serviceCard',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'headingLine1', title: 'Heading line 1', type: 'string' },
            { name: 'headingLine2', title: 'Heading line 2', type: 'string' },
            {
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [{ type: 'block' }],
            },
            {
              name: 'video',
              title: 'Looping background video (mp4)',
              type: 'file',
              options: { accept: 'video/mp4' },
            },
            {
              name: 'posterImage',
              title: 'Poster image (fallback)',
              type: 'image',
            },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // ---------- Closing CTA ----------
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'cta',
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
    prepare: () => ({ title: 'Pre-Construction Page' }),
  },
})
