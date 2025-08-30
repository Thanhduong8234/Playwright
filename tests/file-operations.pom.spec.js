const { test, expect } = require('../fixtures/playwright.fixtures');

/**
 * FILE OPERATIONS TESTS - REFACTORED WITH PAGE OBJECT MODEL
 * Test suite cho file operations và API integration sử dụng POM pattern
 */

test.describe('📂 File Operations & API Integration Tests - POM Version', () => {

  test.beforeEach(async ({ apiHelpers, testData }) => {
    console.log('📤 Setting up file operations test environment with POM...');
    
    // Setup comprehensive file operation mocks
    await apiHelpers.setupFileUploadMock(apiHelpers.page, {
      response: {
        success: true,
        fileId: 'mock-file-id-12345',
        message: 'File uploaded successfully'
      }
    });

    await apiHelpers.setupFileDownloadMock(apiHelpers.page, {
      content: 'Mock file content for testing\nLine 2\nLine 3',
      filename: 'test-download.txt',
      contentType: 'text/plain'
    });
  });

  test('📤 File Upload with Progress Tracking using POM', async ({ 
    page,
    fileUpload,
    testHelpers,
    performanceMonitor,
    screenshot 
  }) => {
    testHelpers.log('📤 Testing file upload with POM and fixtures');

    const { files, cleanup } = fileUpload;
    
    try {
      // Navigate to upload page
      await page.goto('https://the-internet.herokuapp.com/upload');
      await screenshot.take('upload-page-loaded');

      // Verify upload elements exist
      const fileInput = page.locator('#file-upload');
      const uploadButton = page.locator('#file-submit');
      
      const inputVisible = await fileInput.isVisible();
      const buttonVisible = await uploadButton.isVisible();
      
      testHelpers.log(`🔍 File input visible: ${inputVisible}`);
      testHelpers.log(`🔍 Upload button visible: ${buttonVisible}`);
      
      expect(inputVisible).toBeTruthy();
      expect(buttonVisible).toBeTruthy();

      // Test upload performance
      const uploadStart = Date.now();
      
      // Upload file using fixture
      await fileInput.setInputFiles(files.textFile);
      
      // Verify file selection
      const fileName = await fileInput.inputValue();
      testHelpers.log(`📎 Selected file: ${fileName}`);
      expect(fileName).toContain('test.txt');

      // Submit upload
      await uploadButton.click();
      
      const uploadTime = Date.now() - uploadStart;
      performanceMonitor.recordMetric('file-upload', uploadTime);
      
      testHelpers.log(`⚡ Upload completed in: ${uploadTime}ms`);

      // Wait for upload completion
      await page.waitForSelector('h3');
      const resultHeading = await page.locator('h3').textContent();
      testHelpers.log(`✅ Upload result: ${resultHeading}`);

      // Verify upload success
      await expect(page.locator('h3')).toContainText('File Uploaded!');
      
      // Get uploaded file info
      const uploadedFileName = await page.locator('#uploaded-files').textContent();
      testHelpers.log(`📁 Uploaded file name: ${uploadedFileName}`);
      expect(uploadedFileName).toContain('test.txt');

      await screenshot.take('upload-success');

    } finally {
      // Cleanup files using fixture
      cleanup();
      testHelpers.log('🗑️ File cleanup completed');
    }
  });

  test('📥 File Download with Verification using POM', async ({ 
    page,
    testHelpers,
    performanceMonitor 
  }) => {
    testHelpers.log('📥 Testing file download with POM');

    await page.goto('https://the-internet.herokuapp.com/download');

    // Wait for download links to load
    await page.waitForSelector('a[href*="."]');
    
    // Get download links count
    const downloadLinksCount = await page.locator('a[href*="."]').count();
    testHelpers.log(`🔗 Available download links: ${downloadLinksCount}`);
    expect(downloadLinksCount).toBeGreaterThan(0);

    if (downloadLinksCount > 0) {
      // Setup download handling
      const downloadPromise = page.waitForEvent('download');
      
      // Get first download link info
      const firstLink = page.locator('a[href*="."]').first();
      const linkText = await firstLink.textContent();
      testHelpers.log(`📥 Downloading file: ${linkText}`);
      
      // Measure download performance
      const downloadStart = Date.now();
      await firstLink.click();
      
      // Wait for download to start
      const download = await downloadPromise;
      const downloadTime = Date.now() - downloadStart;
      
      performanceMonitor.recordMetric('download-start', downloadTime);
      testHelpers.log(`📁 Download started: ${await download.suggestedFilename()}`);
      testHelpers.log(`⚡ Download initiated in: ${downloadTime}ms`);
      
      // Verify download properties
      const suggestedFilename = await download.suggestedFilename();
      expect(suggestedFilename).toBeTruthy();
      expect(suggestedFilename.length).toBeGreaterThan(0);
      
      // Note: We don't actually save the file to avoid filesystem operations
      testHelpers.log(`✅ Download verification completed for: ${suggestedFilename}`);
    }
  });

  test('🔄 Complex API Integration with Authentication using POM', async ({ 
    request,
    testHelpers,
    performanceMonitor,
    apiHelpers 
  }) => {
    testHelpers.log('🔄 Testing complex API integration with POM');

    // Test GET request with performance monitoring
    const getStart = Date.now();
    const apiResponse = await apiHelpers.makeApiRequest(
      request, 
      'GET', 
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    const getTime = Date.now() - getStart;
    
    performanceMonitor.recordMetric('api-get-request', getTime);
    testHelpers.log(`📡 GET API Response: ${JSON.stringify(apiResponse, null, 2)}`);
    
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.data.id).toBe(1);
    testHelpers.log(`⚡ GET request completed in: ${apiResponse.responseTime}ms`);

    // Test POST request
    const newPost = {
      title: 'Test Post from Playwright POM',
      body: 'This is a test post created by Playwright automation using POM',
      userId: 1
    };

    const postStart = Date.now();
    const createResponse = await apiHelpers.makeApiRequest(
      request,
      'POST',
      'https://jsonplaceholder.typicode.com/posts',
      { data: newPost }
    );
    const postTime = Date.now() - postStart;
    
    performanceMonitor.recordMetric('api-post-request', postTime);
    testHelpers.log(`📝 POST API Response: ${JSON.stringify(createResponse, null, 2)}`);
    
    expect(createResponse.status).toBe(201);
    expect(createResponse.data.title).toBe(newPost.title);
    testHelpers.log(`⚡ POST request completed in: ${createResponse.responseTime}ms`);

    // Validate API response structure
    const validation = apiHelpers.validateApiResponse(createResponse.data, {
      id: 'number',
      title: 'string',
      body: 'string',
      userId: 'number'
    });
    
    testHelpers.log(`✅ API validation: ${JSON.stringify(validation)}`);
    expect(validation.isValid).toBeTruthy();
    
    if (!validation.isValid) {
      testHelpers.log(`❌ Validation errors: ${validation.errors.join(', ')}`, 'error');
    }

    // Create API test report
    const testResults = [apiResponse, createResponse];
    const report = apiHelpers.createApiTestReport(testResults);
    testHelpers.log(`📊 API Test Report: ${JSON.stringify(report, null, 2)}`);
    
    expect(report.summary.passed).toBe(2);
    expect(report.summary.failed).toBe(0);
  });

  test('🎭 Advanced Mocking and Stubbing with POM', async ({ 
    page,
    todoMVCPage,
    testHelpers,
    apiHelpers 
  }) => {
    testHelpers.log('🎭 Testing advanced mocking with POM');

    // Setup comprehensive API mocks
    const mockConfigs = {
      users: {
        url: '**/api/users**',
        response: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
          ],
          total: 2
        }
      },
      
      orders: {
        url: '**/api/orders**',
        response: {
          orders: [
            { id: 1, total: 150.00, status: 'completed', userId: 1 },
            { id: 2, total: 75.50, status: 'pending', userId: 2 }
          ],
          total: 2
        }
      },
      
      products: {
        url: '**/api/products**',
        response: {
          products: [
            { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
            { id: 2, name: 'Phone', price: 800, category: 'Electronics' }
          ],
          total: 2
        }
      }
    };

    await apiHelpers.setupApiMocks(page, mockConfigs);
    await todoMVCPage.navigate();

    // Simulate making API calls and displaying results
    const apiResults = await page.evaluate(async () => {
      const results = {};
      
      try {
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

    testHelpers.log(`📊 Mocked API Results: ${JSON.stringify(apiResults, null, 2)}`);

    // Verify mocked data structure
    expect(apiResults.users).toBeDefined();
    expect(apiResults.orders).toBeDefined();
    expect(apiResults.products).toBeDefined();
    
    expect(apiResults.users.users).toHaveLength(2);
    expect(apiResults.orders.orders).toHaveLength(2);
    expect(apiResults.products.products).toHaveLength(2);

    // Use mocked data in TodoMVC interface (simulation)
    for (const user of apiResults.users.users) {
      await todoMVCPage.addTodo(`User: ${user.name} (${user.role})`);
      testHelpers.log(`➕ Added user todo: ${user.name}`);
    }

    // Verify todos were created from mocked data
    const todoCount = await todoMVCPage.getTodoCount();
    testHelpers.log(`📝 Total todos from mocked data: ${todoCount}`);
    expect(todoCount).toBe(2);

    const todoTexts = await todoMVCPage.getTodoTexts();
    expect(todoTexts[0]).toContain('John Doe');
    expect(todoTexts[1]).toContain('Jane Smith');
  });

  test('⚡ Performance Testing with Resource Monitoring using POM', async ({ 
    page,
    todoMVCPage,
    testHelpers,
    performanceMonitor,
    apiHelpers 
  }) => {
    testHelpers.log('⚡ Testing performance with comprehensive monitoring using POM');

    const { networkMonitor } = apiHelpers;
    
    // Clear previous network data
    networkMonitor.clear();

    // Start comprehensive monitoring
    const testStart = Date.now();
    
    // Monitor page load performance
    const loadStart = Date.now();
    await todoMVCPage.navigate();
    const loadTime = Date.now() - loadStart;
    
    performanceMonitor.recordMetric('page-load-time', loadTime);
    testHelpers.log(`⏱️ Page load time: ${loadTime}ms`);

    // Perform multiple operations and measure performance
    const operationStart = Date.now();
    const operations = [];
    
    for (let i = 1; i <= 10; i++) {
      operations.push(todoMVCPage.addTodo(`Performance Item ${i}`));
    }
    
    await Promise.all(operations);
    const operationTime = Date.now() - operationStart;
    
    performanceMonitor.recordMetric('batch-operations', operationTime);
    testHelpers.log(`⚡ Batch operations time: ${operationTime}ms`);

    // Get browser performance metrics
    const browserMetrics = await performanceMonitor.getPageMetrics();
    testHelpers.log(`🌐 Browser metrics: ${JSON.stringify(browserMetrics, null, 2)}`);

    // Get network statistics
    const networkStats = networkMonitor.getStatistics();
    testHelpers.log(`📡 Network statistics: ${JSON.stringify(networkStats, null, 2)}`);

    // Test individual operation performance
    const singleOpStart = Date.now();
    await todoMVCPage.addTodo('Single Operation Test');
    const singleOpTime = Date.now() - singleOpStart;
    
    performanceMonitor.recordMetric('single-operation', singleOpTime);
    testHelpers.log(`🎯 Single operation time: ${singleOpTime}ms`);

    // Verify all operations completed successfully
    const finalTodoCount = await todoMVCPage.getTodoCount();
    expect(finalTodoCount).toBe(11); // 10 batch + 1 single

    // Performance assertions
    expect(loadTime).toBeLessThan(10000); // Page load under 10s
    expect(operationTime).toBeLessThan(5000); // Batch operations under 5s
    expect(singleOpTime).toBeLessThan(1000); // Single operation under 1s
    
    // Browser metrics assertions
    if (browserMetrics.totalLoadTime) {
      expect(browserMetrics.totalLoadTime).toBeGreaterThan(0);
      expect(browserMetrics.totalLoadTime).toBeLessThan(15000);
    }

    // Get comprehensive performance summary
    const testEndTime = Date.now();
    const totalTestTime = testEndTime - testStart;
    
    const performanceSummary = {
      totalTestTime,
      metrics: performanceMonitor.getSummary(),
      browserMetrics,
      networkStats,
      thresholds: {
        pageLoadTime: loadTime < 10000,
        batchOperations: operationTime < 5000,
        singleOperation: singleOpTime < 1000,
        totalTestTime: totalTestTime < 30000
      }
    };

    testHelpers.log(`📊 Complete Performance Summary: ${JSON.stringify(performanceSummary, null, 2)}`);
    
    // All thresholds should pass
    Object.values(performanceSummary.thresholds).forEach(threshold => {
      expect(threshold).toBeTruthy();
    });
  });

  test('🔄 File Upload with Multiple Formats using POM', async ({ 
    page,
    fileUpload,
    testHelpers,
    testData 
  }) => {
    testHelpers.log('🔄 Testing multiple file format uploads with POM');

    const { files, cleanup } = fileUpload;
    
    try {
      await page.goto('https://the-internet.herokuapp.com/upload');

      const fileInput = page.locator('#file-upload');
      const uploadButton = page.locator('#file-submit');

      // Test different file types from fixtures
      const testFiles = [
        { path: files.textFile, name: 'text file', expectedSuccess: true },
        { path: files.imageFile, name: 'image file', expectedSuccess: true },
        { path: files.largeFile, name: 'large file', expectedSuccess: true }
      ];

      for (const file of testFiles) {
        testHelpers.log(`📤 Testing upload: ${file.name}`);
        
        // Upload file
        await fileInput.setInputFiles(file.path);
        const selectedFile = await fileInput.inputValue();
        testHelpers.log(`📎 Selected: ${selectedFile}`);
        
        await uploadButton.click();
        
        // Wait for result
        await page.waitForSelector('h3');
        const result = await page.locator('h3').textContent();
        
        if (file.expectedSuccess) {
          expect(result).toContain('File Uploaded!');
          testHelpers.log(`✅ ${file.name} uploaded successfully`);
        } else {
          testHelpers.log(`❌ ${file.name} upload failed as expected`);
        }
        
        // Navigate back for next test
        await page.goto('https://the-internet.herokuapp.com/upload');
      }

    } finally {
      cleanup();
      testHelpers.log('🗑️ All test files cleaned up');
    }
  });

});

test.afterAll(async () => {
  console.log('🧹 Cleaning up file operations POM tests...');
});
