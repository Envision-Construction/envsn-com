import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Envision Construction',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Header Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'careersUrl',
      title: 'Careers URL',
      type: 'url',
      initialValue: 'https://careers.envsn.com',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'siteName' },
    prepare: ({ title }) => ({ title: title || 'Site Settings' }),
  },
})
