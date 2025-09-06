/**
 * CONTACT US STEP DEFINITIONS
 * Các step definitions cho Contact Us functionality
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ===== GIVEN STEPS (Preconditions) =====

Given('I am on the Automation Exercise homepage', async function() {
  await this.homePage.openBrowser();
  await this.waitForPageLoad();
  
  // Verify we're on the homepage
  const title = await this.page.title();
  expect(title).toContain('Automation Exercise');
  console.log('✅ Successfully navigated to homepage');
});

Given('I have generated unique test data', async function() {
  this.generateTestData();
  console.log('✅ Generated unique test data:', this.testData);
});

// ===== WHEN STEPS (Actions) =====

When('I navigate to the Contact Us page', async function() {
  await this.homePage.clickContactUs();
  await this.waitForPageLoad();
  console.log('✅ Navigated to Contact Us page');
});

When('I fill the contact form with blank email:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data.name,
    data.email, // This will be blank
    data.subject,
    data.message
  );
  
  console.log('✅ Filled contact form with blank email');
});

When('I fill the contact form with valid data:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  // Replace placeholders with generated data
  const name = data.name.replace('{generated_name}', this.testData.name);
  const email = data.email.replace('{generated_email}', this.testData.email);
  const subject = data.subject.replace('{generated_subject}', this.testData.subject);
  const message = data.message.replace('{generated_message}', this.testData.message);
  
  await this.contactPage.fillContactForm(name, email, subject, message);
  
  console.log('✅ Filled contact form with valid data');
});

When('I fill the contact form with the following data:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data.name,
    data.email,
    data.subject,
    data.message
  );
  
  console.log('✅ Filled contact form with provided data');
});

When('I fill the contact form with invalid data:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data.name,
    data.email,
    data.subject,
    data.message
  );
  
  console.log('✅ Filled contact form with invalid data');
});

When('I upload a test file {string}', async function(filePath) {
  await this.contactPage.setInputFile(filePath);
  console.log(`✅ Uploaded file: ${filePath}`);
});

When('I click the Submit button', async function() {
  await this.contactPage.clickSubmit();
  console.log('✅ Clicked Submit button');
});

When('I handle the confirmation dialog', async function() {
  // Set up dialog handler before the action that triggers it
  await this.contactPage.acceptDialog();
  console.log('✅ Handled confirmation dialog');
});

// ===== THEN STEPS (Assertions) =====

Then('I should see the Contact Us page title', async function() {
  const title = await this.page.title();
  expect(title).toContain('Contact us');
  console.log('✅ Contact Us page title verified');
});

Then('I should see the contact form', async function() {
  // Verify form elements are visible
  const formVisible = await this.contactPage.isContactFormVisible();
  expect(formVisible).toBe(true);
  console.log('✅ Contact form is visible');
});

Then('I should see the email validation message {string}', async function(expectedMessage) {
  const validationMessage = await this.contactPage.getEmailValidationMessage();
  expect(validationMessage).toContain(expectedMessage);
  console.log(`✅ Email validation message verified: ${validationMessage}`);
});

Then('I should see the success message {string}', async function(expectedMessage) {
  const successMessage = await this.contactPage.getSuccessMessage();
  expect(successMessage).toContain(expectedMessage);
  console.log(`✅ Success message verified: ${successMessage}`);
});

Then('I should see validation error for {string} field', async function(fieldName) {
  // This would need to be implemented based on the specific validation behavior
  const hasValidationError = await this.contactPage.hasValidationError(fieldName);
  expect(hasValidationError).toBe(true);
  console.log(`✅ Validation error verified for ${fieldName} field`);
});

// ===== UTILITY STEPS =====

When('I wait for {int} seconds', async function(seconds) {
  await this.page.waitForTimeout(seconds * 1000);
  console.log(`✅ Waited for ${seconds} seconds`);
});

When('I take a screenshot with name {string}', async function(name) {
  await this.takeScreenshot(name);
  console.log(`✅ Screenshot taken: ${name}`);
});

Then('the page title should be {string}', async function(expectedTitle) {
  const actualTitle = await this.page.title();
  expect(actualTitle).toBe(expectedTitle);
  console.log(`✅ Page title verified: ${actualTitle}`);
});

Then('the page title should contain {string}', async function(expectedText) {
  const actualTitle = await this.page.title();
  expect(actualTitle).toContain(expectedText);
  console.log(`✅ Page title contains: ${expectedText}`);
});
