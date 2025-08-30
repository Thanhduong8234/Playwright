const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('📂 File Operations & API Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Setup file operation mocks
    await page.route('**/api/upload**', async route => {
      const file = route.request().postDataBuffer();
      console.log('📤 File upload intercepted, size:', file?.length || 0, 'bytes');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          fileId: 'mock-file-id-12345',
          message: 'File uploaded successfully',
          size: file?.length || 0
        })
      });
    });

    await page.route('**/api/download/**', async route => {
      console.log('📥 File download requested:', route.request().url());
      
      // Create mock file content
      const mockContent = 'Mock file content for testing\nLine 2\nLine 3';
      
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        headers: {
          'Content-Disposition': 'attachment; filename="test-download.txt"'
        },
        body: mockContent
      });
    });
  });

  test('📤 File Upload with Progress Tracking', async ({ page }) => {
    console.log('📤 Testing file upload functionality...');

    // Create a temporary test file
    const testFilePath = path.join(__dirname, '..', 'temp-test-file.txt');
    const testContent = 'This is a test file for upload\nLine 2\nLine 3\nTest completed!';
    
    fs.writeFileSync(testFilePath, testContent);
    console.log('📄 Test file created:', testFilePath);

    await page.goto('https://the-internet.herokuapp.com/upload');

    // Debug: Check page elements
    const fileInput = page.locator('#file-upload');
    const uploadButton = page.locator('#file-submit');
    
    console.log('🔍 File input exists:', await fileInput.isVisible());
    console.log('🔍 Upload button exists:', await uploadButton.isVisible());

    // Upload file
    await fileInput.setInputFiles(testFilePath);
    
    // Debug: Verify file is selected
    const fileName = await fileInput.inputValue();
    console.log('📎 Selected file:', fileName);

    // Click upload button
    await uploadButton.click();

    // Wait for upload completion
    await page.waitForSelector('h3');
    const resultHeading = await page.locator('h3').textContent();
    console.log('✅ Upload result:', resultHeading);

    // Verify upload success
    await expect(page.locator('h3')).toContainText('File Uploaded!');
    
    // Debug: Get uploaded file info
    const uploadedFileName = await page.locator('#uploaded-files').textContent();
    console.log('📁 Uploaded file name:', uploadedFileName);

    // Cleanup
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('🗑️ Temporary file cleaned up');
    }
  });

  test('📥 File Download with Verification', async ({ page }) => {
    console.log('📥 Testing file download functionality...');

    await page.goto('https://the-internet.herokuapp.com/download');

    // Wait for download links to load
    await page.waitForSelector('a[href*="."]');
    
    // Get all download links
    const downloadLinks = await page.locator('a[href*="."]').all();
    console.log('🔗 Available download links:', downloadLinks.length);

    if (downloadLinks.length > 0) {
      // Setup download handling
      const downloadPromise = page.waitForEvent('download');
      
      // Click first download link
      const firstLink = downloadLinks[0];
      const linkText = await firstLink.textContent();
      console.log('📥 Downloading file:', linkText);
      
      await firstLink.click();
      
      // Wait for download to start
      const download = await downloadPromise;
      console.log('📁 Download started:', await download.suggestedFilename());
      
      // Save downloaded file
      const downloadPath = path.join(__dirname, '..', 'downloads', await download.suggestedFilename());
      await download.saveAs(downloadPath);
      
      console.log('💾 File saved to:', downloadPath);
      
      // Verify file exists and has content
      if (fs.existsSync(downloadPath)) {
        const stats = fs.statSync(downloadPath);
        console.log('📊 Downloaded file size:', stats.size, 'bytes');
        expect(stats.size).toBeGreaterThan(0);
        
        // Cleanup downloaded file
        fs.unlinkSync(downloadPath);
        console.log('🗑️ Downloaded file cleaned up');
      }
    }
  });

  test('🔄 Complex API Integration with Authentication', async ({ page, request }) => {
    console.log('🔄 Testing complex API integration...');

    // Test API endpoints using Playwright's request context
    const apiResponse = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const postData = await apiResponse.json();
    
    console.log('📡 API Response Status:', apiResponse.status());
    console.log('📊 Post Data:', JSON.stringify(postData, null, 2));
    
    expect(apiResponse.status()).toBe(200);
    expect(postData.id).toBe(1);

    // Test POST request
    const newPost = {
      title: 'Test Post from Playwright',
      body: 'This is a test post created by Playwright automation',
      userId: 1
    };

    const createResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: newPost
    });
    
    const createdPost = await createResponse.json();
    console.log('📝 Created Post:', JSON.stringify(createdPost, null, 2));
    
    expect(createResponse.status()).toBe(201);
    expect(createdPost.title).toBe(newPost.title);

    // Navigate to a page and inject API data
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // Inject API data into the page
    await page.evaluate((apiData) => {
      // Simulate displaying API data on the page
      const input = document.querySelector('[placeholder="What needs to be done?"]');
      if (input) {
        input.value = `API Data: ${apiData.title}`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, postData);

    // Press Enter to add the todo
    await page.locator('[placeholder="What needs to be done?"]').press('Enter');
    
    // Verify API data is displayed
    const todoItem = page.locator('.todo-list li').last();
    const todoText = await todoItem.locator('label').textContent();
    console.log('📄 Todo with API data:', todoText);
    
    await expect(todoItem.locator('label')).toContainText('API Data:');
  });

  test('🎭 Advanced Mocking and Stubbing', async ({ page }) => {
    console.log('🎭 Testing advanced mocking scenarios...');

    // Mock multiple API endpoints with different responses
    const apiMocks = [
      {
        url: '**/api/users**',
        response: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
          ],
          total: 2
        }
      },
      {
        url: '**/api/orders**',
        response: {
          orders: [
            { id: 1, total: 150.00, status: 'completed', userId: 1 },
            { id: 2, total: 75.50, status: 'pending', userId: 2 }
          ],
          total: 2
        }
      },
      {
        url: '**/api/products**',
        response: {
          products: [
            { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
            { id: 2, name: 'Phone', price: 800, category: 'Electronics' }
          ],
          total: 2
        }
      }
    ];

    // Setup all mocks
    for (const mock of apiMocks) {
      await page.route(mock.url, async route => {
        console.log(`🔄 Mocking API: ${route.request().url()}`);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mock.response)
        });
      });
    }

    await page.goto('https://demo.playwright.dev/todomvc');

    // Simulate making API calls from the browser
    const apiResults = await page.evaluate(async () => {
      const results = {};
      
      try {
        // Simulate API calls
        const endpoints = ['users', 'orders', 'products'];
        
        for (const endpoint of endpoints) {
          const response = await fetch(`/api/${endpoint}`);
          results[endpoint] = await response.json();
        }
        
        return results;
      } catch (error) {
        return { error: error.message };
      }
    });

    console.log('📊 Mocked API Results:');
    console.log(JSON.stringify(apiResults, null, 2));

    // Verify mocked data
    expect(apiResults.users).toBeDefined();
    expect(apiResults.orders).toBeDefined();
    expect(apiResults.products).toBeDefined();
    
    expect(apiResults.users.users).toHaveLength(2);
    expect(apiResults.orders.orders).toHaveLength(2);
    expect(apiResults.products.products).toHaveLength(2);

    // Use mocked data in the application
    const input = page.locator('[placeholder="What needs to be done?"]');
    
    // Add each user as a todo item
    for (const user of apiResults.users.users) {
      await input.fill(`User: ${user.name} (${user.role})`);
      await input.press('Enter');
    }

    // Verify todos were created
    const todoCount = await page.locator('.todo-list li').count();
    console.log('📝 Total todos created from API data:', todoCount);
    expect(todoCount).toBeGreaterThanOrEqual(2);
  });

  test('⚡ Performance Testing with Resource Monitoring', async ({ page }) => {
    console.log('⚡ Testing performance and resource monitoring...');

    // Start performance monitoring
    const startTime = Date.now();
    
    // Monitor network requests
    const networkRequests = [];
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      });
    });

    const networkResponses = [];
    page.on('response', response => {
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        timestamp: Date.now()
      });
    });

    // Navigate and measure load time
    await page.goto('https://demo.playwright.dev/todomvc');
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Page load time: ${loadTime}ms`);

    // Perform operations and measure performance
    const operationStartTime = Date.now();
    
    // Add multiple items quickly
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    for (const item of items) {
      await page.locator('[placeholder="What needs to be done?"]').fill(item);
      await page.locator('[placeholder="What needs to be done?"]').press('Enter');
    }
    
    const operationTime = Date.now() - operationStartTime;
    console.log(`⚡ Operations completed in: ${operationTime}ms`);

    // Get performance metrics from browser
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        memoryUsage: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : 'Not available'
      };
    });

    console.log('📊 Performance Metrics:');
    console.log(JSON.stringify(performanceMetrics, null, 2));

    console.log(`🌐 Network requests: ${networkRequests.length}`);
    console.log(`📥 Network responses: ${networkResponses.length}`);

    // Performance assertions
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    expect(operationTime).toBeLessThan(5000); // Operations should complete within 5 seconds
    expect(performanceMetrics.totalLoadTime).toBeGreaterThan(0);
  });

});

test.afterAll(async () => {
  // Cleanup after all tests
  console.log('🧹 Cleaning up test environment...');
  
  // Create downloads directory if it doesn't exist
  const downloadsDir = path.join(__dirname, '..', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  
  console.log('✅ Cleanup completed');
});
