const { test, expect } = require('../fixtures/playwright.fixtures');

/**
 * ADVANCED E-COMMERCE TESTS - REFACTORED WITH PAGE OBJECT MODEL
 * Test suite hoàn chỉnh cho ứng dụng e-commerce sử dụng POM pattern
 */

test.describe('🛒 Advanced E-commerce Testing Suite - POM Version', () => {

  test.beforeEach(async ({ page, testData }) => {
    console.log('🚀 Setting up e-commerce test environment with POM...');
    
    // Setup API mocks directly using page.route
    await page.route('**/api/products**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          products: testData.products.electronics.concat(testData.products.clothing),
          total: testData.products.electronics.length + testData.products.clothing.length
        })
      });
    });

    await page.route('**/api/auth/login**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token-12345',
          user: testData.users.validUser
        })
      });
    });

    await page.route('**/api/cart**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(testData.shoppingCart.multipleItemsCart)
      });
    });
  });

  test('🔍 Complex Product Search with Page Object Model', async ({ 
    todoMVCPage, 
    testData, 
    testHelpers,
    performanceMonitor,
    screenshot 
  }) => {
    testHelpers.log('🔍 Testing advanced product search with POM');

    const searchStart = Date.now();
    await todoMVCPage.navigate();
    performanceMonitor.recordMetric('page-load', Date.now() - searchStart);

    // Use test data for search terms
    const searchTerms = testData.search.validQueries.slice(0, 3);
    
    for (const searchTerm of searchTerms) {
      testHelpers.log(`🔍 Searching for: ${searchTerm}`);
      
      const searchStart = Date.now();
      await todoMVCPage.addTodo(`Search: ${searchTerm}`);
      performanceMonitor.recordMetric(`search-${searchTerm}`, Date.now() - searchStart);
      
      await testHelpers.wait(500); // Small delay between searches
    }

    // Verify search results using TodoMVC as mock e-commerce interface
    const todoCount = await todoMVCPage.getTodoCount();
    testHelpers.log(`📊 Search results count: ${todoCount}`);
    expect(todoCount).toBe(searchTerms.length);

    const todoTexts = await todoMVCPage.getTodoTexts();
    testHelpers.log(`🔍 Search results: ${todoTexts.join(', ')}`);
    
    // Verify each search term appears in results
    for (const searchTerm of searchTerms) {
      const hasResult = todoTexts.some(text => text.includes(searchTerm));
      expect(hasResult).toBeTruthy();
    }

    await screenshot.take('search-results');
  });

  test('🛒 Shopping Cart Operations with Components', async ({ 
    shoppingCartComponent,
    cartWithItems,
    testHelpers,
    testData 
  }) => {
    testHelpers.log('🛒 Testing shopping cart with POM components');

    // Use fixture with pre-loaded cart
    const { cart, cartData } = cartWithItems;
    
    // Simulate opening cart
    testHelpers.log('🛒 Opening shopping cart');
    
    // Get cart summary using component
    // Note: Since we're using TodoMVC as demo, we'll simulate cart operations
    const mockCartSummary = {
      itemCount: cartData.items.length,
      items: cartData.items,
      subtotal: cartData.subtotal,
      tax: cartData.tax,
      shipping: cartData.shipping,
      total: cartData.total,
      isEmpty: cartData.isEmpty
    };
    
    testHelpers.log(`📊 Cart summary: ${JSON.stringify(mockCartSummary, null, 2)}`);
    
    // Verify cart data
    expect(mockCartSummary.itemCount).toBe(2);
    expect(mockCartSummary.total).toBe(3100);
    expect(mockCartSummary.isEmpty).toBeFalsy();
    
    // Test cart calculations
    const expectedSubtotal = mockCartSummary.items.reduce((sum, item) => sum + item.total, 0);
    expect(mockCartSummary.subtotal).toBe(expectedSubtotal);
    
    // Test individual items
    const firstItem = mockCartSummary.items[0];
    expect(firstItem.name).toContain('iPhone');
    expect(firstItem.quantity).toBe(2);
    expect(firstItem.total).toBe(2000);
  });

  test('💳 Checkout Process with Form Validation', async ({ 
    todoMVCPage,
    testData,
    testHelpers,
    database 
  }) => {
    testHelpers.log('💳 Testing checkout process with POM');

    await todoMVCPage.navigate();

    // Simulate adding items to cart
    const orderData = testData.orders.validOrder;
    
    // Add order info as todo items for demonstration
    await todoMVCPage.addTodo(`Customer: ${orderData.customer.name}`);
    await todoMVCPage.addTodo(`Email: ${orderData.customer.email}`);
    await todoMVCPage.addTodo(`Total: $${orderData.total}`);
    
    // Store order in mock database
    const orderId = testHelpers.generateRandomString(8);
    const dbResult = database.insert('orders', orderId, {
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    });
    
    testHelpers.log(`💾 Order stored in database: ${JSON.stringify(dbResult)}`);
    expect(dbResult.success).toBeTruthy();
    
    // Retrieve and verify order
    const storedOrder = database.findById('orders', orderId);
    testHelpers.log(`📋 Retrieved order: ${JSON.stringify(storedOrder, null, 2)}`);
    
    expect(storedOrder).toBeTruthy();
    expect(storedOrder.customer.name).toBe(orderData.customer.name);
    expect(storedOrder.total).toBe(orderData.total);
    
    // Validate checkout form data
    const emailValid = testHelpers.isValidEmail(orderData.customer.email);
    const phoneValid = testHelpers.isValidPhone(orderData.customer.phone);
    
    testHelpers.log(`✅ Email validation: ${emailValid}`);
    testHelpers.log(`✅ Phone validation: ${phoneValid}`);
    
    expect(emailValid).toBeTruthy();
    expect(phoneValid).toBeTruthy();
    
    // Verify todos were created
    const todoCount = await todoMVCPage.getTodoCount();
    expect(todoCount).toBe(3);
  });

  test('📊 Advanced Data Analysis and Reporting', async ({ 
    todoMVCPage,
    testData,
    testHelpers,
    performanceMonitor 
  }) => {
    testHelpers.log('📊 Testing advanced data analysis with POM');

    await todoMVCPage.navigate();

    // Generate test products using test data
    const products = [];
    for (let i = 0; i < 5; i++) {
      const product = testData.generateData('product');
      products.push(product);
      
      await todoMVCPage.addTodo(`${product.name} - $${product.price}`);
      testHelpers.log(`➕ Added product: ${product.name}`);
    }

    // Simulate some purchases (mark some todos as completed)
    await todoMVCPage.completeTodo(0);
    await todoMVCPage.completeTodo(2);
    await todoMVCPage.completeTodo(4);

    // Get comprehensive analytics
    const analytics = await todoMVCPage.getTodoAnalytics();
    testHelpers.log(`📈 Analytics: ${JSON.stringify(analytics, null, 2)}`);

    // Calculate revenue from completed items (simulate)
    const completedProducts = products.filter((_, index) => [0, 2, 4].includes(index));
    const totalRevenue = completedProducts.reduce((sum, product) => sum + product.price, 0);
    
    testHelpers.log(`💰 Total revenue: $${totalRevenue}`);
    
    // Create comprehensive report
    const report = {
      productMetrics: {
        totalProducts: products.length,
        soldProducts: completedProducts.length,
        unsoldProducts: products.length - completedProducts.length,
        conversionRate: (completedProducts.length / products.length * 100).toFixed(2) + '%'
      },
      
      revenueMetrics: {
        totalRevenue,
        averageOrderValue: completedProducts.length > 0 
          ? (totalRevenue / completedProducts.length).toFixed(2) 
          : 0,
        topSellingProduct: completedProducts.reduce((top, product) => 
          product.price > (top?.price || 0) ? product : top, null)
      },
      
      todoAnalytics: analytics.statistics
    };

    testHelpers.log(`📊 Comprehensive report: ${JSON.stringify(report, null, 2)}`);

    // Assertions
    expect(analytics.statistics.completedCount).toBe(3);
    expect(analytics.statistics.pendingCount).toBe(2);
    expect(parseFloat(analytics.statistics.completionRate)).toBe(60);
    expect(totalRevenue).toBeGreaterThan(0);
  });

  test('🔄 Parallel Operations and Race Conditions', async ({ 
    multiBrowser,
    testHelpers,
    todoMVCPage 
  }) => {
    testHelpers.log('🔄 Testing parallel operations with multiple browsers');

    const { pages, chrome, firefox, safari } = multiBrowser;
    
    // Create page objects for each browser
    const chromePage = new (require('../pages/TodoMVCPage'))(chrome);
    const firefoxPage = new (require('../pages/TodoMVCPage'))(firefox);
    const safariPage = new (require('../pages/TodoMVCPage'))(safari);

    // Navigate all browsers simultaneously
    await Promise.all([
      chromePage.navigate(),
      firefoxPage.navigate(),
      safariPage.navigate()
    ]);

    testHelpers.log('📱 Multiple browsers navigated');

    // Perform operations in parallel
    const operations = [
      chromePage.addTodo('Task from Chrome'),
      firefoxPage.addTodo('Task from Firefox'),
      safariPage.addTodo('Task from Safari')
    ];

    await Promise.all(operations);
    testHelpers.log('⚡ Parallel operations completed');

    // Verify results on each browser
    const counts = await Promise.all([
      chromePage.getTodoCount(),
      firefoxPage.getTodoCount(),
      safariPage.getTodoCount()
    ]);

    testHelpers.log(`📊 Todo counts per browser: ${counts.join(', ')}`);
    
    // Each browser should have at least 1 item
    counts.forEach((count, index) => {
      expect(count).toBeGreaterThanOrEqual(1);
      testHelpers.log(`✅ Browser ${index + 1} has ${count} items`);
    });

    // Test concurrent modifications
    await Promise.all([
      chromePage.addTodo('Concurrent task 1'),
      firefoxPage.addTodo('Concurrent task 2'),
      safariPage.addTodo('Concurrent task 3')
    ]);

    const finalCounts = await Promise.all([
      chromePage.getTodoCount(),
      firefoxPage.getTodoCount(),
      safariPage.getTodoCount()
    ]);

    testHelpers.log(`📊 Final counts: ${finalCounts.join(', ')}`);
    finalCounts.forEach(count => expect(count).toBe(2));
  });

  test('📱 Mobile and Desktop Responsive Testing', async ({ 
    mobileDevice,
    todoMVCPage,
    testHelpers
  }) => {
    testHelpers.log('📱 Testing responsive design with mobile device');

    const { page: mobilePage } = mobileDevice;
    const mobileTodoPage = new (require('../pages/TodoMVCPage'))(mobilePage);

    // Test on mobile device
    await mobileTodoPage.navigate();

    // Test functionality on mobile
    await mobileTodoPage.addTodo('Mobile test item');
    const mobileCount = await mobileTodoPage.getTodoCount();
    
    testHelpers.log(`📱 Mobile todo count: ${mobileCount}`);
    expect(mobileCount).toBe(1);

    // Compare with desktop version
    await todoMVCPage.navigate();
    await todoMVCPage.addTodo('Desktop test item');
    const desktopCount = await todoMVCPage.getTodoCount();
    
    testHelpers.log(`🖥️ Desktop todo count: ${desktopCount}`);
    expect(desktopCount).toBe(1);



    // Both should work the same way
    expect(mobileCount).toBe(desktopCount);
  });

  test('⚡ Performance Testing with Resource Monitoring', async ({ 
    todoMVCPage,
    testHelpers,
    performanceMonitor,
    apiHelpers 
  }) => {
    testHelpers.log('⚡ Testing performance with comprehensive monitoring');

    const { networkMonitor } = apiHelpers;
    
    // Clear previous network data
    networkMonitor.clear();

    // Test navigation performance
    const navStart = Date.now();
    await todoMVCPage.navigate();
    const navTime = Date.now() - navStart;
    
    performanceMonitor.recordMetric('navigation', navTime);
    testHelpers.log(`🚀 Navigation time: ${navTime}ms`);

    // Test batch operations performance
    const batchStart = Date.now();
    const batchOperations = [];
    
    for (let i = 0; i < 10; i++) {
      batchOperations.push(todoMVCPage.addTodo(`Performance test item ${i + 1}`));
    }
    
    await Promise.all(batchOperations);
    const batchTime = Date.now() - batchStart;
    
    performanceMonitor.recordMetric('batch-operations', batchTime);
    testHelpers.log(`⚡ Batch operations time: ${batchTime}ms`);

    // Get comprehensive performance metrics
    const pageMetrics = await performanceMonitor.getPageMetrics();
    const networkStats = networkMonitor.getStatistics();
    
    testHelpers.log(`📊 Page metrics: ${JSON.stringify(pageMetrics, null, 2)}`);
    testHelpers.log(`🌐 Network stats: ${JSON.stringify(networkStats, null, 2)}`);

    // Performance assertions
    expect(navTime).toBeLessThan(10000); // Navigation under 10s
    expect(batchTime).toBeLessThan(5000); // Batch operations under 5s
    expect(pageMetrics.totalLoadTime).toBeGreaterThan(0);

    // Verify todos were created
    const finalCount = await todoMVCPage.getTodoCount();
    expect(finalCount).toBe(10);

    // Get final performance summary
    const summary = performanceMonitor.getSummary();
    testHelpers.log(`📈 Performance summary: ${JSON.stringify(summary, null, 2)}`);
  });

});

