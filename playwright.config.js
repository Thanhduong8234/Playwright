const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // ===== BASIC SETTINGS =====
  testDir: './tests',              // Test directory
  timeout: 60 * 1000,              // 60 seconds per test (increased from 30s)
  
  // ===== EXPECT TIMEOUT =====
  expect: {
    timeout: 10000,                // 10 seconds for expect() (increased from 5s)
  },
  
  // ===== PARALLEL EXECUTION =====
  fullyParallel: true,             // Run tests in parallel
  workers: process.env.CI ? 1 : undefined,
  
  // ===== ERROR HANDLING =====
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry failed tests (1 retry in dev, 2 in CI)
  
  // ===== REPORTING =====
  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: `playwright-report/${new Date().toISOString().slice(0, 10)}/${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}_html-report`
    }],   // HTML report với date folder và timestamp
    ['list'],                      // List reporter for console output
    ['./utils/TimestampReporter.js', { 
      outputDir: 'playwright-report' 
    }]  // Custom reporter với date folder và timestamp
  ],
  
  // ===== GLOBAL TEST SETTINGS =====
  use: {
    // Base URL (commented out since we use full URLs)
    // baseURL: 'https://automationexercise.com',
    
    // Browser Display Settings
    headless: false,               // Show browser window for debugging
    viewport: null,                // Use full screen instead of fixed size
    
    // Browser Behavior
    ignoreHTTPSErrors: true,       // Ignore SSL certificate errors
    acceptDownloads: true,         // Allow file downloads
    
    // Browser Launch Options
    launchOptions: {
      args: [
        '--start-maximized',         // Start browser maximized
        '--window-size=1920,1080',   // Set window size
        '--disable-web-security',    // Disable CORS for testing
        '--no-sandbox',             // Additional flag for full screen
        '--disable-dev-shm-usage',  // Use /tmp instead of /dev/shm
        '--disable-extensions',      // Disable all extensions
        '--disable-plugins'         // Disable plugins
      ]
    },
    
    // Test Artifacts (when tests fail)
    // trace: 'on-first-retry',       // Record trace only on retry
    // screenshot: 'only-on-failure', // Screenshot only when test fails
    // video: 'retain-on-failure',    // Video only when test fails
  },

  // ===== BROWSER PROJECTS =====
  // Run against multiple browsers/devices
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use Playwright's bundled Chromium (most stable)
      },
    },
    
    // ===== OTHER BROWSERS (ENABLED for comprehensive testing) =====
    // Comment out browsers you don't want to test
    
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // ===== REAL BROWSERS (DISABLED) =====
    // Uncomment to use real installed browsers instead
    
    // {
    //   name: 'chrome',
    //   use: { 
    //     ...devices['Desktop Chrome'], 
    //     channel: 'chrome' // Requires Chrome to be installed
    //   },
    // },
    
    // {
    //   name: 'edge',
    //   use: { 
    //     ...devices['Desktop Edge'], 
    //     channel: 'msedge' // Requires Edge to be installed
    //   },
    // },

    // ===== MOBILE TESTING (DISABLED) =====
    // Uncomment for mobile/responsive testing
    
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
