/**
 * CUCUMBER CONFIGURATION FOR PLAYWRIGHT
 * Cấu hình Cucumber để tích hợp với Playwright
 */

const config = {
  // ===== BASIC SETTINGS =====
  requireModule: ['ts-node/register'],
  require: [
    'features/step_definitions/**/*.js',
    'hooks/**/*.js'
  ],
  
  // ===== FEATURE FILES =====
  paths: ['features/**/*.feature'],
  
  // ===== FORMATTING & REPORTING =====
  format: [
    'pretty',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    '@cucumber/pretty-formatter'
  ],
  
  // ===== PARALLEL EXECUTION =====
  parallel: 2,
  
  // ===== TAGS =====
  // Run tests based on tags: @smoke, @regression, @contact-us
  tags: process.env.TAGS || '',
  
  // ===== RETRY CONFIGURATION =====
  retry: process.env.CI ? 2 : 1,
  
  // ===== WORLD PARAMETERS =====
  worldParameters: {
    // Playwright configuration
    playwright: {
      headless: process.env.HEADED !== 'true',
      browser: process.env.BROWSER || 'chromium',
      viewport: { width: 1920, height: 1080 },
      timeout: 60000
    },
    
    // Test environment
    environment: process.env.TEST_ENV || 'staging',
    
    // Base URLs
    baseUrls: {
      staging: 'https://automationexercise.com',
      production: 'https://automationexercise.com'
    }
  },
  
  // ===== HOOKS =====
  beforeAll: async function() {
    console.log('🚀 Starting Cucumber test suite...');
  },
  
  afterAll: async function() {
    console.log('✅ Cucumber test suite completed!');
  }
};

module.exports = config;
