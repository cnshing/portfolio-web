import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    watch: true,
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    coverage: {
      thresholds: {
        lines: 80,
        branches: 80,
        statements: 80,
        functions: 80
      },
      reportOnFailure: true,
    }
  }
})