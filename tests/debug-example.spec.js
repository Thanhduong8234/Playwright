const { test, expect } = require('@playwright/test');

test('Debug Example - Theo dõi properties', async ({ page }) => {
  console.log('🚀 Bắt đầu test...');
  
  await page.goto('https://playwright.dev/');

  // 🔍 DEBUG: Lấy và in ra title của trang
  const pageTitle = await page.title();
  console.log('📄 Page Title:', pageTitle);

  // 🔍 DEBUG: Lấy URL hiện tại
  const currentUrl = await page.url();
  console.log('🌐 Current URL:', currentUrl);

  // 🔍 DEBUG: Lấy viewport size
  const viewportSize = page.viewportSize();
  console.log('📐 Viewport Size:', viewportSize);

  // Kiểm tra title có chứa "Playwright"
  await expect(page).toHaveTitle(/Playwright/);

  // Tìm button "Get started"
  const getStarted = page.getByText('Get started').first();
  
  // 🔍 DEBUG: Kiểm tra element properties
  const isVisible = await getStarted.isVisible();
  console.log('👁️ Get Started button visible:', isVisible);
  
  const buttonText = await getStarted.textContent();
  console.log('📝 Button text:', buttonText);
  
  const buttonBoundingBox = await getStarted.boundingBox();
  console.log('📏 Button position/size:', buttonBoundingBox);

  // 🔍 DEBUG: Lấy tất cả attributes của button
  const buttonHtml = await getStarted.innerHTML();
  console.log('🏷️ Button HTML:', buttonHtml);

  await expect(getStarted).toBeVisible();

  // Click vào button
  console.log('🖱️ Clicking Get Started button...');
  await getStarted.click();

  // 🔍 DEBUG: URL sau khi click
  await page.waitForLoadState('networkidle'); // Đợi page load xong
  const newUrl = await page.url();
  console.log('🌐 URL after click:', newUrl);

  // Tìm heading Installation
  const installationHeading = page.getByRole('heading', { name: 'Installation' });
  
  // 🔍 DEBUG: Properties của heading
  const headingExists = await installationHeading.isVisible();
  console.log('👁️ Installation heading visible:', headingExists);
  
  if (headingExists) {
    const headingText = await installationHeading.textContent();
    console.log('📝 Heading text:', headingText);
    
    const headingTag = await installationHeading.evaluate(el => el.tagName);
    console.log('🏷️ Heading tag:', headingTag);
  }
  
  await expect(installationHeading).toBeVisible();
  
  console.log('✅ Test completed successfully!');
});

test('Debug với Page Evaluation - Chạy JavaScript trực tiếp', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // 🔍 DEBUG: Chạy JavaScript trong browser để lấy thông tin
  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      url: window.location.href,
      userAgent: navigator.userAgent,
      cookiesCount: document.cookies ? document.cookies.split(';').length : 0,
      localStorageCount: localStorage.length,
      linksCount: document.querySelectorAll('a').length,
      imagesCount: document.querySelectorAll('img').length
    };
  });
  
  console.log('🔍 Page Information:', JSON.stringify(pageInfo, null, 2));
  
  // 🔍 DEBUG: Lấy thông tin về một element cụ thể
  const buttonInfo = await page.getByText('Get started').first().evaluate(element => {
    const rect = element.getBoundingClientRect();
    return {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      text: element.textContent,
      position: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      styles: window.getComputedStyle(element).color
    };
  });
  
  console.log('🔍 Button Information:', JSON.stringify(buttonInfo, null, 2));
});

test('Debug với Network Monitoring', async ({ page }) => {
  // 🔍 DEBUG: Theo dõi network requests
  page.on('request', request => {
    console.log('📤 Request:', request.method(), request.url());
  });
  
  page.on('response', response => {
    console.log('📥 Response:', response.status(), response.url());
  });
  
  await page.goto('https://playwright.dev/');
  
  // Đợi tất cả network requests hoàn thành
  await page.waitForLoadState('networkidle');
  console.log('🌐 All network requests completed');
});
