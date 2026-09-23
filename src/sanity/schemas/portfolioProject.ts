import { defineField, defineType } from 'sanity'

import { SECTORS } from '@/lib/sectors'

/**
 * One completed job on the Portfolio page. Until real projects are entered
 * here the page renders the sample set defined in
 * src/app/(site)/portfolio/page.tsx.
 */
export const portfolioProject = defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Segment',
      type: 'string',
      options: {
        list: SECTORS.map((s) => ({ title: s.name, value: s.name })),
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'City, State — e.g. "Atlanta, GA"',
      type: 'string',
    }),
    defineField({
      name: 'completed',
      title: 'Completed',
      description: 'Year (or season + year) the project was turned over.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      description: 'One or two sentences. Shown on hover / on mobile.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'stats',
      title: 'Key stats',
      description: 'Up to three headline numbers — e.g. "286" / "Units".',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Cover photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery (optional)',
      description: 'Additional photos for a future project detail view.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Segment',
      name: 'bySector',
      by: [
        { field: 'sector', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'sector', media: 'image' },
  },
})
