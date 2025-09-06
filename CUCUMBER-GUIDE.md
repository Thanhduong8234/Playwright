# 🥒 HƯỚNG DẪN SỬ DỤNG CUCUMBER VỚI PLAYWRIGHT

## 📚 **MỤC LỤC**

1. [Giới thiệu](#giới-thiệu)
2. [Cài đặt và Setup](#cài-đặt-và-setup)
3. [Cấu trúc dự án](#cấu-trúc-dự-án)
4. [Viết Feature Files](#viết-feature-files)
5. [Tạo Step Definitions](#tạo-step-definitions)
6. [Chạy Tests](#chạy-tests)
7. [Reporting](#reporting)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🌟 **GIỚI THIỆU**

Dự án này đã được tích hợp Cucumber để hỗ trợ **Behavior Driven Development (BDD)**. Cucumber cho phép:

- ✅ Viết test cases bằng ngôn ngữ tự nhiên (Gherkin)
- ✅ Collaboration tốt hơn giữa BA, Tester và Developer
- ✅ Living documentation tự động
- ✅ Test cases dễ đọc và bảo trì

---

## ⚙️ **CÀI ĐẶT VÀ SETUP**

### **1. Cài đặt Dependencies**

```bash
# Cài đặt tất cả dependencies
npm install

# Cài đặt browsers cho Playwright
npm run test:install-browsers
```

### **2. Kiểm tra Setup**

```bash
# Chạy test đơn giản để kiểm tra
npm run test:cucumber -- --tags @smoke
```

---

## 📁 **CẤU TRÚC DỰ ÁN**

```
Playwright/
├── features/                           # 🥒 Cucumber Features
│   ├── contact-us.feature             # Feature files (Gherkin)
│   ├── automation-exercise.feature
│   └── step_definitions/              # Step definitions
│       ├── world.js                   # Cucumber World context
│       ├── contact-steps.js           # Contact-specific steps
│       └── common-steps.js            # Reusable steps
│
├── hooks/                             # 🪝 Cucumber Hooks
│   └── browser.hooks.js               # Browser lifecycle hooks
│
├── pages/                             # 📄 Page Object Model (Existing)
│   ├── BasePage.js
│   └── AutomationExercise/
│       ├── HomePage.js
│       └── ContactPage.js
│
├── reports/                           # 📊 Test Reports
│   ├── cucumber-report.html
│   └── cucumber-report.json
│
├── cucumber.config.js                 # ⚙️ Cucumber configuration
├── .cucumberrc.json                   # 🔧 Cucumber runtime config
└── package.json                       # 📦 Updated with Cucumber scripts
```

---

## 🥒 **VIẾT FEATURE FILES**

### **Cú pháp Gherkin cơ bản**

```gherkin
Feature: Contact Us Functionality
  As a user
  I want to contact support
  So that I can get help

  Background:
    Given I am on the homepage

  @smoke @positive
  Scenario: Submit contact form successfully
    Given I navigate to the Contact Us page
    When I fill the contact form with valid data
    And I click Submit button
    Then I should see success message

  @data-driven
  Scenario Outline: Submit form with different data
    When I fill form with "<name>" and "<email>"
    Then I should see "<result>"
    
    Examples:
      | name  | email           | result  |
      | John  | john@email.com  | Success |
      | Jane  | jane@email.com  | Success |
```

### **Tags hỗ trợ**

- `@smoke` - Smoke tests
- `@regression` - Regression tests  
- `@positive` - Happy path tests
- `@negative` - Error/validation tests
- `@slow` - Tests cần timeout cao
- `@headed` - Chạy với browser visible
- `@screenshot` - Tự động chụp screenshot

---

## 🔧 **TẠO STEP DEFINITIONS**

### **Ví dụ Step Definition**

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the homepage', async function() {
  await this.homePage.openBrowser();
  await this.waitForPageLoad();
});

When('I click the {string} button', async function(buttonText) {
  await this.page.click(`text=${buttonText}`);
});

Then('I should see the text {string}', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(true);
});
```

### **Sử dụng World Context**

```javascript
// Trong step definition, bạn có access to:
this.page          // Playwright page instance
this.browser       // Browser instance
this.homePage      // HomePage object
this.contactPage   // ContactPage object
this.testData      // Generated test data
this.takeScreenshot() // Screenshot utility
```

---

## 🚀 **CHẠY TESTS**

### **Scripts cơ bản**

```bash
# Chạy tất cả Cucumber tests
npm run test:cucumber

# Chạy với browser visible (headed mode)  
npm run test:cucumber:headed

# Chạy parallel với 2 workers
npm run test:cucumber:parallel

# Chạy với HTML report
npm run test:cucumber:report

# Chạy với JSON output
npm run test:cucumber:json
```

### **Chạy tests theo tags**

```bash
# Chỉ chạy smoke tests
npx cucumber-js --tags "@smoke"

# Chạy regression tests, bỏ qua slow tests
npx cucumber-js --tags "@regression and not @slow"

# Chạy tests cho contact-us feature
npx cucumber-js --tags "@contact-us"
```

### **Chạy specific feature**

```bash
# Chạy một feature file cụ thể
npx cucumber-js features/contact-us.feature

# Chạy scenario cụ thể
npx cucumber-js features/contact-us.feature:12
```

### **Chạy với browsers khác nhau**

```bash
# Firefox
BROWSER=firefox npm run test:cucumber

# WebKit/Safari  
BROWSER=webkit npm run test:cucumber

# Headed mode
HEADED=true npm run test:cucumber
```

---

## 📊 **REPORTING**

### **HTML Report**

```bash
npm run test:cucumber:report
# Mở: reports/cucumber-report.html
```

### **JSON Report**

```bash
npm run test:cucumber:json  
# File: reports/cucumber-report.json
```

### **Multiple HTML Reporter** (nâng cao)

```javascript
// Sau khi chạy tests, generate report đẹp hơn
const report = require('multiple-cucumber-html-reporter');

report.generate({
    jsonDir: './reports/',
    reportPath: './reports/multiple-report/',
    metadata: {
        browser: {
            name: 'chrome',
            version: '100'
        },
        device: 'Local test machine',
        platform: {
            name: 'Windows',
            version: '10'
        }
    }
});
```

---

## 🎯 **BEST PRACTICES**

### **1. Tổ chức Feature Files**

```gherkin
# ✅ TỐT - Rõ ràng và có ý nghĩa
Scenario: User successfully submits contact form with valid information
  Given I am on the Contact Us page
  When I fill the form with valid customer information
  And I submit the form
  Then I should see a success confirmation message

# ❌ KHÔNG TỐT - Quá kỹ thuật và khó hiểu
Scenario: Test contact form submission
  Given I navigate to "/contact_us"
  When I fill "#name" with "John"
  And I fill "#email" with "john@test.com"
  Then I verify ".success" contains "submitted"
```

### **2. Sử dụng Background hợp lý**

```gherkin
Feature: User Authentication

  Background:
    Given I am on the login page
    # Chỉ setup cần thiết cho TẤT CẢ scenarios

  Scenario: Valid login
    # Specific test steps...
    
  Scenario: Invalid login  
    # Specific test steps...
```

### **3. Data-driven testing**

```gherkin
# Sử dụng Scenario Outline cho test cases tương tự
Scenario Outline: Login with different credentials
  When I login with "<username>" and "<password>"
  Then I should see "<message>"
  
  Examples:
    | username | password | message        |
    | valid    | valid    | Welcome        |
    | invalid  | valid    | Invalid user   |
    | valid    | invalid  | Wrong password |
```

### **4. Step Definitions**

```javascript
// ✅ TỐT - Reusable và flexible
When('I fill the form with {string} and {string}', async function(name, email) {
  await this.contactPage.fillForm(name, email);
});

// ❌ KHÔNG TỐT - Quá specific
When('I fill the contact form with John Doe and john@example.com', async function() {
  await this.contactPage.fillForm('John Doe', 'john@example.com');
});
```

---

## 🐛 **TROUBLESHOOTING**

### **Lỗi thường gặp**

#### **1. "Step definition not found"**

```bash
# Lỗi: Given I am on the homepage

# Giải pháp: Kiểm tra step definition tồn tại
Given('I am on the homepage', async function() {
  // Implementation
});
```

#### **2. "Browser not launching"**

```javascript
// Kiểm tra world.js
async initializeBrowser() {
  try {
    this.browser = await chromium.launch({
      headless: this.config.headless
    });
    // ...
  } catch (error) {
    console.error('Browser launch failed:', error);
    throw error;
  }
}
```

#### **3. "Timeout errors"**

```javascript
// Tăng timeout trong world.js
this.page.setDefaultTimeout(120000); // 2 minutes

// Hoặc sử dụng @slow tag
Before({ tags: '@slow' }, async function() {
  this.page.setDefaultTimeout(120000);
});
```

#### **4. "Page Object methods not found"**

```javascript
// Kiểm tra world.js khởi tạo đúng page objects
async initializeBrowser() {
  // ...
  this.homePage = new HomePage(this.page);
  this.contactPage = new ContactPage(this.page);
}
```

### **Debug Tips**

```javascript
// 1. Thêm debug steps
When('I debug and pause', async function() {
  await this.page.pause(); // Playwright debugger
});

// 2. Take screenshot
When('I take a screenshot', async function() {
  await this.takeScreenshot('debug-screenshot');
});

// 3. Log thông tin
When('I log current page info', async function() {
  console.log('URL:', this.page.url());
  console.log('Title:', await this.page.title());
});
```

---

## 📝 **MIGRATION TỪ PLAYWRIGHT TESTS**

### **Từ Playwright Test sang Cucumber**

**Playwright Test:**
```javascript
test('Contact form submission', async ({ page }) => {
  await page.goto('https://example.com/contact');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('[type="submit"]');
  await expect(page.locator('.success')).toBeVisible();
});
```

**Cucumber Feature:**
```gherkin
Scenario: Submit contact form
  Given I navigate to "https://example.com/contact"
  When I type "test@example.com" into "email"
  And I click the Submit button
  Then I should see the success message
```

**Cucumber Steps:**
```javascript
Given('I navigate to {string}', async function(url) {
  await this.page.goto(url);
});

When('I type {string} into {string}', async function(text, field) {
  await this.page.fill(`[name="${field}"]`, text);
});
```

---

## 📈 **KẾT HỢP VỚI CI/CD**

### **GitHub Actions Example**

```yaml
name: Cucumber Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npm run test:install-browsers
        
      - name: Run Cucumber tests
        run: npm run test:cucumber
        
      - name: Upload reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cucumber-reports
          path: reports/
```

---

## 🎯 **ROADMAP PHÁT TRIỂN**

### **Phase 1: Basic Setup (✅ Completed)**
- ✅ Setup Cucumber với Playwright
- ✅ Tạo basic feature files
- ✅ Implement step definitions
- ✅ Configure reporting

### **Phase 2: Advanced Features (🚧 Đề xuất)**
- 🔄 API testing integration
- 🔄 Visual regression testing
- 🔄 Performance testing scenarios
- 🔄 Cross-browser parallel execution

### **Phase 3: CI/CD Integration (📋 Planned)**
- 📋 GitHub Actions workflow
- 📋 Slack/Teams notifications
- 📋 Test result dashboard
- 📋 Automatic report generation

---

## 📞 **HỖ TRỢ**

Nếu gặp vấn đề, hãy:

1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Xem logs trong console
3. Sử dụng debug features
4. Tham khảo [Cucumber Documentation](https://cucumber.io/docs)
5. Tham khảo [Playwright Documentation](https://playwright.dev)

---

**Happy Testing! 🎉**
