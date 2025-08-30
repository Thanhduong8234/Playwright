const { test, expect } = require('@playwright/test');

/**
 * ADVANCED E-COMMERCE TEST SUITE
 * Kiểm tra một trang web bán hàng hoàn chỉnh với nhiều tính năng phức tạp
 */

// Test data với nhiều scenarios khác nhau
const testUsers = [
  {
    email: 'user1@example.com',
    password: 'password123',
    name: 'Nguyễn Văn A',
    expectedBehavior: 'valid_user'
  },
  {
    email: 'invalid@example.com', 
    password: 'wrongpass',
    name: 'User Invalid',
    expectedBehavior: 'invalid_user'
  }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    price: 1000,
    quantity: 2
  },
  {
    name: 'Samsung Galaxy S24',
    category: 'Electronics', 
    price: 800,
    quantity: 1
  }
];

test.describe('🛒 Advanced E-commerce Testing Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup trước mỗi test
    console.log('🚀 Setting up test environment...');
    
    // Intercept và mock API calls
    await page.route('**/api/products**', async route => {
      console.log('🔄 Mocking products API...');
      const mockProducts = [
        { id: 1, name: 'iPhone 15 Pro', price: 1000, stock: 50, category: 'Electronics' },
        { id: 2, name: 'Samsung Galaxy S24', price: 800, stock: 30, category: 'Electronics' },
        { id: 3, name: 'MacBook Pro M3', price: 2000, stock: 10, category: 'Computers' }
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts)
      });
    });

    // Mock user authentication API
    await page.route('**/api/auth/login**', async route => {
      const postData = route.request().postDataJSON();
      console.log('🔐 Login attempt for:', postData.email);
      
      if (postData.email === 'user1@example.com' && postData.password === 'password123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-jwt-token-12345',
            user: { id: 1, name: 'Nguyễn Văn A', email: postData.email }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Invalid credentials' })
        });
      }
    });

    // Đi đến trang demo (sử dụng một trang thực tế làm ví dụ)
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('📄 Navigated to demo site');
  });

  test('🔍 Complex Product Search with Filters', async ({ page }) => {
    console.log('🔍 Testing advanced product search functionality...');

    // Giả lập search functionality trên demo site
    const searchInput = page.locator('[placeholder="What needs to be done?"]');
    await searchInput.fill('iPhone 15 Pro');
    await searchInput.press('Enter');
    
    // Debug: Kiểm tra search results
    const todoList = page.locator('.todo-list');
    const newTodo = todoList.locator('li').last();
    const todoText = await newTodo.locator('label').textContent();
    console.log('🔍 Search result:', todoText);
    
    // Verify search functionality
    await expect(newTodo.locator('label')).toContainText('iPhone 15 Pro');
    
    // Giả lập thêm filter options
    await searchInput.fill('Samsung Galaxy S24');
    await searchInput.press('Enter');
    
    const secondTodo = todoList.locator('li').last();
    const secondTodoText = await secondTodo.locator('label').textContent();
    console.log('🔍 Second search result:', secondTodoText);
    
    // Debug: Count total items
    const allTodos = await todoList.locator('li').count();
    console.log('📊 Total search results:', allTodos);
    
    await expect(secondTodo.locator('label')).toContainText('Samsung Galaxy S24');
  });

  test('🛒 Shopping Cart Complex Operations', async ({ page }) => {
    console.log('🛒 Testing shopping cart functionality...');

    // Simulate adding products to cart
    const products = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro M3'];
    
    for (const product of products) {
      const searchInput = page.locator('[placeholder="What needs to be done?"]');
      await searchInput.fill(product);
      await searchInput.press('Enter');
      console.log(`➕ Added ${product} to cart`);
    }

    // Debug: Verify all products in cart
    const todoList = page.locator('.todo-list');
    const cartItems = await todoList.locator('li').count();
    console.log('🛒 Total items in cart:', cartItems);
    
    // Simulate quantity changes
    const firstItem = todoList.locator('li').first();
    const firstItemText = await firstItem.locator('label').textContent();
    console.log('🔄 Modifying quantity for:', firstItemText);
    
    // Mark as completed (simulate purchase)
    await firstItem.locator('input[type="checkbox"]').check();
    
    const isCompleted = await firstItem.locator('input[type="checkbox"]').isChecked();
    console.log('✅ Item purchased status:', isCompleted);
    
    await expect(firstItem.locator('input[type="checkbox"]')).toBeChecked();
  });

  test('💳 Checkout Process with Form Validation', async ({ page }) => {
    console.log('💳 Testing checkout process...');

    // Add item to simulate checkout
    const searchInput = page.locator('[placeholder="What needs to be done?"]');
    await searchInput.fill('Test Product for Checkout');
    await searchInput.press('Enter');

    // Simulate checkout form (using existing elements as examples)
    const todoItem = page.locator('.todo-list li').last();
    await todoItem.dblclick(); // Edit mode

    const editInput = todoItem.locator('input.edit');
    
    // Simulate filling checkout form data
    const checkoutData = {
      customerName: 'Nguyễn Văn A',
      email: 'user@example.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '+84901234567',
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123'
    };

    // Fill form data (simulated)
    await editInput.fill(`Order by ${checkoutData.customerName} - ${checkoutData.email}`);
    await editInput.press('Enter');

    // Debug checkout information
    console.log('💳 Checkout Data:', JSON.stringify(checkoutData, null, 2));
    
    // Validate form submission
    const updatedTodo = page.locator('.todo-list li').last();
    const orderText = await updatedTodo.locator('label').textContent();
    console.log('📋 Order details:', orderText);
    
    await expect(updatedTodo.locator('label')).toContainText(checkoutData.customerName);
    await expect(updatedTodo.locator('label')).toContainText(checkoutData.email);
  });

  test('📊 Advanced Data Analysis and Reporting', async ({ page }) => {
    console.log('📊 Testing advanced data analysis...');

    // Create test data
    const testProducts = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
    
    // Add multiple products
    for (let i = 0; i < testProducts.length; i++) {
      const searchInput = page.locator('[placeholder="What needs to be done?"]');
      await searchInput.fill(testProducts[i]);
      await searchInput.press('Enter');
    }

    // Analyze data using page.evaluate (chạy JS trong browser)
    const analytics = await page.evaluate(() => {
      const todos = document.querySelectorAll('.todo-list li');
      const analysis = {
        totalItems: todos.length,
        itemsData: [],
        statistics: {}
      };

      todos.forEach((todo, index) => {
        const label = todo.querySelector('label');
        const isCompleted = todo.querySelector('input[type="checkbox"]').checked;
        
        analysis.itemsData.push({
          index: index + 1,
          text: label ? label.textContent : '',
          isCompleted: isCompleted,
          elementClasses: todo.className
        });
      });

      // Calculate statistics
      analysis.statistics = {
        completedCount: analysis.itemsData.filter(item => item.isCompleted).length,
        pendingCount: analysis.itemsData.filter(item => !item.isCompleted).length,
        completionRate: analysis.itemsData.length > 0 
          ? (analysis.itemsData.filter(item => item.isCompleted).length / analysis.itemsData.length * 100).toFixed(2) + '%'
          : '0%'
      };

      return analysis;
    });

    // Debug analytics results
    console.log('📊 Data Analysis Results:');
    console.log(JSON.stringify(analytics, null, 2));

    // Validate analytics
    expect(analytics.totalItems).toBeGreaterThan(0);
    expect(analytics.itemsData).toHaveLength(testProducts.length);
    
    // Mark some items as completed for more complex analysis
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(0).locator('input[type="checkbox"]').check();
    await todoItems.nth(2).locator('input[type="checkbox"]').check();

    // Re-analyze after changes
    const updatedAnalytics = await page.evaluate(() => {
      const todos = document.querySelectorAll('.todo-list li');
      const completed = Array.from(todos).filter(todo => 
        todo.querySelector('input[type="checkbox"]').checked
      ).length;
      
      return {
        totalItems: todos.length,
        completedItems: completed,
        completionRate: todos.length > 0 ? (completed / todos.length * 100).toFixed(2) + '%' : '0%'
      };
    });

    console.log('📊 Updated Analytics:', updatedAnalytics);
    expect(parseInt(updatedAnalytics.completionRate)).toBeGreaterThan(0);
  });

  test('🔄 Parallel Operations and Race Conditions', async ({ page, context }) => {
    console.log('🔄 Testing parallel operations...');

    // Open multiple tabs to simulate concurrent operations
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    // Navigate all pages simultaneously
    await Promise.all([
      page.goto('https://demo.playwright.dev/todomvc'),
      page2.goto('https://demo.playwright.dev/todomvc'),
      page3.goto('https://demo.playwright.dev/todomvc')
    ]);

    console.log('📱 Multiple tabs opened');

    // Perform operations in parallel
    const operations = [
      // Page 1 operations
      page.locator('[placeholder="What needs to be done?"]').fill('Task from Page 1'),
      page.locator('[placeholder="What needs to be done?"]').press('Enter'),
      
      // Page 2 operations  
      page2.locator('[placeholder="What needs to be done?"]').fill('Task from Page 2'),
      page2.locator('[placeholder="What needs to be done?"]').press('Enter'),
      
      // Page 3 operations
      page3.locator('[placeholder="What needs to be done?"]').fill('Task from Page 3'),
      page3.locator('[placeholder="What needs to be done?"]').press('Enter')
    ];

    // Execute all operations in parallel
    await Promise.all(operations);
    console.log('⚡ Parallel operations completed');

    // Verify results on each page
    const verifications = await Promise.all([
      page.locator('.todo-list li').count(),
      page2.locator('.todo-list li').count(), 
      page3.locator('.todo-list li').count()
    ]);

    console.log('📊 Items count per page:', verifications);
    
    // Each page should have at least 1 item
    verifications.forEach((count, index) => {
      expect(count).toBeGreaterThanOrEqual(1);
      console.log(`✅ Page ${index + 1} has ${count} items`);
    });

    // Close additional pages
    await page2.close();
    await page3.close();
  });

  test('📱 Mobile and Desktop Responsive Testing', async ({ page, browserName }) => {
    console.log(`📱 Testing responsive design on ${browserName}...`);

    // Test different viewport sizes
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      console.log(`📏 Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to page
      await page.goto('https://demo.playwright.dev/todomvc');
      
      // Test functionality at this viewport
      const searchInput = page.locator('[placeholder="What needs to be done?"]');
      await searchInput.fill(`Test item on ${viewport.name}`);
      await searchInput.press('Enter');
      
      // Get element properties at different screen sizes
      const inputBox = await searchInput.boundingBox();
      const isVisible = await searchInput.isVisible();
      
      console.log(`📐 ${viewport.name} - Input box size:`, inputBox);
      console.log(`👁️ ${viewport.name} - Input visible:`, isVisible);
      
      // Verify element is visible and properly sized
      expect(isVisible).toBeTruthy();
      expect(inputBox.width).toBeGreaterThan(0);
      expect(inputBox.height).toBeGreaterThan(0);
      
      // Take screenshot for visual comparison
      await page.screenshot({ 
        path: `screenshots/${browserName}-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
      console.log(`📸 Screenshot saved for ${viewport.name}`);
    }
  });

});

