/**
 * BASE PAGE CLASS
 * Contains common methods for all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Maximize browser window
   */
  async maximizeWindow() {
    try {
      // Method 1: Use JavaScript to maximize
      await this.page.evaluate(() => {
        window.moveTo(0, 0);
        window.resizeTo(screen.availWidth, screen.availHeight);
      });
      console.log('✅ Window maximized via JavaScript');
    } catch (error) {
      try {
        // Method 2: Use CDP (Chrome DevTools Protocol)
        const client = await this.page.context().newCDPSession(this.page);
        const { windowId } = await client.send('Browser.getWindowForTarget');
        await client.send('Browser.setWindowBounds', {
          windowId,
          bounds: { windowState: 'maximized' }
        });
        console.log('✅ Window maximized via CDP');
      } catch (cdpError) {
        // Method 3: Fallback to viewport
        console.log('⚠️ Using viewport fallback');
        await this.page.setViewportSize({ width: 1920, height: 1080 });
      }
    }
  }

  /**
   * Navigate to specific URL
   * @param {string} url - URL to navigate to
   */
  async goto(url) {
    try {
      // Maximize browser window first
      await this.maximizeWindow();
      
      // Navigate to URL with extended timeout
      await this.page.goto(url, { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });
      console.log(`✅ Successfully navigated to: ${url}`);
    } catch (error) {
      console.error(`❌ Failed to navigate to: ${url}`, error.message);
      throw error;
    }
  }

  /**
   * Wait for element to appear
   * @param {string} selector - CSS selector of the element
   * @param {number} timeout - Wait time (ms)
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector of the element
   * @param {number} timeout - Wait time (ms)
   */
  async waitForElementVisible(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param {string} selector - CSS selector of the element
   * @param {number} timeout - Wait time (ms)
   */
  async waitForElementHidden(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Wait for text to appear
   * @param {string} text - Text to wait for
   * @param {number} timeout - Wait time (ms)
   */
  async waitForText(text, timeout = 30000) {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Get text content of element
   * @param {string} selector - CSS selector of the element
   * @returns {Promise<string>} Text content of the element
   */
  async getElementText(selector) {
    await this.waitForElementVisible(selector);
    return await this.page.locator(selector).textContent();
  }

  async getElementTooltip(selector) {
    return await this.page.locator(selector).evaluate(
      input => input.validationMessage
    );
  }

  /**
   * Click element with comprehensive debug
   * @param {string} selector - CSS selector of the element
   */
  async clickElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.click(selector);
  }

  /**
   * Click element at specific position
   * @param {string} selector - CSS selector of the element
   * @param {number} x - x position of the element
   * @param {number} y - y position of the element
   */
  async clickElementWithPosition(selector, x, y) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).click({ position: { x, y } });
  }

  /**
   * Fill text into input field
   * @param {string} selector - CSS selector of the input
   * @param {string} text - Text to fill
   */
  async fillInput(selector, text) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).fill(text);
  }

  /**
   * Press key on element
   * @param {string} selector - CSS selector of the element
   * @param {string} key - Key to press (e.g., 'Enter', 'Tab')
   */
  async pressKey(selector, key) {
    await this.page.locator(selector).press(key);
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector of the element
   * @returns {Promise<boolean>} True if element is visible
   */
  async isElementVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get page title
   * @returns {Promise<string>} Title of the page
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns {Promise<string>} Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Take screenshot
   * @param {string} path - Path to save screenshot
   * @param {boolean} fullPage - Capture full page or only viewport
   */
  async takeScreenshot(path, fullPage = false) {
    await this.page.screenshot({ path, fullPage });
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.log('Error waiting for network idle state:', error.message);
    }
  }

  /**
   * Scroll to element
   * @param {string} selector - CSS selector of the element
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Count number of elements
   * @param {string} selector - CSS selector of the elements
   * @returns {Promise<number>} Number of elements
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Hover over element
   * @param {string} selector - CSS selector of the element
   */
  async hoverElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).hover();
  }

  /**
   * Double click element
   * @param {string} selector - CSS selector of the element
   */
  async doubleClickElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).dblclick();
  }

  /**
   * Right click element
   * @param {string} selector - CSS selector of the element
   */
  async rightClickElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).click({ button: 'right' });
  }

  /**
   * Accept dialog
   */
  async acceptDialog() {
    this.page.once('dialog', async dialog => {

  // expect(dialog.message()).toContain('Press OK to proceed!');
  await dialog.accept(); // Press OK button
    });
  }

  /**
   * Upload file
   * @param {string} selector - CSS selector of the input
   * @param {string} filePath - Path to file to upload
   */
  async uploadFile(selector, filePath) {
    const path = require('path');
    const absolutePath = path.resolve(process.cwd(), filePath);
    await this.page.locator(selector).setInputFiles(absolutePath);
  }

}

module.exports = BasePage;
