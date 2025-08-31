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
  workers: process.env.CI ? 1 : 4, // 4 workers for parallel execution (adjust based on your CPU cores)
  maxFailures: 5,                  // Stop after 5 failures to avoid wasting time
  
  // ===== PERFORMANCE OPTIMIZATION =====
  globalSetup: undefined,           // No global setup for faster startup
  globalTeardown: undefined,        // No global teardown for faster cleanup
  preserveOutput: 'failures-only',  // Keep output only for failed tests
  maxConcurrency: 4,               // Maximum concurrent test executions
  
  // ===== ERROR HANDLING =====
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry failed tests (1 retry in dev, 2 in CI)
  
  // ===== REPORTING =====
  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: `playwright-report/${new Date().toISOString().slice(0, 10)}/${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}_html-report`
    }],   // HTML report with date folder and timestamp
    ['list'],                      // List reporter for console output
    ['./utils/TimestampReporter.js', { 
      outputDir: 'playwright-report' 
    }]  // Custom reporter with date folder and timestamp
  ],
  
  // ===== GLOBAL TEST SETTINGS =====
  use: {
    // Base URL (commented out since we use full URLs)
    // baseURL: 'https://automationexercise.com',
    
    // Browser Display Settings
    headless: true,               // Run headless for better performance
    viewport: null,                // Use full screen instead of fixed size
    
    // Browser Behavior
    ignoreHTTPSErrors: true,       // Ignore SSL certificate errors
    acceptDownloads: true,         // Allow file downloads
    
    // Browser Launch Options - Optimized for parallel execution
    launchOptions: {
      args: [
        '--start-maximized',         // Start browser maximized
        '--window-size=1920,1080',   // Set window size
        '--disable-web-security',    // Disable CORS for testing
        '--no-sandbox',             // Additional flag for full screen
        '--disable-dev-shm-usage',  // Use /tmp instead of /dev/shm
        '--disable-extensions',      // Disable all extensions
        '--disable-plugins',        // Disable plugins
        '--disable-gpu',            // Disable GPU for better stability
        '--disable-background-timer-throttling', // Better performance
        '--disable-backgrounding-occluded-windows', // Better performance
        '--disable-renderer-backgrounding' // Better performance
      ]
    },
    
    // Test Artifacts - Optimized for parallel execution
    trace: 'off',                   // Disable trace for better performance
    screenshot: 'only-on-failure',  // Screenshot only when test fails
    video: 'off',                   // Disable video for better performance
  },

  // ===== BROWSER PROJECTS =====
  // Run against multiple browsers/devices in parallel
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use Playwright's bundled Chromium (most stable)
      },
      testMatch: /.*\.spec\.js/,  // Run all spec files
    },
    
    // ===== OTHER BROWSERS (ENABLED for comprehensive testing) =====
    // All browsers will run in parallel for each test case
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\.spec\.js/,  // Run all spec files
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\.spec\.js/,  // Run all spec files
    },

    // ===== REAL BROWSERS (ENABLED) =====
    // Real browsers for more accurate testing
    
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome' // Requires Chrome to be installed
      },
      testMatch: /.*\.spec\.js/,  // Run all spec files
    },
    
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge' // Requires Edge to be installed
      },
      testMatch: /.*\.spec\.js/,  // Run all spec files
    },

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
