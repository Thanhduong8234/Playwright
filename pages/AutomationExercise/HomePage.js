const BasePage = require('../BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

  this.selectors = {
    nav_ContactUs: 'a[href="/contact_us"]'    
  }
}

  async openBrowser() {
    await this.page.goto('https://automationexercise.com/');
    await this.waitForPageLoad();
  }

  async clickContactUs() {
    await this.clickElement(this.selectors.nav_ContactUs);
  }

  
}


module.exports = HomePage;