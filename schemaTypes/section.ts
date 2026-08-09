import {defineType, defineField} from 'sanity'

export const sectionType = defineType({
  name: 'section',
  title: 'Isolated Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'htmlCode',
      title: 'HTML Code',
      type: 'code',
      options: {
        language: 'html',
        languageAlternatives: [
          {title: 'HTML', value: 'html'},
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'CSS', value: 'css'},
        ],
        withFilename: true,
      },
    }),
    defineField({
      name: 'cssCode',
      title: 'CSS Code',
      type: 'code',
      options: {
        language: 'css',
        withFilename: true,
      },
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'previewImage',
    },
  },
})
