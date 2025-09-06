/**
 * CUCUMBER WORLD CONTEXT
 * Quản lý context và shared state giữa các step definitions
 */

const { setWorldConstructor, World, Before, After } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

// Import Page Objects
const HomePage = require('../../pages/AutomationExercise/HomePage');
const ContactPage = require('../../pages/AutomationExercise/ContactPage');
const TestDataGenerator = require('../../utils/TestDataGenerator');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    
    // Browser và Page instances
    this.browser = null;
    this.context = null;
    this.page = null;
    
    // Page Objects
    this.homePage = null;
    this.contactPage = null;
    
    // Test Data
    this.testData = {};
    
    // Configuration từ world parameters
    this.config = options.parameters.playwright || {
      headless: true,
      browser: 'chromium',
      viewport: { width: 1920, height: 1080 },
      timeout: 60000
    };
    
    this.baseUrl = options.parameters.baseUrls?.[options.parameters.environment] || 'https://automationexercise.com';
  }

  /**
   * Khởi tạo browser và page
   */
  async initializeBrowser() {
    try {
      // Chọn browser engine
      let browserType;
      switch (this.config.browser.toLowerCase()) {
        case 'firefox':
          browserType = firefox;
          break;
        case 'webkit':
        case 'safari':
          browserType = webkit;
          break;
        case 'chromium':
        case 'chrome':
        default:
          browserType = chromium;
          break;
      }

      // Launch browser
      this.browser = await browserType.launch({
        headless: this.config.headless,
        args: [
          '--start-maximized',
          '--window-size=1920,1080',
          '--disable-web-security',
          '--no-sandbox',
          '--disable-dev-shm-usage'
        ]
      });

      // Create context
      this.context = await this.browser.newContext({
        viewport: this.config.viewport,
        ignoreHTTPSErrors: true,
        acceptDownloads: true
      });

      // Create page
      this.page = await this.context.newPage();
      
      // Set timeout
      this.page.setDefaultTimeout(this.config.timeout);
      this.page.setDefaultNavigationTimeout(this.config.timeout);
      
      // Initialize Page Objects
      this.homePage = new HomePage(this.page);
      this.contactPage = new ContactPage(this.page);
      
      console.log(`✅ Browser initialized: ${this.config.browser}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Đóng browser
   */
  async closeBrowser() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      console.log('✅ Browser closed successfully');
    } catch (error) {
      console.error('❌ Failed to close browser:', error);
    }
  }

  /**
   * Generate test data
   */
  generateTestData() {
    this.testData = {
      name: TestDataGenerator.generateUniqueName('Cucumber User'),
      email: TestDataGenerator.generateUniqueEmail(),
      subject: TestDataGenerator.generateUniqueSubject(),
      message: TestDataGenerator.generateUniqueMessage()
    };
    return this.testData;
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name = 'screenshot') {
    if (this.page) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `screenshots/cucumber-${name}-${timestamp}.png`;
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    }
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad() {
    if (this.page) {
      await this.page.waitForLoadState('load');
      await this.page.waitForLoadState('domcontentloaded');
      try {
        await this.page.waitForLoadState('networkidle');
      } catch (error) {
        console.log('Network idle timeout - continuing...');
      }
    }
  }
}

// Set World Constructor
setWorldConstructor(CustomWorld);

module.exports = CustomWorld;