test.describe('🔄 Data-Driven Testing Suite - POM Version', () => {
  
  test('👤 User Authentication Tests with Test Data', async ({ 
    todoMVCPage,
    testData,
    testHelpers,
    authenticatedUser 
  }) => {
    testHelpers.log('🔐 Testing authentication with POM and test data');

    const { user, loginComponent } = authenticatedUser;
    
    await todoMVCPage.navigate();
    
    // Simulate login process using test data
    await todoMVCPage.addTodo(`User: ${user.name} (${user.email})`);
    
    testHelpers.log(`👤 Testing user: ${user.name}`);
    testHelpers.log(`📧 User email: ${user.email}`);
    
    // Verify user data is valid
    expect(testHelpers.isValidEmail(user.email)).toBeTruthy();
    expect(user.name.length).toBeGreaterThan(0);
    
    const todoTexts = await todoMVCPage.getTodoTexts();
    expect(todoTexts[0]).toContain(user.name);
    expect(todoTexts[0]).toContain(user.email);
  });

  test('🛍️ Product Tests with Dynamic Data', async ({ 
    todoMVCPage,
    testData,
    testHelpers 
  }) => {
    testHelpers.log('🛍️ Testing products with dynamic test data');

    await todoMVCPage.navigate();

    // Test with electronics products
    for (const product of testData.products.electronics.slice(0, 3)) {
      testHelpers.log(`🔍 Testing product: ${product.name}`);
      
      const productEntry = `${product.name} - $${product.price} (${product.category})`;
      await todoMVCPage.addTodo(productEntry);
      
      // Simulate purchase if in stock
      if (product.inStock) {
        const index = await todoMVCPage.getTodoIndexByText(product.name);
        if (index !== -1) {
          await todoMVCPage.completeTodo(index);
          testHelpers.log(`✅ Purchased: ${product.name}`);
        }
      }
    }

    // Verify all products were added
    const todoCount = await todoMVCPage.getTodoCount();
    expect(todoCount).toBe(3);

    // Get analytics for purchase behavior
    const analytics = await todoMVCPage.getTodoAnalytics();
    testHelpers.log(`📊 Purchase analytics: ${JSON.stringify(analytics.statistics)}`);
    
    // Should have some completed items (purchases)
    expect(analytics.statistics.completedCount).toBeGreaterThan(0);
  });

  test('🎯 Dynamic Test Data Generation', async ({ 
    todoMVCPage,
    testData,
    testHelpers 
  }) => {
    testHelpers.log('🎯 Testing with dynamically generated data');

    await todoMVCPage.navigate();

    // Generate random test data
    const randomUser = testData.generateData('user');
    const randomProduct = testData.generateData('product');
    
    testHelpers.log(`👤 Generated user: ${JSON.stringify(randomUser, null, 2)}`);
    testHelpers.log(`🛍️ Generated product: ${JSON.stringify(randomProduct, null, 2)}`);

    // Use generated data in tests
    await todoMVCPage.addTodo(`User: ${randomUser.fullName} - ${randomUser.email}`);
    await todoMVCPage.addTodo(`Product: ${randomProduct.name} - $${randomProduct.price}`);

    // Validate generated data
    expect(testHelpers.isValidEmail(randomUser.email)).toBeTruthy();
    expect(randomProduct.price).toBeGreaterThan(0);
    expect(randomProduct.name.length).toBeGreaterThan(0);

    const todoTexts = await todoMVCPage.getTodoTexts();
    expect(todoTexts).toHaveLength(2);
    expect(todoTexts[0]).toContain(randomUser.fullName);
    expect(todoTexts[1]).toContain(randomProduct.name);
  });

});

test.afterAll(async () => {
  console.log('🧹 Cleaning up advanced e-commerce POM tests...');
});
