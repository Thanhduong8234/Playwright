# 🎭 Playwright Testing Project

## 📖 Giới thiệu

Dự án này là một bộ hướng dẫn và demo toàn diện về **Playwright** - framework testing hiện đại cho web applications. Được thiết kế đặc biệt cho những developer có kinh nghiệm **Java/Selenium** muốn chuyển sang **JavaScript/Playwright**.

## 🎯 Nội dung dự án

### 📚 Hướng dẫn cài đặt
- **[QUICK_START.md](./QUICK_START.md)** - Cài đặt nhanh trong 5 phút ⚡
- **[PLAYWRIGHT_INSTALLATION_GUIDE.md](./PLAYWRIGHT_INSTALLATION_GUIDE.md)** - Hướng dẫn chi tiết từ A-Z 📋

### 🧪 Test Examples (Theo độ khó tăng dần)

#### 1. **Basic Level** 🌟
- `tests/example.spec.js` - Test cơ bản với navigation và assertions

#### 2. **Intermediate Level** 🌟🌟🌟
- `tests/debug-example.spec.js` - Debug techniques và console logging
- `tests/trace-debug.spec.js` - Trace recording cho debugging

#### 3. **Advanced Level** 🌟🌟🌟🌟
- `tests/advanced-ecommerce.spec.js` - E-commerce testing phức tạp
- `tests/file-operations.spec.js` - File upload/download và API integration

#### 4. **Expert Level** 🌟🌟🌟🌟🌟
- **[ADVANCED_TESTING_GUIDE.md](./ADVANCED_TESTING_GUIDE.md)** - Comprehensive guide với 45+ tests

## 🚀 Quick Start

### Cài đặt trong 5 phút:
```bash
# 1. Tạo dự án
mkdir playwright-project && cd playwright-project

# 2. Cài đặt Playwright
npm init playwright@latest

# 3. Chạy test
npm test

# 4. Xem kết quả
npx playwright show-report
```

### Chạy với browser hiển thị:
```bash
npm test -- --headed
```

### UI Mode (Khuyến nghị cho người mới):
```bash
npm test -- --ui
```

## 📁 Cấu trúc dự án

```
playwright-project/
├── 📚 DOCUMENTATION
│   ├── README.md                           # File này
│   ├── QUICK_START.md                      # Cài đặt nhanh
│   ├── PLAYWRIGHT_INSTALLATION_GUIDE.md   # Hướng dẫn chi tiết
│   └── ADVANCED_TESTING_GUIDE.md          # Advanced techniques
│
├── 🧪 TESTS
│   ├── example.spec.js                     # Basic tests
│   ├── debug-example.spec.js               # Debug techniques  
│   ├── trace-debug.spec.js                 # Trace recording
│   ├── advanced-ecommerce.spec.js          # Complex e-commerce tests
│   └── file-operations.spec.js             # File & API operations
│
├── ⚙️ CONFIGURATION
│   ├── playwright.config.js                # Main config
│   ├── package.json                        # Dependencies & scripts
│   └── .vscode/launch.json                 # VS Code debug config
│
├── 📊 RESULTS & REPORTS
│   ├── playwright-report/                  # HTML reports
│   ├── test-results/                       # Test artifacts
│   ├── traces/                             # Trace files
│   └── screenshots/                        # Auto screenshots
│
└── 📁 ASSETS
    └── downloads/                          # Downloaded files
```

## 🎮 Commands chính

```bash
# Testing Commands
npm test                    # Chạy tất cả tests
npm run test:headed        # Hiển thị browser
npm run test:ui            # UI mode (interactive)
npm run test:debug         # Debug mode với breakpoints

# Reporting Commands  
npm run test:report        # Mở HTML report
npx playwright show-trace  # Xem trace files

# Development Commands
npx playwright install     # Cài đặt/cập nhật browsers
npx playwright --version   # Kiểm tra version
```

## 🏆 Tính năng đã demo

### 🛒 E-commerce Testing Suite (30 tests)
- ✅ **Product Search** với filters phức tạp
- ✅ **Shopping Cart** operations 
- ✅ **Checkout Process** với form validation
- ✅ **User Authentication** với multiple scenarios
- ✅ **Data Analysis** real-time với JavaScript
- ✅ **Parallel Operations** trên multiple tabs
- ✅ **Responsive Testing** (Mobile/Tablet/Desktop)
- ✅ **API Mocking** cho realistic testing

