import { defineField, defineType } from 'sanity'

export const sector = defineType({
  name: 'sector',
  title: 'Sector',
  type: 'document',
  description:
    'Construction sectors (e.g., Multifamily, Hospitality, Industrial). Used on the home page Expertise grid.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
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
  ],
  preview: {
    select: { title: 'name', media: 'icon' },
  },
})
