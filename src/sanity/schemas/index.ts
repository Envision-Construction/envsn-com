import type { SchemaTypeDefinition } from 'sanity'

import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
import { preConstructionPage } from './preConstructionPage'
import { teamMember } from './teamMember'
import { sector } from './sector'
import { portfolioProject } from './portfolioProject'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  preConstructionPage,
  // Repeatable documents
  teamMember,
  sector,
  portfolioProject,
]
