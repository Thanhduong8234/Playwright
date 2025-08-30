# 🎭 Playwright Page Object Model (POM) Framework

Dự án Playwright đã được tổ chức lại theo mô hình **Page Object Model (POM)** để tăng tính tái sử dụng, bảo trì và mở rộng của code test.

## 📁 Cấu trúc thư mục mới

```
Playwright/
├── 📂 pages/                    # Page Object classes
│   ├── BasePage.js             # Base class chung cho tất cả pages
│   ├── PlaywrightHomePage.js   # Page object cho trang chủ Playwright
│   └── TodoMVCPage.js          # Page object cho TodoMVC demo
│
├── 📂 components/               # Component tái sử dụng
│   ├── LoginComponent.js       # Component đăng nhập
│   └── ShoppingCartComponent.js # Component giỏ hàng
│
├── 📂 utils/                    # Utility functions
│   ├── TestHelpers.js          # Helper functions cho testing
│   └── ApiHelpers.js           # Helper functions cho API testing
│
├── 📂 fixtures/                 # Test data và fixtures
│   ├── testData.js             # Centralized test data
│   └── playwright.fixtures.js   # Custom Playwright fixtures
│
├── 📂 data/                     # Configuration data
│   └── pageUrls.js             # Centralized URL management
│
├── 📂 tests/                    # Test files (refactored)
│   ├── example.pom.spec.js     # Basic tests với POM
│   ├── advanced-ecommerce.pom.spec.js # E-commerce tests với POM
│   └── file-operations.pom.spec.js    # File operations với POM
│
└── 📂 tests/ (original)         # Test files gốc (tham khảo)
    ├── example.spec.js
    ├── advanced-ecommerce.spec.js
    └── file-operations.spec.js
```

## 🎯 Lợi ích của Page Object Model

### 1. **Tái sử dụng code**
- Các page objects có thể được sử dụng trong nhiều test cases
- Components có thể được chia sẻ giữa các pages khác nhau

### 2. **Dễ bảo trì**
- Khi UI thay đổi, chỉ cần update page object, không cần sửa từng test
- Centralized selectors và methods

### 3. **Tách biệt concerns**
- Test logic tách biệt khỏi page interactions
- Business logic tách biệt khỏi technical implementation

### 4. **Cải thiện khả năng đọc code**
- Test cases dễ hiểu hơn với high-level methods
- Self-documenting code

## 🏗️ Kiến trúc POM

### **BasePage** - Lớp cơ sở
```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }
  
  // Common methods cho tất cả pages
  async goto(url) { /* ... */ }
  async clickElement(selector) { /* ... */ }
  async fillInput(selector, text) { /* ... */ }
}
```

### **Page Objects** - Các lớp page cụ thể
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

### **Components** - Các thành phần tái sử dụng
```javascript
class LoginComponent extends BasePage {
  // Reusable login functionality
  async login(email, password) { /* ... */ }
  async validateForm() { /* ... */ }
}
```

## 🛠️ Cách sử dụng

### 1. **Test cơ bản với Page Objects**
```javascript
const { test, expect } = require('../fixtures/playwright.fixtures');

test('Test với Page Object', async ({ playwrightHomePage }) => {
  await playwrightHomePage.navigate();
  await playwrightHomePage.clickGetStarted();
  
  const isVisible = await playwrightHomePage.isInstallationHeadingVisible();
  expect(isVisible).toBeTruthy();
});
```

### 2. **Test với Components**
```javascript
test('Test với Components', async ({ loginComponent, testData }) => {
  const user = testData.users.validUser;
  await loginComponent.login(user.email, user.password);
  
  const hasError = await loginComponent.hasErrorMessage();
  expect(hasError).toBeFalsy();
});
```

### 3. **Test với Fixtures và Helpers**
```javascript
test('Test với Fixtures', async ({ 
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

## 🔧 Utilities và Helpers

### **TestHelpers** - General utilities
- `generateRandomString()` - Tạo string ngẫu nhiên
- `generateFakeUser()` - Tạo user data fake
- `wait()` - Wait với timeout
- `retry()` - Retry logic
- `formatCurrency()` - Format tiền tệ

### **ApiHelpers** - API testing utilities
- `setupApiMocks()` - Setup API mocking
- `setupNetworkMonitoring()` - Monitor network requests
- `makeApiRequest()` - Make API calls
- `validateApiResponse()` - Validate API responses

## 🎮 Fixtures Nâng cao

### **Custom Fixtures**
```javascript
// Auto-setup và cleanup
test('Test với custom fixtures', async ({
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
  
  // Test trên multiple browsers đồng thời
  await Promise.all([
    chrome.goto('/page'),
    firefox.goto('/page'),
    safari.goto('/page')
  ]);
});
```

## 🚀 Chạy Tests

### **Chạy tests POM mới**
```bash
# Chạy tất cả POM tests
npm test -- tests/*.pom.spec.js

# Chạy specific POM test
npm test -- tests/example.pom.spec.js

# Chạy với headed mode để xem browser
npm test -- tests/example.pom.spec.js --headed
```

### **Chạy tests gốc (so sánh)**
```bash
# Chạy tests gốc để so sánh
npm test -- tests/example.spec.js
```

## 📈 Performance Monitoring

Framework tích hợp sẵn performance monitoring:

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

## 🔍 Debugging và Screenshots

### **Auto Screenshots**
```javascript
test('Test với auto screenshots', async ({ screenshot }) => {
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
- Mỗi page một class riêng biệt
- Methods return meaningful values (boolean, data objects)
- Use meaningful method names (`isElementVisible()` thay vì `checkElement()`)

### 2. **Selector Management**
- Centralize selectors trong constructor
- Use data-testid attributes khi có thể
- Avoid brittle selectors (class names, complex CSS)

### 3. **Error Handling**
- Graceful error handling trong page objects
- Meaningful error messages
- Use retry mechanisms cho unstable elements

### 4. **Test Organization**
- Group related tests trong describe blocks
- Use descriptive test names
- Keep tests independent và isolated

## 🔮 Tương lai

Framework này có thể được mở rộng với:

- **Visual Testing**: Screenshot comparison
- **API Testing**: Comprehensive API test suite
- **Load Testing**: Performance và load testing
- **CI/CD Integration**: Automated testing pipeline
- **Reporting**: Custom test reports
- **Parallel Execution**: Multi-worker test execution

## 📚 Tài liệu tham khảo

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

Framework này cung cấp foundation mạnh mẽ cho việc testing với Playwright, đảm bảo code dễ bảo trì, mở rộng và tái sử dụng! 🎭✨
