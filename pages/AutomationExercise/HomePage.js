const BasePage = require('../BasePage');

/**
 * AUTOMATION EXERCISE HOME PAGE
 * Page Object for AutomationExercise homepage
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Define selectors for homepage elements
    this.selectors = {
      nav_ContactUs: 'a[href="/contact_us"]'    
    }
  }

  /**
   * Open browser and navigate to AutomationExercise homepage
   */
  async openBrowser() {
    try {
      await this.page.goto('https://automationexercise.com/', { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });
      await this.waitForPageLoad();
      console.log('✅ Successfully opened AutomationExercise homepage');
    } catch (error) {
      console.error('❌ Failed to open AutomationExercise homepage:', error.message);
      throw error;
    }
  }

  /**
   * Click on Contact Us navigation link
   */
  async clickContactUs() {
    await this.clickElement(this.selectors.nav_ContactUs);
  }
}

module.exports = HomePage;