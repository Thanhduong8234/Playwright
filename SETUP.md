# 🚀 Quick Setup Guide

This guide will help you get the Playwright testing project up and running in minutes.

## 📋 Prerequisites

- **Node.js**: Version 16+ (recommended 18+)
- **npm**: Usually comes with Node.js
- **Git**: For cloning the repository

## 🔄 Clone and Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd playwright-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browsers
```bash
npx playwright install
```

## 🧪 Running Tests

### Basic test run
```bash
npm test
```

### Run with browser visible (recommended for debugging)
```bash
npm run test:headed
```

### Interactive UI mode (great for beginners)
```bash
npm run test:ui
```

### Run specific test categories
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

## 📊 View Results

### HTML Report
```bash
npx playwright show-report
```

### Trace files (if available)
```bash
npx playwright show-trace traces/
```

## 🛠️ Project Structure

```
playwright-project/
├── 📚 DOCUMENTATION
│   ├── README.md              # Main project overview
│   ├── README-POM.md          # Page Object Model guide
│   ├── QUICK_START.md         # Quick installation guide
│   └── SETUP.md               # This file
│
├── 🧪 TESTS
│   ├── example.pom.spec.js    # Start here - basic POM tests
│   ├── advanced-ecommerce.pom.spec.js
│   ├── file-operations.pom.spec.js
│   └── AutomationExercise/    # Real-world testing scenarios
│
├── 🏗️ PAGES
│   ├── BasePage.js            # Base class for all pages
│   ├── PlaywrightHomePage.js  # Playwright homepage
│   ├── TodoMVCPage.js         # TodoMVC application
│   └── AutomationExercise/    # Automation Exercise pages
│
├── 🧩 COMPONENTS
│   ├── LoginComponent.js      # Reusable login component
│   └── ShoppingCartComponent.js # Shopping cart component
│
└── 🛠️ UTILS
    ├── ApiHelpers.js          # API testing utilities
    ├── TestHelpers.js         # General test helpers
    ├── TestDataGenerator.js   # Test data generation
    └── TimestampReporter.js   # Custom reporting
```

## 🎯 Getting Started

### 1. **First Test Run**
```bash
npm run test:basic
```
This will run the basic POM test to verify everything is working.

### 2. **Explore with UI Mode**
```bash
npm run test:ui
```
Interactive mode where you can see tests running in real-time.

### 3. **Try Different Test Categories**
```bash
npm run test:pom:headed
```
Run all POM tests with browser visible.

## 🔧 Troubleshooting

### Common Issues

#### **"playwright: command not found"**
```bash
npm install
npx playwright install
```

#### **"Cannot find module" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### **Browser installation issues**
```bash
npx playwright install --force
```

#### **Permission errors (Linux/macOS)**
```bash
sudo npx playwright install
```

### Check Versions
```bash
node --version        # Should be 16+
npm --version         # Should be 8+
npx playwright --version
```

## 📚 Next Steps

1. **Read the documentation**:
   - [README.md](./README.md) - Project overview
   - [README-POM.md](./README-POM.md) - Page Object Model guide
   - [QUICK_START.md](./QUICK_START.md) - Quick start guide

2. **Explore the code**:
   - Start with `tests/example.pom.spec.js`
   - Look at `pages/BasePage.js` for common methods
   - Check `components/` for reusable components

3. **Run different test types**:
   - Basic tests: `npm run test:basic`
   - E-commerce tests: `npm run test:ecommerce`
   - File operations: `npm run test:files`

## 🤝 Need Help?

- Check the [Playwright documentation](https://playwright.dev/)
- Review the test files for examples
- Use the interactive UI mode: `npm run test:ui`

---

**Happy Testing! 🎭✨**
