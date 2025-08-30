const { test, expect } = require('@playwright/test');

test('Kiểm tra trang chủ Playwright', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Kiểm tra title có chứa "Playwright"
  await expect(page).toHaveTitle(/Playwright/);

  // Kiểm tra link "Get started" có hiển thị
  const getStarted = page.getByText('Get started');
  await expect(getStarted).toBeVisible();

  // Click vào link "Get started"
  await getStarted.click();

  // Kiểm tra đã chuyển đến trang installation
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Kiểm tra navigation menu', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Kiểm tra menu docs có tồn tại
  const docsMenu = page.locator('nav >> text=Docs');
  await expect(docsMenu).toBeVisible();
  
  // Kiểm tra menu API có tồn tại  
  const apiMenu = page.locator('nav >> text=API');
  
  await expect(apiMenu).toBeVisible();
});
