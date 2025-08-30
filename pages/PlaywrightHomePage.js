const BasePage = require('./BasePage');

/**
 * PLAYWRIGHT HOME PAGE
 * Page Object cho trang chủ Playwright
 */
class PlaywrightHomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Định nghĩa các selectors
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
    
    // URL trang chủ
    this.url = 'https://playwright.dev/';
  }

  /**
   * Điều hướng đến trang chủ Playwright
   */
  async navigate() {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Click vào nút "Get Started"
   */
  async clickGetStarted() {
    await this.clickElement(this.selectors.getStartedButton);
  }

  /**
   * Kiểm tra xem nút "Get Started" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isGetStartedVisible() {
    return await this.isElementVisible(this.selectors.getStartedButton);
  }

  /**
   * Click vào menu Docs
   */
  async clickDocsMenu() {
    await this.clickElement(this.selectors.docsMenu);
  }

  /**
   * Kiểm tra xem menu Docs có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isDocsMenuVisible() {
    return await this.isElementVisible(this.selectors.docsMenu);
  }

  /**
   * Click vào menu API
   */
  async clickApiMenu() {
    await this.clickElement(this.selectors.apiMenu);
  }

  /**
   * Kiểm tra xem menu API có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isApiMenuVisible() {
    return await this.isElementVisible(this.selectors.apiMenu);
  }

  /**
   * Kiểm tra xem heading Installation có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isInstallationHeadingVisible() {
    return await this.isElementVisible(this.selectors.installationHeading);
  }

  /**
   * Lấy text của page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.getPageTitle();
  }

  /**
   * Tìm kiếm
   * @param {string} searchTerm - Từ khóa tìm kiếm
   */
  async search(searchTerm) {
    if (await this.isElementVisible(this.selectors.searchInput)) {
      await this.fillInput(this.selectors.searchInput, searchTerm);
      await this.pressKey(this.selectors.searchInput, 'Enter');
    }
  }

  /**
   * Lấy tất cả menu items trong navigation
   * @returns {Promise<string[]>} Danh sách text của menu items
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
   * Kiểm tra xem trang có chứa các section chính không
   * @returns {Promise<{hero: boolean, features: boolean}>}
   */
  async checkMainSections() {
    return {
      hero: await this.isElementVisible(this.selectors.heroSection),
      features: await this.isElementVisible(this.selectors.featuresList)
    };
  }

  /**
   * Scroll đến phần features
   */
  async scrollToFeatures() {
    if (await this.isElementVisible(this.selectors.featuresList)) {
      await this.scrollToElement(this.selectors.featuresList);
    }
  }

  /**
   * Lấy thông tin về các features được hiển thị
   * @returns {Promise<Array>} Danh sách features
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
