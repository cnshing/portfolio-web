import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    watch: true,

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