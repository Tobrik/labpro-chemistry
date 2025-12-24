import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for LABPRO Chemistry Platform
 * Focus on Chrome testing as requested
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: 'html',

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Increase timeouts to handle Firebase/API connections
    navigationTimeout: 45000, // 45 seconds for navigation
    actionTimeout: 15000,      // 15 seconds for actions
  },

  // Global timeout for each test
  timeout: 60000, // 60 seconds per test

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome-specific settings
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Optional: Firefox for cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Optional: WebKit (Safari) for cross-browser testing
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile Chrome testing
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Increased timeouts for mobile (slower emulation)
        navigationTimeout: 60000, // 60 seconds for mobile navigation
        actionTimeout: 20000,     // 20 seconds for mobile actions
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
