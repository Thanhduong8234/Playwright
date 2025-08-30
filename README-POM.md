# 🎭 Playwright Page Object Model (POM) Framework

The Playwright project has been reorganized using the **Page Object Model (POM)** pattern to increase code reusability, maintainability, and extensibility.

**🌍 Language**: All code and comments in this project use **English** to ensure international accessibility and ease of understanding for all developers.

## 📁 New Directory Structure

```
Playwright/
├── 📂 pages/                    # Page Object classes
│   ├── BasePage.js             # Base class for all pages
│   ├── PlaywrightHomePage.js   # Page object for Playwright homepage
│   ├── TodoMVCPage.js          # Page object for TodoMVC demo
│   └── AutomationExercise/     # Automation Exercise pages
│       ├── HomePage.js         # Home page
│       └── ContactPage.js      # Contact page
│
├── 📂 components/               # Reusable components
│   ├── LoginComponent.js       # Login component
│   └── ShoppingCartComponent.js # Shopping cart component
│
├── 📂 utils/                    # Utility functions
│   ├── TestHelpers.js          # Helper functions for testing
│   ├── ApiHelpers.js           # Helper functions for API testing
│   ├── TestDataGenerator.js    # Test data generation utilities
│   └── TimestampReporter.js    # Custom timestamp reporter
│
├── 📂 fixtures/                 # Test data and fixtures
│   ├── testData.js             # Centralized test data
│   └── playwright.fixtures.js   # Custom Playwright fixtures
│
├── 📂 data/                     # Configuration data
│   └── pageUrls.js             # Centralized URL management
│
├── 📂 tests/                    # Test files (refactored)
│   ├── example.pom.spec.js     # Basic tests with POM
│   ├── advanced-ecommerce.pom.spec.js # E-commerce tests with POM
│   ├── file-operations.pom.spec.js    # File operations with POM
│   └── AutomationExercise/     # Automation Exercise tests
│       ├── Exercise-001.pom.spec.js   # Exercise 001 with POM
│       └── Excercise-002.pom.spec.js  # Exercise 002 with POM
│
└── 📂 tests/ (original)         # Original test files (reference)
    ├── example.spec.js
    ├── advanced-ecommerce.spec.js
    └── file-operations.spec.js
```

## 🎯 Benefits of Page Object Model

### 1. **Code Reusability**
- Page objects can be used across multiple test cases
- Components can be shared between different pages

### 2. **Easy Maintenance**
- When UI changes, only need to update page objects, not individual tests
- Centralized selectors and methods

### 3. **Separation of Concerns**
- Test logic separated from page interactions
- Business logic separated from technical implementation

### 4. **Improved Code Readability**
- Test cases are easier to understand with high-level methods
- Self-documenting code

## 🏗️ POM Architecture

### **BasePage** - Base Class
```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }
  
  // Common methods for all pages
  async goto(url) { /* ... */ }
  async clickElement(selector) { /* ... */ }
  async fillInput(selector, text) { /* ... */ }
}
```

### **Page Objects** - Specific Page Classes
```javascript
class PlaywrightHomePage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      getStartedButton: 'text=Get started',
      // ... other selectors
    };
  }
  
  // Page-specific methods
  async clickGetStarted() { /* ... */ }
  async isGetStartedVisible() { /* ... */ }
}
```

### **Components** - Reusable Components
```javascript
class LoginComponent extends BasePage {
  // Reusable login functionality
  async login(email, password) { /* ... */ }
  async validateForm() { /* ... */ }
}
```

## 🛠️ How to Use

### 1. **Basic Test with Page Objects**
```javascript
const { test, expect } = require('../fixtures/playwright.fixtures');

test('Test with Page Object', async ({ playwrightHomePage }) => {
  await playwrightHomePage.navigate();
  await playwrightHomePage.clickGetStarted();
  
  const isVisible = await playwrightHomePage.isInstallationHeadingVisible();
  expect(isVisible).toBeTruthy();
});
```

### 2. **Test with Components**
```javascript
test('Test with Components', async ({ loginComponent, testData }) => {
  const user = testData.users.validUser;
  await loginComponent.login(user.email, user.password);
  
  const hasError = await loginComponent.hasErrorMessage();
  expect(hasError).toBeFalsy();
});
```

### 3. **Test with Fixtures and Helpers**
```javascript
test('Test with Fixtures', async ({ 
  todoMVCPage, 
  testHelpers, 
  performanceMonitor,
  screenshot 
}) => {
  await todoMVCPage.navigate();
  await todoMVCPage.addTodo('Test todo');
  
  await screenshot.take('after-adding-todo');
  testHelpers.log('Todo added successfully');
});
```

## 📊 Test Data Management

