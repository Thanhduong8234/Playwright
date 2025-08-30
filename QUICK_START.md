# ⚡ Playwright Quick Start - Installation in 5 minutes

## 🎯 Quick Installation (Copy & Paste)

### 1️⃣ Check Node.js
```bash
node --version  # Need v16+
npm --version
```

### 2️⃣ Create new project
```bash
mkdir my-playwright-tests
cd my-playwright-tests
```

### 3️⃣ Install Playwright (Auto setup)
```bash
npm init playwright@latest
```

**Or install manually:**
```bash
npm init -y
npm install --save-dev @playwright/test
npx playwright install
```

### 4️⃣ Run first test
```bash
npm test
```

### 5️⃣ View results
```bash
npx playwright show-report
```

---

## 🎮 Basic Commands

```bash
npm test                    # Run all tests
npm test -- --headed       # Show browser
npm test -- --ui           # UI mode (recommended)
npm test -- --debug        # Debug mode
npx playwright show-report # View HTML report
```

---

## 📁 Project structure after installation

```
my-playwright-tests/
├── tests/
│   └── example.spec.js     # Sample test
├── playwright.config.js    # Configuration
├── package.json
└── package-lock.json
```

---

## 🚀 First Test

Create file `tests/my-first-test.spec.js`:

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

Run test:
```bash
npx playwright test tests/my-first-test.spec.js --headed
```

---

## 🛠️ Quick Configuration

Edit `playwright.config.js` to show browser:

```javascript
use: {
  headless: false,  // Change from true to false
  // ...other configs
},
```

---

## 🎯 Next Steps

1. **Read detailed guide**: [SETUP.md](./SETUP.md)
2. **View advanced examples**: [README-POM.md](./README-POM.md)
3. **Official docs**: https://playwright.dev/docs/intro

---

## ❌ Common Issues

**"playwright: command not found"**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**"Browser not found"**
```bash
npx playwright install --force
```

**Tests running too slow**
```bash
# In playwright.config.js
workers: 1,
headless: true,
```

---

**🎉 Done! Playwright is ready to use!**
