const { test, expect } = require('@playwright/test');

test('Test với Trace - Ghi lại mọi thao tác', async ({ page }, testInfo) => {
  // Bắt đầu trace recording
  await page.context().tracing.start({ 
    screenshots: true, 
    snapshots: true,
    sources: true 
  });

  console.log('🎬 Trace recording started...');

  try {
    await page.goto('https://playwright.dev/');

    // Lấy properties của page
    const pageTitle = await page.title();
    const currentUrl = await page.url();
    console.log('📄 Title:', pageTitle);
    console.log('🌐 URL:', currentUrl);

    // Tìm và click button
    const getStarted = page.getByText('Get started').first();
    
    // Debug properties của button
    const buttonText = await getStarted.textContent();
    const isVisible = await getStarted.isVisible();
    console.log('🔍 Button properties:', { text: buttonText, visible: isVisible });

    await getStarted.click();
    
    // Đợi navigation
    await page.waitForLoadState('networkidle');
    
    const newUrl = await page.url();
    console.log('🌐 New URL:', newUrl);

    // Verify installation heading
    const heading = page.getByRole('heading', { name: 'Installation' });
    await expect(heading).toBeVisible();

    console.log('✅ Test completed successfully!');

  } finally {
    // Dừng trace và lưu file
    await page.context().tracing.stop({ 
      path: `traces/trace-${testInfo.title.replace(/\s+/g, '-')}.zip` 
    });
    console.log('💾 Trace saved to traces/ folder');
  }
});
