# 🎭 Playwright Testing Project

## 📖 Introduction

This project is a comprehensive guide and demo for **Playwright** - a modern testing framework for web applications. It's specifically designed for developers with **Java/Selenium** experience who want to transition to **JavaScript/Playwright**.



## 🎯 Project Content

### 📚 Installation Guides
- **[QUICK_START.md](./QUICK_START.md)** - Quick installation in 5 minutes ⚡
- **[SETUP.md](./SETUP.md)** - Complete setup guide for new developers 🚀
- **[README-POM.md](./README-POM.md)** - Detailed Page Object Model guide 🏗️

### 🧪 Test Examples (By increasing difficulty)

#### 1. **Basic Level** 🌟
- `tests/example.spec.js` - Basic tests with navigation and assertions
- `tests/example.pom.spec.js` - Basic tests using Page Object Model

#### 2. **Intermediate Level** 🌟🌟🌟
- `tests/debug-example.spec.js` - Debug techniques and console logging
- `tests/debug-navigation.spec.js` - Debug navigation and element interaction
- `tests/trace-debug.spec.js` - Trace recording for debugging

#### 3. **Advanced Level** 🌟🌟🌟🌟
- `tests/advanced-ecommerce.spec.js` - Complex e-commerce testing
- `tests/advanced-ecommerce.pom.spec.js` - E-commerce testing with POM pattern
- `tests/file-operations.spec.js` - File upload/download and API integration
- `tests/file-operations.pom.spec.js` - File operations with POM pattern

#### 4. **Automation Exercise** 🌟🌟🌟🌟🌟
- `tests/AutomationExercise/Exercise-001.pom.spec.js` - Automation Exercise with POM
- `tests/AutomationExercise/Excercise-002.pom.spec.js` - Advanced Automation Exercise

## 🚀 Quick Start

### Installation in 5 minutes:
```bash
# 1. Create project
mkdir playwright-project && cd playwright-project

# 2. Install Playwright
npm init playwright@latest

# 3. Run tests
npm test

# 4. View results
npx playwright show-report
```

### Run with browser visible:
```bash
npm test -- --headed
```

### UI Mode (Recommended for beginners):
```bash
npm test -- --ui
```

### Run tests by category:
```bash
# Run all POM tests
npm run test:pom

# Run basic tests
npm run test:basic

# Run e-commerce tests
npm run test:ecommerce

# Run file operation tests
npm run test:files
```

## 📁 Project Structure

```
playwright-project/
├── 📚 DOCUMENTATION
│   ├── README.md                           # This file
│   ├── README-POM.md                       # POM Framework guide
│   └── QUICK_START.md                      # Quick installation
│
├── 🧪 TESTS
│   ├── example.spec.js                     # Basic tests
│   ├── example.pom.spec.js                 # Basic tests with POM
│   ├── debug-example.spec.js               # Debug techniques  
│   ├── debug-navigation.spec.js            # Debug navigation
│   ├── trace-debug.spec.js                 # Trace recording
│   ├── advanced-ecommerce.spec.js          # Complex e-commerce tests
│   ├── advanced-ecommerce.pom.spec.js      # E-commerce tests with POM
│   ├── file-operations.spec.js             # File & API operations
│   ├── file-operations.pom.spec.js         # File operations with POM
│   └── AutomationExercise/                 # Automation Exercise tests
│       ├── Exercise-001.pom.spec.js        # Exercise 001 with POM
│       └── Excercise-002.pom.spec.js       # Exercise 002 with POM
│
├── 🏗️ PAGES (Page Object Model)
│   ├── BasePage.js                         # Base page class
│   ├── PlaywrightHomePage.js               # Playwright homepage
│   ├── TodoMVCPage.js                      # TodoMVC application
│   └── AutomationExercise/                 # Automation Exercise pages
│       ├── HomePage.js                     # Home page
│       └── ContactPage.js                  # Contact page
│
├── 🧩 COMPONENTS
│   ├── LoginComponent.js                   # Login component
│   └── ShoppingCartComponent.js            # Shopping cart component
│
├── 🛠️ UTILS
│   ├── ApiHelpers.js                       # API testing helpers
│   ├── TestDataGenerator.js                # Test data generation
│   ├── TestHelpers.js                      # General test helpers
│   └── TimestampReporter.js                # Custom timestamp reporter
│
├── 📊 DATA & FIXTURES
│   ├── data/pageUrls.js                    # Page URLs configuration
│   ├── fixtures/testData.js                # Test data fixtures
│   └── fixtures/playwright.fixtures.js     # Playwright fixtures
│
├── ⚙️ CONFIGURATION
│   ├── playwright.config.js                # Main config
│   └── package.json                        # Dependencies & scripts
│
├── 📊 RESULTS & REPORTS
│   ├── playwright-report/                  # HTML reports with timestamp
│   ├── test-results/                       # Test artifacts
│   ├── traces/                             # Trace files
│   ├── screenshots/                        # Auto screenshots
│   └── debug-screenshots/                  # Debug screenshots
│
└── 📁 ASSETS
    ├── downloads/                          # Downloaded files
    └── test-files/                         # Test files and images
```

