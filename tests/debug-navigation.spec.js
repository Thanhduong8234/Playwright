const { test, expect } = require('../fixtures/playwright.fixtures');

/**
 * DEBUG VERSION - Navigation Menu Test
 * Test case debug với nhiều logging information
 */

test.describe('🔍 Debug Navigation Menu Test', () => {
  
  test('Debug - Kiểm tra navigation menu chi tiết', async ({ 
    playwrightHomePage,
    testHelpers,
    performanceMonitor 
  }) => {
    testHelpers.log('🔍 [DEBUG] Starting detailed navigation menu test');
    
    // Step 1: Navigate với detailed logging
    testHelpers.log('🔍 [DEBUG] Step 1: Navigating to homepage...');
    const startTime = Date.now();
    
    await playwrightHomePage.navigate();
    const navigationTime = Date.now() - startTime;
    testHelpers.log(`🔍 [DEBUG] Navigation completed in ${navigationTime}ms`);
    
    performanceMonitor.recordMetric('homepage-load', navigationTime);

    // Step 2: Check page is loaded
    testHelpers.log('🔍 [DEBUG] Step 2: Verifying page is loaded...');
    const currentUrl = await playwrightHomePage.getCurrentUrl();
    const pageTitle = await playwrightHomePage.getTitle();
    testHelpers.log(`🔍 [DEBUG] Current URL: ${currentUrl}`);
    testHelpers.log(`🔍 [DEBUG] Page title: ${pageTitle}`);

    // Step 3: Debug selectors
    testHelpers.log('🔍 [DEBUG] Step 3: Checking selectors...');
    const docsSelector = playwrightHomePage.selectors.docsMenu;
    const apiSelector = playwrightHomePage.selectors.apiMenu;
    testHelpers.log(`🔍 [DEBUG] Docs selector: ${docsSelector}`);
    testHelpers.log(`🔍 [DEBUG] API selector: ${apiSelector}`);

    // Step 4: Check Docs menu with debugging
    testHelpers.log('🔍 [DEBUG] Step 4: Checking Docs menu...');
    try {
      const docsElement = playwrightHomePage.page.locator(docsSelector);
      const docsCount = await docsElement.count();
      testHelpers.log(`🔍 [DEBUG] Docs elements found: ${docsCount}`);
      
      if (docsCount > 0) {
        const docsText = await docsElement.first().textContent();
        const docsVisible = await docsElement.first().isVisible();
        testHelpers.log(`🔍 [DEBUG] First docs element text: "${docsText}"`);
        testHelpers.log(`🔍 [DEBUG] First docs element visible: ${docsVisible}`);
      }
      
      const isDocsVisible = await playwrightHomePage.isDocsMenuVisible();
      testHelpers.log(`🔍 [DEBUG] Docs menu visible (POM method): ${isDocsVisible}`);
      expect(isDocsVisible).toBeTruthy();
    } catch (error) {
      testHelpers.log(`🔍 [ERROR] Docs menu check failed: ${error.message}`, 'error');
      throw error;
    }

    // Step 5: Check API menu with debugging
    testHelpers.log('🔍 [DEBUG] Step 5: Checking API menu...');
    try {
      const apiElement = playwrightHomePage.page.locator(apiSelector);
      const apiCount = await apiElement.count();
      testHelpers.log(`🔍 [DEBUG] API elements found: ${apiCount}`);
      
      if (apiCount > 0) {
        const apiText = await apiElement.first().textContent();
        const apiVisible = await apiElement.first().isVisible();
        testHelpers.log(`🔍 [DEBUG] First API element text: "${apiText}"`);
        testHelpers.log(`🔍 [DEBUG] First API element visible: ${apiVisible}`);
      }
      
      const isApiVisible = await playwrightHomePage.isApiMenuVisible();
      testHelpers.log(`🔍 [DEBUG] API menu visible (POM method): ${isApiVisible}`);
      expect(isApiVisible).toBeTruthy();
    } catch (error) {
      testHelpers.log(`🔍 [ERROR] API menu check failed: ${error.message}`, 'error');
      throw error;
    }

    // Step 6: Get all navigation items with debugging
    testHelpers.log('🔍 [DEBUG] Step 6: Getting all navigation items...');
    try {
      const navSelector = `${playwrightHomePage.selectors.navigationMenu} a`;
      testHelpers.log(`🔍 [DEBUG] Navigation selector: ${navSelector}`);
      
      const navElements = await playwrightHomePage.page.locator(navSelector).all();
      testHelpers.log(`🔍 [DEBUG] Total navigation elements found: ${navElements.length}`);
      
      const menuItems = await playwrightHomePage.getNavigationMenuItems();
      testHelpers.log(`🔍 [DEBUG] Menu items extracted: ${JSON.stringify(menuItems)}`);
      expect(menuItems.length).toBeGreaterThan(0);
    } catch (error) {
      testHelpers.log(`🔍 [ERROR] Navigation items check failed: ${error.message}`, 'error');
      throw error;
    }

    // Step 7: Check main sections with debugging
    testHelpers.log('🔍 [DEBUG] Step 7: Checking main sections...');
    try {
      const heroSelector = playwrightHomePage.selectors.heroSection;
      const featuresSelector = playwrightHomePage.selectors.featuresList;
      testHelpers.log(`🔍 [DEBUG] Hero selector: ${heroSelector}`);
      testHelpers.log(`🔍 [DEBUG] Features selector: ${featuresSelector}`);
      
      const heroExists = await playwrightHomePage.page.locator(heroSelector).count();
      const featuresExists = await playwrightHomePage.page.locator(featuresSelector).count();
      testHelpers.log(`🔍 [DEBUG] Hero elements found: ${heroExists}`);
      testHelpers.log(`🔍 [DEBUG] Features elements found: ${featuresExists}`);
      
      const sections = await playwrightHomePage.checkMainSections();
      testHelpers.log(`🔍 [DEBUG] Main sections result: ${JSON.stringify(sections)}`);
    } catch (error) {
      testHelpers.log(`🔍 [ERROR] Main sections check failed: ${error.message}`, 'error');
      throw error;
    }
    
    // Step 8: Performance metrics with debugging
    testHelpers.log('🔍 [DEBUG] Step 8: Getting performance metrics...');
    try {
      const pageMetrics = await performanceMonitor.getPageMetrics();
      testHelpers.log(`🔍 [DEBUG] Raw page metrics: ${JSON.stringify(pageMetrics, null, 2)}`);
      
      if (pageMetrics) {
        testHelpers.log(`🔍 [DEBUG] DOM Content Loaded: ${pageMetrics.domContentLoaded}ms`);
        testHelpers.log(`🔍 [DEBUG] Load Complete: ${pageMetrics.loadComplete}ms`);
        testHelpers.log(`🔍 [DEBUG] Total Load Time: ${pageMetrics.totalLoadTime}`);
        testHelpers.log(`🔍 [DEBUG] Memory Usage: ${JSON.stringify(pageMetrics.memoryUsage)}`);
      }
      
      // Check totalLoadTime if available
      if (pageMetrics && typeof pageMetrics.totalLoadTime === 'number' && pageMetrics.totalLoadTime > 0) {
        testHelpers.log(`🔍 [DEBUG] Asserting totalLoadTime ${pageMetrics.totalLoadTime} < 5000ms`);
        expect(pageMetrics.totalLoadTime).toBeLessThan(5000);
        testHelpers.log('✅ [DEBUG] Performance assertion passed');
      } else {
        testHelpers.log('⚠️ [DEBUG] totalLoadTime not available or invalid, skipping performance assertion');
      }
    } catch (error) {
      testHelpers.log(`🔍 [ERROR] Performance metrics failed: ${error.message}`, 'error');
      throw error;
    }

    // Step 9: Final summary
    testHelpers.log('🔍 [DEBUG] Step 9: Test completed successfully!');
    const performanceSummary = performanceMonitor.getSummary();
    testHelpers.log(`🔍 [DEBUG] Final performance summary: ${JSON.stringify(performanceSummary, null, 2)}`);
  });

});

test.afterEach(async ({ page }) => {
  // Take screenshot after test for debugging
  try {
    await page.screenshot({ 
      path: `debug-screenshots/navigation-test-${Date.now()}.png`, 
      fullPage: true 
    });
    console.log('🔍 [DEBUG] Screenshot saved');
  } catch (error) {
    console.log('🔍 [DEBUG] Screenshot failed:', error.message);
  }
});
