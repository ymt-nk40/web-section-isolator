'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'phmhddqc'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Web Section Isolator Studio',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
