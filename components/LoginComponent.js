const BasePage = require('../pages/BasePage');

/**
 * LOGIN COMPONENT
 * Reusable component for login functionality
 */
class LoginComponent extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors for login component
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
   * Perform login
   * @param {string} email - Login email
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to remember login
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
   * Fill email field
   * @param {string} email - Email to fill
   */
  async fillEmail(email) {
    await this.fillInput(this.selectors.emailInput, email);
  }

  /**
   * Fill password field
   * @param {string} password - Password to fill
   */
  async fillPassword(password) {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
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
   * Click "Forgot Password" link
   */
  async clickForgotPassword() {
    if (await this.isElementVisible(this.selectors.forgotPasswordLink)) {
      await this.clickElement(this.selectors.forgotPasswordLink);
    }
  }

  /**
   * Check if login form is visible
   * @returns {Promise<boolean>} True if form is visible
   */
  async isLoginFormVisible() {
    return await this.isElementVisible(this.selectors.loginForm);
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if there's an error
   */
  async hasErrorMessage() {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Text of error message
   */
  async getErrorMessage() {
    if (await this.hasErrorMessage()) {
      return await this.getElementText(this.selectors.errorMessage);
    }
    return '';
  }

  /**
   * Check if success message is displayed
   * @returns {Promise<boolean>} True if there's a success message
   */
  async hasSuccessMessage() {
    return await this.isElementVisible(this.selectors.successMessage);
  }

  /**
   * Get success message text
   * @returns {Promise<string>} Text of success message
   */
  async getSuccessMessage() {
    if (await this.hasSuccessMessage()) {
      return await this.getElementText(this.selectors.successMessage);
    }
    return '';
  }

  /**
   * Check if loading spinner is displayed
   * @returns {Promise<boolean>} True if loading
   */
  async isLoading() {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  /**
   * Wait for login process to complete
   */
  async waitForLoginComplete() {
    // Wait for loading spinner to disappear
    if (await this.isLoading()) {
      await this.page.waitForSelector(this.selectors.loadingSpinner, { 
        state: 'hidden', 
        timeout: 10000 
      });
    }
  }

  /**
   * Validate form before submission
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  async validateForm() {
    const errors = [];
    
    // Check email field
    const emailValue = await this.page.locator(this.selectors.emailInput).inputValue();
    if (!emailValue || !emailValue.includes('@')) {
      errors.push('Email is invalid');
    }
    
    // Check password field
    const passwordValue = await this.page.locator(this.selectors.passwordInput).inputValue();
    if (!passwordValue || passwordValue.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.fillEmail('');
    await this.fillPassword('');
  }

  /**
   * Get current form data
   * @returns {Promise<Object>} Form data
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
