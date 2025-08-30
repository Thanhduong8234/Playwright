# ⚡ Playwright Quick Start - Cài đặt trong 5 phút

## 🎯 Cài đặt nhanh (Copy & Paste)

### 1️⃣ Kiểm tra Node.js
```bash
node --version  # Cần v16+
npm --version
```

### 2️⃣ Tạo dự án mới
```bash
mkdir my-playwright-tests
cd my-playwright-tests
```

### 3️⃣ Cài đặt Playwright (Auto setup)
```bash
npm init playwright@latest
```

**Hoặc cài đặt thủ công:**
```bash
npm init -y
npm install --save-dev @playwright/test
npx playwright install
```

### 4️⃣ Chạy test đầu tiên
```bash
npm test
```

### 5️⃣ Xem kết quả
```bash
npx playwright show-report
```

---

## 🎮 Commands cơ bản

```bash
npm test                    # Chạy tất cả tests
npm test -- --headed       # Hiển thị browser
npm test -- --ui           # UI mode (khuyến nghị)
npm test -- --debug        # Debug mode
npx playwright show-report # Xem HTML report
```

---

## 📁 Cấu trúc dự án sau khi cài đặt

```
my-playwright-tests/
├── tests/
│   └── example.spec.js     # Test mẫu
├── playwright.config.js    # Cấu hình
├── package.json
└── package-lock.json
```

---

## 🚀 Test đầu tiên

Tạo file `tests/my-first-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('Google search test', async ({ page }) => {
  await page.goto('https://www.google.com');
  await expect(page).toHaveTitle(/Google/);
  
  const searchBox = page.locator('[name="q"]');
  await searchBox.fill('Playwright');
  await searchBox.press('Enter');
  
  await page.waitForSelector('#search');
  console.log('✅ Test passed!');
});
```

Chạy test:
```bash
npx playwright test tests/my-first-test.spec.js --headed
```

---

## 🛠️ Cấu hình nhanh

Sửa `playwright.config.js` để hiển thị browser:

```javascript
use: {
  headless: false,  // Thay đổi từ true thành false
  // ...other configs
},
```

---

## 🎯 Bước tiếp theo

1. **Đọc hướng dẫn chi tiết**: [PLAYWRIGHT_INSTALLATION_GUIDE.md](./PLAYWRIGHT_INSTALLATION_GUIDE.md)
2. **Xem examples nâng cao**: [ADVANCED_TESTING_GUIDE.md](./ADVANCED_TESTING_GUIDE.md)
3. **Official docs**: https://playwright.dev/docs/intro

---

## ❌ Lỗi thường gặp

**"playwright: command not found"**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**"Browser not found"**
```bash
npx playwright install --force
```

**Tests chạy quá chậm**
```bash
# Trong playwright.config.js
workers: 1,
headless: true,
```

---

**🎉 Done! Playwright đã sẵn sàng sử dụng!**
