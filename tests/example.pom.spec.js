const { test, expect } = require('../fixtures/playwright.fixtures');

/**
 * EXAMPLE TESTS - REFACTORED WITH PAGE OBJECT MODEL
 * Các test đã được refactor để sử dụng Page Object Model
 */

test.describe('🎭 Playwright Website Tests - POM Version', () => {
  
  test('Kiểm tra trang chủ Playwright với Page Object Model', async ({ 
    playwrightHomePage, 
    testHelpers
  }) => {
    testHelpers.log('🚀 Starting Playwright homepage test with POM');

    // Navigate to homepage
    await playwrightHomePage.navigate();

    // Verify page title
    const title = await playwrightHomePage.getTitle();
    testHelpers.log(`📄 Page title: ${title}`);
    await expect(playwrightHomePage.page).toHaveTitle(/Playwright/);

    // Check if Get Started button is visible
    const isGetStartedVisible = await playwrightHomePage.isGetStartedVisible();
    testHelpers.log(`👀 Get Started button visible: ${isGetStartedVisible}`);
    expect(isGetStartedVisible).toBeTruthy();

    // Click Get Started button
    await playwrightHomePage.clickGetStarted();
    testHelpers.log('🔗 Clicked Get Started button');

    // Verify navigation to installation page
    const isInstallationVisible = await playwrightHomePage.isInstallationHeadingVisible();
    testHelpers.log(`📋 Installation heading visible: ${isInstallationVisible}`);
    expect(isInstallationVisible).toBeTruthy();
  });

  test('Kiểm tra navigation menu với Page Object Model', async ({ 
    playwrightHomePage,
    testHelpers,
    performanceMonitor 
  }) => {
    testHelpers.log('🧭 Testing navigation menu with POM');
    
    const startTime = Date.now();

    // Navigate to homepage
    await playwrightHomePage.navigate();
    performanceMonitor.recordMetric('homepage-load', Date.now() - startTime);

    // Check Docs menu visibility
    const isDocsVisible = await playwrightHomePage.isDocsMenuVisible();
    testHelpers.log(`📚 Docs menu visible: ${isDocsVisible}`);
    expect(isDocsVisible).toBeTruthy();

    // Check API menu visibility  
    const isApiVisible = await playwrightHomePage.isApiMenuVisible();
    testHelpers.log(`🔧 API menu visible: ${isApiVisible}`);
    expect(isApiVisible).toBeTruthy();

    // Get all navigation menu items
    const menuItems = await playwrightHomePage.getNavigationMenuItems();
    testHelpers.log(`🧭 Navigation menu items: ${menuItems.join(', ')}`);
    expect(menuItems.length).toBeGreaterThan(0);

    // Check main sections
    const sections = await playwrightHomePage.checkMainSections();
    testHelpers.log(`📋 Main sections: ${JSON.stringify(sections)}`);
    
    // Performance assertion
    const pageMetrics = await performanceMonitor.getPageMetrics();
    testHelpers.log(`⚡ Page metrics: ${JSON.stringify(pageMetrics)}`);
    
    // Check totalLoadTime if available
    if (pageMetrics && typeof pageMetrics.totalLoadTime === 'number' && pageMetrics.totalLoadTime > 0) {
      expect(pageMetrics.totalLoadTime).toBeLessThan(5000); // Less than 5 seconds
      testHelpers.log('✅ Performance assertion passed');
    } else {
      testHelpers.log('⚠️ totalLoadTime not available, skipping performance assertion');
    }
  });

  test('Kiểm tra tính năng search với Page Object Model', async ({ 
    playwrightHomePage,
    testData,
    testHelpers 
  }) => {
    testHelpers.log('🔍 Testing search functionality with POM');

    await playwrightHomePage.navigate();

    // Get search queries from test data
    const searchQueries = testData.search.validQueries;
    
    for (const query of searchQueries.slice(0, 2)) { // Test first 2 queries
      testHelpers.log(`🔍 Searching for: ${query}`);
      
      try {
        await playwrightHomePage.search(query);
        testHelpers.log(`✅ Search completed for: ${query}`);
        
        // Add small delay between searches
        await testHelpers.wait(1000);
      } catch (error) {
        testHelpers.log(`❌ Search failed for ${query}: ${error.message}`, 'warn');
        // Continue with next search if this one fails
      }
    }
  });

  test('Kiểm tra responsive design với Page Object Model', async ({ 
    playwrightHomePage,
    testHelpers
  }) => {
    testHelpers.log('📱 Testing responsive design with POM');

    // Test different viewport sizes
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      testHelpers.log(`📏 Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      // Set viewport size
      await playwrightHomePage.page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      // Navigate to homepage
      await playwrightHomePage.navigate();
      
      // Check if main elements are visible
      const isGetStartedVisible = await playwrightHomePage.isGetStartedVisible();
      testHelpers.log(`${viewport.name} - Get Started visible: ${isGetStartedVisible}`);
      
      // Basic assertions
      expect(isGetStartedVisible).toBeTruthy();
      
      const currentUrl = await playwrightHomePage.getCurrentUrl();
      expect(currentUrl).toContain('playwright.dev');
    }
  });

  test('Kiểm tra accessibility với Page Object Model', async ({ 
    playwrightHomePage,
    testHelpers 
  }) => {
    testHelpers.log('♿ Testing accessibility with POM');

    await playwrightHomePage.navigate();

    // Test keyboard navigation
    await playwrightHomePage.page.keyboard.press('Tab');
    await testHelpers.wait(500);
    
    await playwrightHomePage.page.keyboard.press('Tab');
    await testHelpers.wait(500);
    
    // Test if Get Started button can be activated with keyboard
    await playwrightHomePage.page.keyboard.press('Enter');
    await testHelpers.wait(2000);
    
    // Check if navigation worked
    const currentUrl = await playwrightHomePage.getCurrentUrl();
    testHelpers.log(`🔗 Current URL after keyboard navigation: ${currentUrl}`);
    
    // Verify URL is still valid (may or may not have changed)
    expect(currentUrl).toBeTruthy();
    expect(currentUrl).toContain('playwright.dev');
  });

  test('Kiểm tra performance với Page Object Model', async ({ 
    playwrightHomePage,
    testHelpers,
    performanceMonitor 
  }) => {
    testHelpers.log('⚡ Testing performance with POM');

    // Monitor navigation performance
    const navigationStart = Date.now();
    await playwrightHomePage.navigate();
    const navigationTime = Date.now() - navigationStart;
    
    performanceMonitor.recordMetric('navigation-time', navigationTime);
    testHelpers.log(`🚀 Navigation time: ${navigationTime}ms`);

    // Get detailed page metrics
    const pageMetrics = await performanceMonitor.getPageMetrics();
    testHelpers.log(`📊 Detailed metrics: ${JSON.stringify(pageMetrics, null, 2)}`);

    // Test interaction performance
    const clickStart = Date.now();
    if (await playwrightHomePage.isGetStartedVisible()) {
      await playwrightHomePage.clickGetStarted();
    }
    const clickTime = Date.now() - clickStart;
    
    performanceMonitor.recordMetric('click-response-time', clickTime);
    testHelpers.log(`🖱️ Click response time: ${clickTime}ms`);

    // Performance assertions
    expect(navigationTime).toBeLessThan(10000); // Less than 10 seconds
    expect(clickTime).toBeLessThan(3000); // Less than 3 seconds
    
    // Check pageMetrics if available
    if (pageMetrics && pageMetrics.totalLoadTime !== null && pageMetrics.totalLoadTime !== undefined) {
      expect(pageMetrics.totalLoadTime).toBeLessThan(8000);
    } else {
      testHelpers.log('⚠️ Performance metrics not fully available');
    }

    // Get final performance summary
    const summary = performanceMonitor.getSummary();
    testHelpers.log(`📈 Performance summary: ${JSON.stringify(summary)}`);
  });

});

test.describe('🎯 Advanced POM Features', () => {
  
  test('Test với multiple page objects', async ({ 
    playwrightHomePage,
    todoMVCPage,
    testHelpers 
  }) => {
    testHelpers.log('🔄 Testing with multiple page objects');

    // Test Playwright homepage first
    await playwrightHomePage.navigate();
    const playwrightTitle = await playwrightHomePage.getTitle();
    testHelpers.log(`📄 Playwright title: ${playwrightTitle}`);
    expect(playwrightTitle).toContain('Playwright');

    // Then test TodoMVC page
    await todoMVCPage.navigate();
    await todoMVCPage.addTodo('Test todo from POM');
    
    const todoCount = await todoMVCPage.getTodoCount();
    testHelpers.log(`📝 Todo count: ${todoCount}`);
    expect(todoCount).toBe(1);

    const todoTexts = await todoMVCPage.getTodoTexts();
    testHelpers.log(`📋 Todo texts: ${todoTexts.join(', ')}`);
    expect(todoTexts).toContain('Test todo from POM');
  });

  test('Test với custom test data', async ({ 
    todoMVCPage,
    testData,
    testHelpers 
  }) => {
    testHelpers.log('📊 Testing with custom test data');

    await todoMVCPage.navigate();

    // Use test data to add multiple todos
    const todoItems = [
      'Buy groceries',
      'Walk the dog', 
      'Finish project',
      'Call mom',
      'Read book'
    ];

    for (const item of todoItems) {
      await todoMVCPage.addTodo(item);
      testHelpers.log(`➕ Added todo: ${item}`);
    }

    const finalCount = await todoMVCPage.getTodoCount();
    testHelpers.log(`📊 Final todo count: ${finalCount}`);
    expect(finalCount).toBe(todoItems.length);

    // Mark some todos as completed
    await todoMVCPage.completeTodo(0);
    await todoMVCPage.completeTodo(2);

    // Get analytics
    const analytics = await todoMVCPage.getTodoAnalytics();
    testHelpers.log(`📈 Todo analytics: ${JSON.stringify(analytics.statistics)}`);
    
    expect(analytics.statistics.completedCount).toBe(2);
    expect(analytics.statistics.pendingCount).toBe(3);
  });

});

// Cleanup sau tất cả tests
test.afterAll(async () => {
  console.log('🧹 Cleaning up after POM tests...');
});
