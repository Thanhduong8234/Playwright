const BasePage = require('./BasePage');

/**
 * PLAYWRIGHT HOME PAGE
 * Page Object for Playwright homepage
 */
class PlaywrightHomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors
    this.selectors = {
      getStartedButton: 'text=Get started',
      docsMenu: 'nav >> text=Docs',
      apiMenu: 'nav >> text=API',
      installationHeading: 'role=heading[name="Installation"]',
      pageTitle: 'title',
      searchInput: '[placeholder*="Search"]',
      navigationMenu: 'nav',
      heroSection: '.hero',
      featuresList: '.features'
    };
    
    // Homepage URL
    this.url = 'https://playwright.dev/';
  }

  /**
   * Navigate to Playwright homepage
   */
  async navigate() {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Click "Get Started" button
   */
  async clickGetStarted() {
    await this.clickElement(this.selectors.getStartedButton);
  }

  /**
   * Check if "Get Started" button is visible
   * @returns {Promise<boolean>}
   */
  async isGetStartedVisible() {
    return await this.isElementVisible(this.selectors.getStartedButton);
  }

  /**
   * Click Docs menu
   */
  async clickDocsMenu() {
    await this.clickElement(this.selectors.docsMenu);
  }

  /**
   * Check if Docs menu is visible
   * @returns {Promise<boolean>}
   */
  async isDocsMenuVisible() {
    return await this.isElementVisible(this.selectors.docsMenu);
  }

  /**
   * Click API menu
   */
  async clickApiMenu() {
    await this.clickElement(this.selectors.apiMenu);
  }

  /**
   * Check if API menu is visible
   * @returns {Promise<boolean>}
   */
  async isApiMenuVisible() {
    return await this.isElementVisible(this.selectors.apiMenu);
  }

  /**
   * Check if Installation heading is visible
   * @returns {Promise<boolean>}
   */
  async isInstallationHeadingVisible() {
    return await this.isElementVisible(this.selectors.installationHeading);
  }

  /**
   * Get page title text
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.getPageTitle();
  }

  /**
   * Search
   * @param {string} searchTerm - Search keyword
   */
  async search(searchTerm) {
    if (await this.isElementVisible(this.selectors.searchInput)) {
      await this.fillInput(this.selectors.searchInput, searchTerm);
      await this.pressKey(this.selectors.searchInput, 'Enter');
    }
  }

  /**
   * Get all menu items in navigation
   * @returns {Promise<string[]>} List of menu item texts
   */
  async getNavigationMenuItems() {
    const menuItems = await this.page.locator(`${this.selectors.navigationMenu} a`).all();
    const menuTexts = [];
    
    for (const item of menuItems) {
      const text = await item.textContent();
      if (text && text.trim()) {
        menuTexts.push(text.trim());
      }
    }
    
    return menuTexts;
  }

  /**
   * Check if main sections are present
   * @returns {Promise<{hero: boolean, features: boolean}>}
   */
  async checkMainSections() {
    return {
      hero: await this.isElementVisible(this.selectors.heroSection),
      features: await this.isElementVisible(this.selectors.featuresList)
    };
  }

  /**
   * Scroll to features section
   */
  async scrollToFeatures() {
    if (await this.isElementVisible(this.selectors.featuresList)) {
      await this.scrollToElement(this.selectors.featuresList);
    }
  }

  /**
   * Get information about displayed features
   * @returns {Promise<Array>} List of features
   */
  async getFeaturesList() {
    if (await this.isElementVisible(this.selectors.featuresList)) {
      const features = await this.page.locator(`${this.selectors.featuresList} .feature`).all();
      const featureData = [];
      
      for (const feature of features) {
        const title = await feature.locator('h3, .title').textContent();
        const description = await feature.locator('p, .description').textContent();
        
        featureData.push({
          title: title?.trim() || '',
          description: description?.trim() || ''
        });
      }
      
      return featureData;
    }
    
    return [];
  }
}

module.exports = PlaywrightHomePage;
