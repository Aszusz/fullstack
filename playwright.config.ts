import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
  outputDir: 'e2e/generated',
})

export default defineConfig({
  testDir,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
  },
})