// Test suite với data-driven testing
test.describe('🔄 Data-Driven Testing Suite', () => {
  
  // Parameterized test with multiple test data
  for (const user of testUsers) {
    test(`👤 User Authentication Test - ${user.expectedBehavior}`, async ({ page }) => {
      console.log(`🔐 Testing authentication for: ${user.email}`);
      
      await page.goto('https://demo.playwright.dev/todomvc');
      
      // Simulate login form (using todo input as example)
      const loginField = page.locator('[placeholder="What needs to be done?"]');
      await loginField.fill(`Login: ${user.email} / ${user.password}`);
      await loginField.press('Enter');
      
      const loginEntry = page.locator('.todo-list li').last();
      const loginText = await loginEntry.locator('label').textContent();
      
      console.log('🔍 Login attempt result:', loginText);
      console.log('📊 User data:', JSON.stringify(user, null, 2));
      
      if (user.expectedBehavior === 'valid_user') {
        await expect(loginEntry.locator('label')).toContainText(user.email);
        console.log('✅ Valid user login test passed');
      } else {
        await expect(loginEntry.locator('label')).toContainText(user.email);
        console.log('❌ Invalid user login test completed');
      }
    });
  }

  // Product testing with different data
  for (const product of products) {
    test(`🛍️ Product Test - ${product.name}`, async ({ page }) => {
      console.log(`🔍 Testing product: ${product.name}`);
      
      await page.goto('https://demo.playwright.dev/todomvc');
      
      // Simulate product operations
      const productEntry = `${product.name} - $${product.price} x${product.quantity}`;
      
      const searchInput = page.locator('[placeholder="What needs to be done?"]');
      await searchInput.fill(productEntry);
      await searchInput.press('Enter');
      
      const productItem = page.locator('.todo-list li').last();
      const productText = await productItem.locator('label').textContent();
      
      console.log('🛍️ Product entry:', productText);
      console.log('💰 Product details:', JSON.stringify(product, null, 2));
      
      await expect(productItem.locator('label')).toContainText(product.name);
      await expect(productItem.locator('label')).toContainText(product.price.toString());
    });
  }
});