### 📂 File & API Integration (15 tests)
- ✅ **File Upload** với progress tracking
- ✅ **File Download** với verification
- ✅ **RESTful API Testing** với real endpoints
- ✅ **Performance Monitoring** (memory, load time)
- ✅ **Network Request** monitoring
- ✅ **Advanced Mocking** multiple endpoints

### 🔍 Debug & Development Tools
- ✅ **Console.log debugging** với detailed logging
- ✅ **Trace Recording** để replay test execution
- ✅ **Element Properties** inspection
- ✅ **Browser JavaScript** evaluation
- ✅ **Screenshots** tự động khi test fail
- ✅ **Performance Metrics** collection

## 📊 Kết quả đạt được

- **🧪 45+ tests** với độ phức tạp từ basic đến expert
- **🌐 Cross-browser testing** trên Chrome, Firefox, Safari
- **📱 Responsive testing** trên 3 viewports × 3 browsers = 9 screenshots
- **📈 Performance metrics** với memory usage và load times
- **🎬 Trace files** để debug chi tiết
- **📋 HTML reports** với visualization đẹp mắt

## 🎯 So sánh với Java/Selenium

| Tính năng | Java/Selenium | JavaScript/Playwright |
|-----------|---------------|----------------------|
| **Setup Complexity** | ⭐⭐⭐⭐ | ⭐⭐ |
| **Speed** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **API Testing** | Cần RestAssured | Built-in request context |
| **File Operations** | Phức tạp | Simplified APIs |
| **Multi-browser** | Manual setup | Auto configuration |
| **Debug Tools** | IDE dependent | Rich built-in tools |
| **Parallel Testing** | TestNG/JUnit | Built-in parallel execution |
| **Performance Testing** | JMeter integration | Built-in metrics |

## 🛠️ Kỹ thuật nâng cao đã sử dụng

### 🎭 API Mocking & Stubbing
```javascript
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

## 🎓 Dành cho ai?

### ✅ Phù hợp với:
- **Java developers** muốn học JavaScript testing
- **QA Engineers** muốn upgrade từ Selenium
- **Frontend developers** cần E2E testing
- **DevOps engineers** cần CI/CD integration
- **Anyone** muốn học modern web testing

### 📈 Skill Level:
- **Beginner**: Bắt đầu với `QUICK_START.md`
- **Intermediate**: Chạy `tests/example.spec.js` và `debug-example.spec.js`  
- **Advanced**: Nghiên cứu `tests/advanced-ecommerce.spec.js`
- **Expert**: Đọc toàn bộ `ADVANCED_TESTING_GUIDE.md`

## 🔧 Requirements

- **Node.js**: v16+ (khuyến nghị v18+)
- **OS**: Windows 10+, macOS 10.15+, hoặc Ubuntu 18.04+
- **RAM**: 4GB+ (khuyến nghị 8GB+)
- **Storage**: 2GB+ cho browsers

## 🐛 Troubleshooting

Gặp vấn đề? Kiểm tra:

1. **[PLAYWRIGHT_INSTALLATION_GUIDE.md](./PLAYWRIGHT_INSTALLATION_GUIDE.md)** - Section Troubleshooting
2. **Version compatibility**: `node --version` và `npx playwright --version`
3. **Browser installation**: `npx playwright install`
4. **Permissions**: Đặc biệt trên Linux/macOS

## 📚 Tài liệu tham khảo

- **Playwright Official**: https://playwright.dev/
- **API Documentation**: https://playwright.dev/docs/api/class-playwright
- **Best Practices**: https://playwright.dev/docs/best-practices
- **GitHub Repository**: https://github.com/microsoft/playwright

## 🤝 Contributing

Dự án này phục vụ mục đích học tập. Nếu bạn có ý tưởng cải thiện:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Submit pull request

## 📄 License

MIT License - Sử dụng tự do cho mục đích học tập và phát triển.

---

## 🎉 Bắt đầu ngay!

1. **📖 Đọc**: [QUICK_START.md](./QUICK_START.md) để cài đặt trong 5 phút
2. **🚀 Chạy**: `npm test` để xem magic
3. **🎮 Explore**: `npm run test:ui` để interactive mode
4. **📊 Analyze**: `npx playwright show-report` để xem kết quả đẹp mắt

**Happy Testing! 🎭✨**
