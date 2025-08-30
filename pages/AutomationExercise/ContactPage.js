const BasePage = require('../BasePage');

class ContactPage extends BasePage {
  constructor(page) {
    super(page);
  }

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

  async navigate() {
    await this.goto('https://automationexercise.com/contactus');
    await this.waitForPageLoad();
  }

  async fillContactForm(name, email, subject, message) {  
    await this.waitForPageLoad();  
    await this.fillInput(this.selectors.input_Name, name);
    await this.fillInput(this.selectors.input_Email, email);
    await this.fillInput(this.selectors.input_Subject, subject);
    await this.fillInput(this.selectors.input_Message, message);
  }
  
  async clickSubmit() {
    await this.clickElement(this.selectors.button_Submit);
  }

  async getSuccessMessage() {
    return await this.getElementText(this.selectors.successMessage);
  }

  
  // Method để verify và confirm alert
  async verifyAndConfirmAlert(expectedMessage = null) {
    let alertMessage = '';
    let alertAppeared = false;
    
    // Setup listener cho dialog
    this.page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      alertAppeared = true;
      console.log('🚨 Alert appeared with message:', alertMessage);
      
      // Verify message nếu có
      if (expectedMessage && !alertMessage.includes(expectedMessage)) {
        throw new Error(`Expected alert message to contain "${expectedMessage}", but got "${alertMessage}"`);
      }
      
      // Confirm alert
      await dialog.accept();
      console.log('✅ Alert confirmed');
    });
    
    return { alertMessage, alertAppeared };
  }

  // Method cũ giữ lại để backward compatibility
  async confirmAlert() {
    return await this.verifyAndConfirmAlert();
  }

  // Method chỉ để wait và verify alert xuất hiện
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
  
  async verifyMessage(message) {
    return await this.getElementText(this.selectors.successMessage);
  }

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