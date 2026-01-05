import { defineConfig, devices } from '@playwright/test';

/**
 * E2E Test Configuration for Elevare/LucresIA QuickCreate Flow
 * 
 * Critical User Journey:
 * 1. Preset Selection → 2. Image Upload → 3. Copy Creation → 4. Publish
 * 
 * Target: Validate 5min creation time & 80% completion rate
 */
export default defineConfig({
  testDir: './tests',
  
  // Test execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Timeouts
  timeout: 30 * 1000, // 30s per test
  expect: {
    timeout: 5000,
  },
  
  // Reporting
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Analytics tracking validation
    extraHTTPHeaders: {
      'X-Test-Mode': 'true',
    },
  },
  
  // Test projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing (critical for aestheticians on-the-go)
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Local dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