## 🎮 Main Commands

```bash
# Testing Commands
npm test                    # Run all tests
npm run test:headed        # Show browser
npm run test:ui            # UI mode (interactive)
npm run test:debug         # Debug mode with breakpoints

# POM Testing Commands
npm run test:pom           # Run all POM tests
npm run test:pom:headed    # POM tests with browser visible
npm run test:pom:ui        # POM tests with UI mode

# Specific Test Categories
npm run test:basic         # Run basic tests
npm run test:ecommerce     # Run e-commerce tests
npm run test:files         # Run file operation tests

# Reporting Commands  
npm run test:report        # Open HTML report
npx playwright show-trace  # View trace files

# Development Commands
npx playwright install     # Install/update browsers
npx playwright --version   # Check version
```

## 🏆 Features Demonstrated

### 🛒 E-commerce Testing Suite
- ✅ **Product Search** with complex filters
- ✅ **Shopping Cart** operations 
- ✅ **Checkout Process** with form validation
- ✅ **User Authentication** with multiple scenarios
- ✅ **Data Analysis** real-time with JavaScript
- ✅ **Parallel Operations** on multiple tabs
- ✅ **Responsive Testing** (Mobile/Tablet/Desktop)
- ✅ **API Mocking** for realistic testing

### 📂 File & API Integration
- ✅ **File Upload** with progress tracking
- ✅ **File Download** with verification
- ✅ **RESTful API Testing** with real endpoints
- ✅ **Performance Monitoring** (memory, load time)
- ✅ **Network Request** monitoring
- ✅ **Advanced Mocking** multiple endpoints

### 🏗️ Page Object Model (POM) Implementation
- ✅ **BasePage Class** with common methods
- ✅ **Component-based Architecture** (Login, ShoppingCart)
- ✅ **Reusable Page Objects** for multiple test scenarios
- ✅ **Data-driven Testing** with fixtures
- ✅ **Custom Test Helpers** and utilities

### 🔍 Debug & Development Tools
- ✅ **Console.log debugging** with detailed logging
- ✅ **Trace Recording** to replay test execution
- ✅ **Element Properties** inspection
- ✅ **Browser JavaScript** evaluation
- ✅ **Screenshots** automatically on test failure
- ✅ **Performance Metrics** collection
- ✅ **Custom Timestamp Reporter** with organized reports

### 🎯 Automation Exercise Integration
- ✅ **Real-world Testing Scenarios** from AutomationExercise.com
- ✅ **Contact Form Testing** with validation
- ✅ **Navigation Testing** between pages
- ✅ **Element Interaction** with various UI components

## 📊 Achievements

- **🧪 10+ test files** with complexity from basic to expert
- **🏗️ POM Pattern** implementation for maintainable tests
- **🧩 Component-based Architecture** for reusable elements
- **🌐 Cross-browser testing** on Chrome, Firefox, Safari
- **📱 Responsive testing** with multiple viewports
- **📈 Performance metrics** with memory usage and load times
- **🎬 Trace files** for detailed debugging
- **📋 HTML reports** with timestamp organization
- **🛠️ Custom utilities** for API testing and data generation

## 🎯 Comparison with Java/Selenium

