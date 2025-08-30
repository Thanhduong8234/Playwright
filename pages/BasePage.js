/**
 * BASE PAGE CLASS
 * Chứa các phương thức chung cho tất cả các trang
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
   * Điều hướng đến URL cụ thể
   * @param {string} url - URL cần điều hướng đến
   */
  async goto(url) {
    // Maximize browser window first
    await this.maximizeWindow();
    
    // Navigate to URL
    await this.page.goto(url);
  }

  /**
   * Chờ đợi element xuất hiện
   * @param {string} selector - CSS selector của element
   * @param {number} timeout - Thời gian chờ (ms)
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Chờ đợi element visible
   * @param {string} selector - CSS selector của element
   * @param {number} timeout - Thời gian chờ (ms)
   */
  async waitForElementVisible(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Chờ đợi element hidden
   * @param {string} selector - CSS selector của element
   * @param {number} timeout - Thời gian chờ (ms)
   */
  async waitForElementHidden(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Chờ đợi text xuất hiện
   * @param {string} text - Text cần chờ
   * @param {number} timeout - Thời gian chờ (ms)
   */
  async waitForText(text, timeout = 30000) {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Lấy text của element
   * @param {string} selector - CSS selector của element
   * @returns {Promise<string>} Text content của element
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
   * Click vào element với comprehensive debug
   * @param {string} selector - CSS selector của element
   */
  async clickElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.click(selector);
  }

  /**
   * Click vào element với position
   * @param {string} selector - CSS selector của element
   * @param {number} x - Vị trí x của element
   * @param {number} y - Vị trí y của element
   */
  async clickElementWithPosition(selector, x, y) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).click({ position: { x, y } });
  }

  /**
   * Nhập text vào input field
   * @param {string} selector - CSS selector của input
   * @param {string} text - Text cần nhập
   */
  async fillInput(selector, text) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).fill(text);
  }

  /**
   * Nhấn phím
   * @param {string} selector - CSS selector của element
   * @param {string} key - Phím cần nhấn (ví dụ: 'Enter', 'Tab')
   */
  async pressKey(selector, key) {
    await this.page.locator(selector).press(key);
  }

  /**
   * Kiểm tra element có visible không
   * @param {string} selector - CSS selector của element
   * @returns {Promise<boolean>} True nếu element visible
   */
  async isElementVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Lấy title của trang
   * @returns {Promise<string>} Title của trang
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Lấy URL hiện tại
   * @returns {Promise<string>} URL hiện tại
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Chụp ảnh màn hình
   * @param {string} path - Đường dẫn lưu ảnh
   * @param {boolean} fullPage - Chụp toàn bộ trang hay chỉ viewport
   */
  async takeScreenshot(path, fullPage = false) {
    await this.page.screenshot({ path, fullPage });
  }

  /**
   * Đợi cho trang load hoàn toàn
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Scroll đến element
   * @param {string} selector - CSS selector của element
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Đếm số lượng elements
   * @param {string} selector - CSS selector của elements
   * @returns {Promise<number>} Số lượng elements
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Hover vào element
   * @param {string} selector - CSS selector của element
   */
  async hoverElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).hover();
  }

  /**
   * Double click vào element
   * @param {string} selector - CSS selector của element
   */
  async doubleClickElement(selector) {
    await this.waitForElementVisible(selector);
    await this.page.locator(selector).dblclick();
  }

  /**
   * Right click vào element
   * @param {string} selector - CSS selector của element
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
      await dialog.accept(); // Ấn nút OK
    });
  }

  /**
   * Upload file
   * @param {string} selector - CSS selector của input
   * @param {string} filePath - Đường dẫn file cần upload
   */
  async uploadFile(selector, filePath) {
    const path = require('path');
    const absolutePath = path.resolve(process.cwd(), filePath);
    await this.page.locator(selector).setInputFiles(absolutePath);
  }

}

module.exports = BasePage;
