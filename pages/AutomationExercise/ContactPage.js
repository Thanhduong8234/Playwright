const BasePage = require('../BasePage');

/**
 * AUTOMATION EXERCISE CONTACT PAGE
 * Page Object for AutomationExercise contact page
 */
class ContactPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Define selectors for contact form elements
  selectors = {
    input_Name: 'input[name="name"]',
    input_Email: 'input[name="email"]',
    input_Subject: 'input[name="subject"]',
    input_Message: 'textarea[name="message"]',
    button_Submit: 'input[name="submit"]',
    successMessage: 'div[class="status alert alert-success"]',
    button_Home: 'a[href="/"]',
    input_UploadFile: 'input[name="upload_file"]'
  }

  /**
   * Navigate to contact page
   */
  async navigate() {
    await this.goto('https://automationexercise.com/contactus');
    await this.waitForPageLoad();
  }

  /**
   * Fill contact form with provided data
   * @param {string} name - Contact name
   * @param {string} email - Contact email
   * @param {string} subject - Contact subject
   * @param {string} message - Contact message
   */
  async fillContactForm(name, email, subject, message) {  
    await this.waitForPageLoad();  
    await this.fillInput(this.selectors.input_Name, name);
    await this.fillInput(this.selectors.input_Email, email);
    await this.fillInput(this.selectors.input_Subject, subject);
    await this.fillInput(this.selectors.input_Message, message);
  }
  
  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.clickElement(this.selectors.button_Submit);
  }

  /**
   * Get success message text
   * @returns {Promise<string>} Success message text
   */
  async getSuccessMessage() {
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Method to verify and confirm alert
   * @param {string} expectedMessage - Expected alert message (optional)
   * @returns {Promise<Object>} Object with alert message and appearance status
   */
  async verifyAndConfirmAlert(expectedMessage = null) {
    let alertMessage = '';
    let alertAppeared = false;
    
    // Setup listener for dialog
    this.page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      alertAppeared = true;
      console.log('🚨 Alert appeared with message:', alertMessage);
      
      // Verify message if provided
      if (expectedMessage && !alertMessage.includes(expectedMessage)) {
        throw new Error(`Expected alert message to contain "${expectedMessage}", but got "${alertMessage}"`);
      }
      
      // Confirm alert
      await dialog.accept();
      console.log('✅ Alert confirmed');
    });
    
    return { alertMessage, alertAppeared };
  }

  // Method kept for backward compatibility
  async confirmAlert() {
    return await this.verifyAndConfirmAlert();
  }

  /**
   * Method to wait and verify alert appearance
   * @param {string} expectedMessage - Expected alert message (optional)
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Object>} Object with alert message and dialog
   */
  async waitForAlert(expectedMessage = null, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Alert did not appear within timeout'));
      }, timeout);
      
      this.page.once('dialog', async (dialog) => {
        clearTimeout(timeoutId);
        const message = dialog.message();
        
        if (expectedMessage && !message.includes(expectedMessage)) {
          reject(new Error(`Expected alert message to contain "${expectedMessage}", but got "${message}"`));
        } else {
          resolve({ message, dialog });
        }
      });
    });
  }
  
  /**
   * Verify success message
   * @param {string} message - Expected message
   * @returns {Promise<string>} Actual message text
   */
  async verifyMessage(message) {
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Verify blank email validation message
   * @param {string} message - Expected validation message
   * @returns {Promise<string>} Actual validation message
   */
  async verifyBlankEmailMessage(message) {
    // Trigger validation first by clearing email and clicking submit
    await this.fillInput(this.selectors.input_Email, '');
    await this.clickSubmit();
    
    // Get validation message from email input
    const validationMessage = await this.getElementTooltip(this.selectors.input_Email);
    console.log('📝 Validation message:', validationMessage);
    
    return validationMessage.includes(message);
  }

  async setInputFile(filePath) {
    await this.uploadFile(this.selectors.input_UploadFile, filePath);
  }
}

module.exports = ContactPage;