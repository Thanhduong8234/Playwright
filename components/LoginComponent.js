const BasePage = require('../pages/BasePage');

/**
 * LOGIN COMPONENT
 * Component tái sử dụng cho chức năng đăng nhập
 */
class LoginComponent extends BasePage {
  constructor(page) {
    super(page);
    
    // Định nghĩa các selectors cho login component
    this.selectors = {
      loginForm: '.login-form, #login-form, form[name="login"]',
      emailInput: 'input[name="email"], input[type="email"], #email',
      passwordInput: 'input[name="password"], input[type="password"], #password',
      loginButton: 'button[type="submit"], .login-button, #login-btn',
      rememberMeCheckbox: 'input[name="remember"], #remember-me',
      forgotPasswordLink: '.forgot-password, a[href*="forgot"]',
      errorMessage: '.error-message, .alert-error, .login-error',
      successMessage: '.success-message, .alert-success',
      loadingSpinner: '.loading, .spinner, .login-loading'
    };
  }

  /**
   * Thực hiện đăng nhập
   * @param {string} email - Email đăng nhập
   * @param {string} password - Mật khẩu
   * @param {boolean} rememberMe - Có ghi nhớ đăng nhập không
   */
  async login(email, password, rememberMe = false) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickLoginButton();
  }

  /**
   * Nhập email
   * @param {string} email - Email cần nhập
   */
  async fillEmail(email) {
    await this.fillInput(this.selectors.emailInput, email);
  }

  /**
   * Nhập password
   * @param {string} password - Password cần nhập
   */
  async fillPassword(password) {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Click nút đăng nhập
   */
  async clickLoginButton() {
    await this.clickElement(this.selectors.loginButton);
  }

  /**
   * Check "Remember Me" checkbox
   */
  async checkRememberMe() {
    if (await this.isElementVisible(this.selectors.rememberMeCheckbox)) {
      await this.clickElement(this.selectors.rememberMeCheckbox);
    }
  }

  /**
   * Click link "Forgot Password"
   */
  async clickForgotPassword() {
    if (await this.isElementVisible(this.selectors.forgotPasswordLink)) {
      await this.clickElement(this.selectors.forgotPasswordLink);
    }
  }

  /**
   * Kiểm tra login form có hiển thị không
   * @returns {Promise<boolean>} True nếu form visible
   */
  async isLoginFormVisible() {
    return await this.isElementVisible(this.selectors.loginForm);
  }

  /**
   * Kiểm tra error message có hiển thị không
   * @returns {Promise<boolean>} True nếu có error
   */
  async hasErrorMessage() {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Lấy text của error message
   * @returns {Promise<string>} Text của error message
   */
  async getErrorMessage() {
    if (await this.hasErrorMessage()) {
      return await this.getElementText(this.selectors.errorMessage);
    }
    return '';
  }

  /**
   * Kiểm tra success message có hiển thị không
   * @returns {Promise<boolean>} True nếu có success message
   */
  async hasSuccessMessage() {
    return await this.isElementVisible(this.selectors.successMessage);
  }

  /**
   * Lấy text của success message
   * @returns {Promise<string>} Text của success message
   */
  async getSuccessMessage() {
    if (await this.hasSuccessMessage()) {
      return await this.getElementText(this.selectors.successMessage);
    }
    return '';
  }

  /**
   * Kiểm tra loading spinner có hiển thị không
   * @returns {Promise<boolean>} True nếu đang loading
   */
  async isLoading() {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  /**
   * Chờ cho quá trình login hoàn tất
   */
  async waitForLoginComplete() {
    // Chờ loading spinner biến mất
    if (await this.isLoading()) {
      await this.page.waitForSelector(this.selectors.loadingSpinner, { 
        state: 'hidden', 
        timeout: 10000 
      });
    }
  }

  /**
   * Validate form trước khi submit
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  async validateForm() {
    const errors = [];
    
    // Kiểm tra email field
    const emailValue = await this.page.locator(this.selectors.emailInput).inputValue();
    if (!emailValue || !emailValue.includes('@')) {
      errors.push('Email không hợp lệ');
    }
    
    // Kiểm tra password field
    const passwordValue = await this.page.locator(this.selectors.passwordInput).inputValue();
    if (!passwordValue || passwordValue.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Clear tất cả form fields
   */
  async clearForm() {
    await this.fillEmail('');
    await this.fillPassword('');
  }

  /**
   * Lấy thông tin form hiện tại
   * @returns {Promise<Object>} Thông tin form
   */
  async getFormData() {
    return {
      email: await this.page.locator(this.selectors.emailInput).inputValue(),
      password: await this.page.locator(this.selectors.passwordInput).inputValue(),
      rememberMe: await this.isElementVisible(this.selectors.rememberMeCheckbox) ? 
        await this.page.locator(this.selectors.rememberMeCheckbox).isChecked() : false
    };
  }
}

module.exports = LoginComponent;
