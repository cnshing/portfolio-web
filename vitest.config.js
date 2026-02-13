import { defineConfig } from 'vitest/config'
import { preview } from '@vitest/browser-preview'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    watch: true,
    browser: {
      provider: preview(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    reporters: [
      'default',
      ['junit', { suiteName: 'portfolio-web' }]
    ],

    outputFile: {
      junit: path.join(__dirname, './reports/portfolio-web/junit.xml')
    },

    coverage: {
      provider: 'v8',
      reportsDirectory: path.join(__dirname, './coverage/portfolio-web'),
      reporter: [
        'cobertura',
        'html',
        'text-summary',
        'json-summary',
        'json'
      ]
    }
  }
})