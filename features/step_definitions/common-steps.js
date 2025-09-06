/**
 * COMMON STEP DEFINITIONS
 * Các step definitions chung có thể tái sử dụng across features
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ===== NAVIGATION STEPS =====

Given('I navigate to {string}', async function(url) {
  await this.page.goto(url);
  await this.waitForPageLoad();
  console.log(`✅ Navigated to: ${url}`);
});

Given('I am on {string} page', async function(pageName) {
  // This could be extended to map page names to URLs
  const pageUrls = {
    'homepage': this.baseUrl,
    'contact us': `${this.baseUrl}/contact_us`,
    'login': `${this.baseUrl}/login`,
    'signup': `${this.baseUrl}/signup`
  };
  
  const url = pageUrls[pageName.toLowerCase()];
  if (url) {
    await this.page.goto(url);
    await this.waitForPageLoad();
    console.log(`✅ Navigated to ${pageName} page`);
  } else {
    throw new Error(`Unknown page: ${pageName}`);
  }
});

When('I click on {string}', async function(elementText) {
  await this.page.click(`text=${elementText}`);
  console.log(`✅ Clicked on: ${elementText}`);
});

When('I click the element with selector {string}', async function(selector) {
  await this.page.click(selector);
  console.log(`✅ Clicked element with selector: ${selector}`);
});

// ===== INPUT STEPS =====

When('I type {string} into {string}', async function(text, fieldLabel) {
  // Try to find field by label, placeholder, or name
  const selectors = [
    `[aria-label="${fieldLabel}"]`,
    `[placeholder="${fieldLabel}"]`,
    `[name="${fieldLabel}"]`,
    `input[type="text"]:has-text("${fieldLabel}")`,
    `textarea:has-text("${fieldLabel}")`
  ];
  
  for (const selector of selectors) {
    try {
      await this.page.fill(selector, text);
      console.log(`✅ Typed "${text}" into ${fieldLabel}`);
      return;
    } catch (error) {
      // Continue to next selector
    }
  }
  
  throw new Error(`Could not find field: ${fieldLabel}`);
});

When('I type {string} into the field with selector {string}', async function(text, selector) {
  await this.page.fill(selector, text);
  console.log(`✅ Typed "${text}" into field with selector: ${selector}`);
});

When('I clear the field {string}', async function(fieldLabel) {
  // Similar logic as typing, but clear the field
  const selectors = [
    `[aria-label="${fieldLabel}"]`,
    `[placeholder="${fieldLabel}"]`,
    `[name="${fieldLabel}"]`
  ];
  
  for (const selector of selectors) {
    try {
      await this.page.fill(selector, '');
      console.log(`✅ Cleared field: ${fieldLabel}`);
      return;
    } catch (error) {
      // Continue to next selector
    }
  }
  
  throw new Error(`Could not find field: ${fieldLabel}`);
});

// ===== WAIT STEPS =====

When('I wait for {int} seconds', async function(seconds) {
  await this.page.waitForTimeout(seconds * 1000);
  console.log(`✅ Waited for ${seconds} seconds`);
});

When('I wait for the element {string} to be visible', async function(selector) {
  await this.page.waitForSelector(selector, { state: 'visible' });
  console.log(`✅ Element is visible: ${selector}`);
});

When('I wait for the element {string} to be hidden', async function(selector) {
  await this.page.waitForSelector(selector, { state: 'hidden' });
  console.log(`✅ Element is hidden: ${selector}`);
});

When('I wait for the text {string} to appear', async function(text) {
  await this.page.waitForSelector(`text=${text}`);
  console.log(`✅ Text appeared: ${text}`);
});

// ===== VERIFICATION STEPS =====

Then('I should see the text {string}', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(true);
  console.log(`✅ Text is visible: ${expectedText}`);
});

Then('I should not see the text {string}', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(false);
  console.log(`✅ Text is not visible: ${expectedText}`);
});

Then('the element {string} should be visible', async function(selector) {
  const isVisible = await this.page.isVisible(selector);
  expect(isVisible).toBe(true);
  console.log(`✅ Element is visible: ${selector}`);
});

Then('the element {string} should not be visible', async function(selector) {
  const isVisible = await this.page.isVisible(selector);
  expect(isVisible).toBe(false);
  console.log(`✅ Element is not visible: ${selector}`);
});

Then('the element {string} should contain the text {string}', async function(selector, expectedText) {
  const elementText = await this.page.textContent(selector);
  expect(elementText).toContain(expectedText);
  console.log(`✅ Element contains expected text: ${expectedText}`);
});

Then('the page URL should contain {string}', async function(expectedUrlPart) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(expectedUrlPart);
  console.log(`✅ URL contains: ${expectedUrlPart}`);
});

Then('the page URL should be {string}', async function(expectedUrl) {
  const currentUrl = this.page.url();
  expect(currentUrl).toBe(expectedUrl);
  console.log(`✅ URL is: ${expectedUrl}`);
});

// ===== UTILITY STEPS =====

When('I take a screenshot', async function() {
  await this.takeScreenshot();
});

When('I take a screenshot named {string}', async function(name) {
  await this.takeScreenshot(name);
});

When('I refresh the page', async function() {
  await this.page.reload();
  await this.waitForPageLoad();
  console.log('✅ Page refreshed');
});

When('I go back to the previous page', async function() {
  await this.page.goBack();
  await this.waitForPageLoad();
  console.log('✅ Navigated back to previous page');
});

When('I scroll to the element {string}', async function(selector) {
  await this.page.locator(selector).scrollIntoViewIfNeeded();
  console.log(`✅ Scrolled to element: ${selector}`);
});

When('I hover over the element {string}', async function(selector) {
  await this.page.hover(selector);
  console.log(`✅ Hovered over element: ${selector}`);
});

// ===== DEBUGGING STEPS =====

When('I debug and pause', async function() {
  await this.page.pause();
});

When('I print the page title', async function() {
  const title = await this.page.title();
  console.log(`📄 Current page title: ${title}`);
});

When('I print the current URL', async function() {
  const url = this.page.url();
  console.log(`🔗 Current URL: ${url}`);
});

Then('I log the message {string}', async function(message) {
  console.log(`📝 Custom log: ${message}`);
});