| Feature | Java/Selenium | JavaScript/Playwright | This Project |
|---------|---------------|----------------------|--------------|
| **Setup Complexity** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Speed** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **API Testing** | Requires RestAssured | Built-in request context | ✅ Custom ApiHelpers |
| **File Operations** | Complex | Simplified APIs | ✅ POM implementation |
| **Multi-browser** | Manual setup | Auto configuration | ✅ Config ready |
| **Debug Tools** | IDE dependent | Rich built-in tools | ✅ Trace + Screenshots |
| **Parallel Testing** | TestNG/JUnit | Built-in parallel execution | ✅ Enabled |
| **Performance Testing** | JMeter integration | Built-in metrics | ✅ Custom metrics |
| **POM Pattern** | Manual implementation | Flexible structure | ✅ Full POM support |
| **Component Testing** | Limited | Flexible | ✅ Component classes |

## 🛠️ Advanced Techniques Used

> **💡 Note**: All code examples and comments in this project use **English** to ensure international accessibility and ease of understanding.

### 🏗️ Page Object Model
```javascript
// BasePage.js - Common functionality
class BasePage {
  constructor(page) {
    this.page = page;
  }
  
  async waitForElement(selector, timeout = 5000) {
    return await this.page.waitForSelector(selector, { timeout });
  }
}
```

### 🧩 Component-based Architecture
```javascript
// LoginComponent.js - Reusable component
class LoginComponent {
  constructor(page) {
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }
  
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### 🎭 API Mocking & Stubbing
```javascript
// ApiHelpers.js - API testing utilities
await page.route('**/api/**', async route => {
  // Dynamic mock responses based on request
});
```

### 🔄 Parallel Execution  
```javascript
await Promise.all([
  page1.operation(),
  page2.operation(), 
  page3.operation()
]);
```

### 📱 Multi-Viewport Testing
```javascript
for (const viewport of [mobile, tablet, desktop]) {
  await page.setViewportSize(viewport);
  // Test responsive behavior
}
```

### ⚡ Performance Monitoring
```javascript
const metrics = await page.evaluate(() => ({
  memory: performance.memory,
  navigation: performance.getEntriesByType('navigation')[0]
}));
```

### 📊 Custom Reporting
```javascript
// TimestampReporter.js - Organized test reports
class TimestampReporter {
  onEnd(result) {
    // Generate timestamped reports
  }
}
```

## 🎓 Who is this for?

### ✅ Suitable for:
- **Java developers** wanting to learn JavaScript testing
- **QA Engineers** wanting to upgrade from Selenium
- **Frontend developers** needing E2E testing
- **DevOps engineers** needing CI/CD integration
- **Anyone** wanting to learn modern web testing with POM pattern

### 📈 Skill Level:
- **Beginner**: Start with `QUICK_START.md` and `tests/example.spec.js`
- **Intermediate**: Run `tests/example.pom.spec.js` and `debug-example.spec.js`  
- **Advanced**: Study `tests/advanced-ecommerce.pom.spec.js`
- **Expert**: Read entire POM implementation and custom utilities

## 🔧 Requirements

- **Node.js**: v16+ (recommended v18+)
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 4GB+ (recommended 8GB+)
- **Storage**: 2GB+ for browsers

## 🐛 Troubleshooting

Having issues? Check:

1. **[QUICK_START.md](./QUICK_START.md)** - Troubleshooting section
2. **Version compatibility**: `node --version` and `npx playwright --version`
3. **Browser installation**: `npx playwright install`
4. **Permissions**: Especially on Linux/macOS
5. **POM setup**: Check import paths in test files

## 📚 References

- **Playwright Official**: https://playwright.dev/
- **API Documentation**: https://playwright.dev/docs/api/class-playwright
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Page Object Model**: https://playwright.dev/docs/pom
- **GitHub Repository**: https://github.com/microsoft/playwright

## 🤝 Contributing

This project serves educational purposes. If you have ideas for improvement:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Submit pull request

## 📄 License

ISC License - Free to use for educational and development purposes.

---

## 🎉 Get Started Now!

1. **📖 Read**: [QUICK_START.md](./QUICK_START.md) for installation in 5 minutes
2. **🏗️ POM**: [README-POM.md](./README-POM.md) to understand Page Object Model
3. **🚀 Run**: `npm test` to see the magic
4. **🎮 Explore**: `npm run test:ui` for interactive mode
5. **📊 Analyze**: `npx playwright show-report` to view beautiful results

**Happy Testing! 🎭✨**