### **Centralized Test Data**
```javascript
// fixtures/testData.js
class TestData {
  static users = {
    validUser: {
      email: 'user@example.com',
      password: 'Password123!',
      name: 'Test User'
    }
  };
  
  static products = {
    electronics: [
      { name: 'iPhone 15', price: 1000 },
      { name: 'Samsung S24', price: 800 }
    ]
  };
}
```

### **Dynamic Data Generation**
```javascript
// Generate random test data
const randomUser = testData.generateData('user');
const randomProduct = testData.generateData('product');
```

## 🔧 Utilities and Helpers

### **TestHelpers** - General utilities
- `generateRandomString()` - Generate random string
- `generateFakeUser()` - Generate fake user data
- `wait()` - Wait with timeout
- `retry()` - Retry logic
- `formatCurrency()` - Format currency

### **ApiHelpers** - API testing utilities
- `setupApiMocks()` - Setup API mocking
- `setupNetworkMonitoring()` - Monitor network requests
- `makeApiRequest()` - Make API calls
- `validateApiResponse()` - Validate API responses

### **TestDataGenerator** - Test data utilities
- `generateUniqueName()` - Generate unique name
- `generateUniqueEmail()` - Generate unique email
- `generateUniqueSubject()` - Generate unique subject
- `generateUniqueMessage()` - Generate unique message

### **TimestampReporter** - Custom reporting
- `generateTimestamp()` - Generate timestamp for reports
- `generateDateFolder()` - Generate date-based folders
- `ensureOutputDir()` - Ensure output directory exists

## 🎮 Advanced Fixtures

### **Custom Fixtures**
```javascript
// Auto-setup and cleanup
test('Test with custom fixtures', async ({
  authenticatedUser,     // Auto login
  cartWithItems,        // Pre-loaded cart
  performanceMonitor,   // Performance tracking
  screenshot,           // Auto screenshots
  database             // Mock database
}) => {
  // Test logic here
});
```

### **Multi-browser Testing**
```javascript
test('Cross-browser test', async ({ multiBrowser }) => {
  const { chrome, firefox, safari } = multiBrowser;
  
  // Test on multiple browsers simultaneously
  await Promise.all([
    chrome.goto('/page'),
    firefox.goto('/page'),
    safari.goto('/page')
  ]);
});
```

## 🚀 Running Tests

### **Run new POM tests**
```bash
# Run all POM tests
npm run test:pom

# Run specific POM test
npm test -- tests/example.pom.spec.js

# Run with headed mode to see browser
npm test -- tests/example.pom.spec.js --headed
```

### **Run original tests (for comparison)**
```bash
# Run original tests for comparison
npm test -- tests/example.spec.js
```

## 📈 Performance Monitoring

Framework includes built-in performance monitoring:

```javascript
test('Performance test', async ({ performanceMonitor }) => {
  const start = Date.now();
  // ... test operations
  performanceMonitor.recordMetric('operation-time', Date.now() - start);
  
  // Get comprehensive performance report
  const summary = performanceMonitor.getSummary();
  console.log('Performance Summary:', summary);
});
```

## 🔍 Debugging and Screenshots

### **Auto Screenshots**
```javascript
test('Test with auto screenshots', async ({ screenshot }) => {
  await screenshot.take('initial-state');
  // ... test operations
  await screenshot.take('after-operation');
  
  // Auto screenshot on failure
});
```

### **Network Monitoring**
```javascript
test('Network monitoring', async ({ apiHelpers }) => {
  const { networkMonitor } = apiHelpers;
  
  // Test operations...
  
  // Get network statistics
  const stats = networkMonitor.getStatistics();
  console.log('Network Stats:', stats);
});
```

## 🎯 Best Practices

### 1. **Page Object Design**
- One class per page
- Methods return meaningful values (boolean, data objects)
- Use meaningful method names (`isElementVisible()` instead of `checkElement()`)

### 2. **Selector Management**
- Centralize selectors in constructor
- Use data-testid attributes when possible
- Avoid brittle selectors (class names, complex CSS)

### 3. **Error Handling**
- Graceful error handling in page objects
- Meaningful error messages
- Use retry mechanisms for unstable elements

### 4. **Test Organization**
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent and isolated

## 🔮 Future Enhancements

This framework can be extended with:

- **Visual Testing**: Screenshot comparison
- **API Testing**: Comprehensive API test suite
- **Load Testing**: Performance and load testing
- **CI/CD Integration**: Automated testing pipeline
- **Reporting**: Custom test reports
- **Parallel Execution**: Multi-worker test execution

## 📚 References

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

This framework provides a strong foundation for testing with Playwright, ensuring maintainable, extensible, and reusable code! 🎭✨
