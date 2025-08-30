/**
 * API HELPERS
 * Utility functions for API testing
 */

class ApiHelpers {
  /**
   * Setup API mocking for common endpoints
   * @param {Page} page - Playwright page instance
   * @param {Object} mockConfig - Mock configuration
   */
  static async setupApiMocks(page, mockConfig = {}) {
    const defaultMocks = {
      // Authentication endpoints
      login: {
        url: '**/api/auth/login',
        response: {
          success: true,
          token: 'mock-jwt-token-12345',
          user: { id: 1, name: 'Test User', email: 'test@example.com' }
        }
      },
      
      // User endpoints
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
      
      // Product endpoints
      products: {
        url: '**/api/products**',
        response: {
          products: [
            { id: 1, name: 'iPhone 15 Pro', price: 1000, stock: 50, category: 'Electronics' },
            { id: 2, name: 'Samsung Galaxy S24', price: 800, stock: 30, category: 'Electronics' }
          ],
          total: 2
        }
      },
      
      // Order endpoints
      orders: {
        url: '**/api/orders**',
        response: {
          orders: [
            { id: 1, total: 150.00, status: 'completed', userId: 1 },
            { id: 2, total: 75.50, status: 'pending', userId: 2 }
          ],
          total: 2
        }
      }
    };

    // Merge with custom config
    const mocks = { ...defaultMocks, ...mockConfig };

    // Setup all mocks
    for (const [key, mock] of Object.entries(mocks)) {
      await page.route(mock.url, async route => {
        console.log(`🔄 Mocking API [${key}]: ${route.request().url()}`);
        
        await route.fulfill({
          status: mock.status || 200,
          contentType: 'application/json',
          headers: mock.headers || {},
          body: JSON.stringify(mock.response)
        });
      });
    }
  }

  /**
   * Setup authentication mock
   * @param {Page} page - Playwright page instance
   * @param {Object} authConfig - Authentication configuration
   */
  static async setupAuthMock(page, authConfig = {}) {
    const defaultConfig = {
      validCredentials: {
        email: 'user@example.com',
        password: 'password123'
      },
      validResponse: {
        success: true,
        token: 'mock-jwt-token-12345',
        user: { id: 1, name: 'Test User', email: 'user@example.com' }
      },
      invalidResponse: {
        success: false,
        message: 'Invalid credentials'
      }
    };

    const config = { ...defaultConfig, ...authConfig };

    await page.route('**/api/auth/login', async route => {
      const postData = route.request().postDataJSON();
      console.log('🔐 Login attempt for:', postData?.email);
      
      if (postData?.email === config.validCredentials.email && 
          postData?.password === config.validCredentials.password) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(config.validResponse)
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify(config.invalidResponse)
        });
      }
    });
  }

  /**
   * Setup file upload mock
   * @param {Page} page - Playwright page instance
   * @param {Object} uploadConfig - Upload configuration
   */
  static async setupFileUploadMock(page, uploadConfig = {}) {
    const defaultConfig = {
      url: '**/api/upload**',
      response: {
        success: true,
        fileId: 'mock-file-id-12345',
        message: 'File uploaded successfully'
      }
    };

    const config = { ...defaultConfig, ...uploadConfig };

    await page.route(config.url, async route => {
      const file = route.request().postDataBuffer();
      console.log('📤 File upload intercepted, size:', file?.length || 0, 'bytes');
      
      const response = {
        ...config.response,
        size: file?.length || 0,
        timestamp: new Date().toISOString()
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Setup file download mock
   * @param {Page} page - Playwright page instance
   * @param {Object} downloadConfig - Download configuration
   */
  static async setupFileDownloadMock(page, downloadConfig = {}) {
    const defaultConfig = {
      url: '**/api/download/**',
      content: 'Mock file content for testing\nLine 2\nLine 3',
      filename: 'test-download.txt',
      contentType: 'text/plain'
    };

    const config = { ...defaultConfig, ...downloadConfig };

    await page.route(config.url, async route => {
      console.log('📥 File download requested:', route.request().url());
      
      await route.fulfill({
        status: 200,
        contentType: config.contentType,
        headers: {
          'Content-Disposition': `attachment; filename="${config.filename}"`
        },
        body: config.content
      });
    });
  }

  /**
   * Monitor network requests and responses
   * @param {Page} page - Playwright page instance
   * @returns {Object} Network monitoring functions
   */
  static setupNetworkMonitoring(page) {
    const networkRequests = [];
    const networkResponses = [];
    const failedRequests = [];

    // Monitor requests
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
        headers: request.headers(),
        postData: request.postData()
      });
    });

    // Monitor responses
    page.on('response', response => {
      const request = response.request();
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: Date.now(),
        headers: response.headers(),
        method: request.method()
      });
    });

    // Monitor failed requests
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure(),
        timestamp: Date.now()
      });
    });

    return {
      getRequests: () => [...networkRequests],
      getResponses: () => [...networkResponses],
      getFailedRequests: () => [...failedRequests],
      
      getRequestsByUrl: (urlPattern) => {
        return networkRequests.filter(req => req.url.includes(urlPattern));
      },
      
      getResponsesByStatus: (statusCode) => {
        return networkResponses.filter(res => res.status === statusCode);
      },
      
      getApiCalls: () => {
        return networkRequests.filter(req => req.url.includes('/api/'));
      },
      
      getStatistics: () => {
        return {
          totalRequests: networkRequests.length,
          totalResponses: networkResponses.length,
          failedRequests: failedRequests.length,
          apiCalls: networkRequests.filter(req => req.url.includes('/api/')).length,
          successfulResponses: networkResponses.filter(res => res.status >= 200 && res.status < 300).length,
          errorResponses: networkResponses.filter(res => res.status >= 400).length
        };
      },
      
      clear: () => {
        networkRequests.length = 0;
        networkResponses.length = 0;
        failedRequests.length = 0;
      }
    };
  }

  /**
   * Setup API response delays for performance testing
   * @param {Page} page - Playwright page instance
   * @param {Object} delayConfig - Delay configuration
   */
  static async setupApiDelays(page, delayConfig = {}) {
    const defaultDelays = {
      'api/auth/login': 2000,    // 2 seconds
      'api/products': 1500,      // 1.5 seconds
      'api/orders': 1000,        // 1 second
      'api/users': 800           // 0.8 seconds
    };

    const delays = { ...defaultDelays, ...delayConfig };

    for (const [endpoint, delay] of Object.entries(delays)) {
      await page.route(`**/${endpoint}**`, async route => {
        console.log(`⏱️ Adding ${delay}ms delay to ${endpoint}`);
        
        // Add artificial delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Continue with original request
        await route.continue();
      });
    }
  }

  /**
   * Make API request using Playwright's request context
   * @param {APIRequestContext} request - Playwright request context
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  static async makeApiRequest(request, method, url, options = {}) {
    const startTime = Date.now();
    
    try {
      let response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await request.get(url, options);
          break;
        case 'POST':
          response = await request.post(url, options);
          break;
        case 'PUT':
          response = await request.put(url, options);
          break;
        case 'DELETE':
          response = await request.delete(url, options);
          break;
        case 'PATCH':
          response = await request.patch(url, options);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      const responseTime = Date.now() - startTime;
      const responseData = await response.json().catch(() => ({}));
      
      return {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        data: responseData,
        responseTime,
        url: response.url()
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: null,
        error: error.message,
        responseTime,
        url
      };
    }
  }

  /**
   * Validate API response structure
   * @param {Object} response - API response
   * @param {Object} expectedStructure - Expected structure
   * @returns {Object} Validation result
   */
  static validateApiResponse(response, expectedStructure) {
    const errors = [];
    
    function validateObject(obj, expected, path = '') {
      for (const [key, expectedType] of Object.entries(expected)) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj)) {
          errors.push(`Missing required field: ${fullPath}`);
          continue;
        }
        
        const actualValue = obj[key];
        const actualType = Array.isArray(actualValue) ? 'array' : typeof actualValue;
        
        if (typeof expectedType === 'string') {
          if (actualType !== expectedType) {
            errors.push(`Type mismatch at ${fullPath}: expected ${expectedType}, got ${actualType}`);
          }
        } else if (typeof expectedType === 'object' && !Array.isArray(expectedType)) {
          if (actualType === 'object' && actualValue !== null) {
            validateObject(actualValue, expectedType, fullPath);
          } else {
            errors.push(`Type mismatch at ${fullPath}: expected object, got ${actualType}`);
          }
        } else if (Array.isArray(expectedType) && expectedType.length === 1) {
          if (actualType === 'array') {
            actualValue.forEach((item, index) => {
              validateObject(item, expectedType[0], `${fullPath}[${index}]`);
            });
          } else {
            errors.push(`Type mismatch at ${fullPath}: expected array, got ${actualType}`);
          }
        }
      }
    }
    
    validateObject(response, expectedStructure);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create comprehensive API test report
   * @param {Array} testResults - Array of test results
   * @returns {Object} Test report
   */
  static createApiTestReport(testResults) {
    const report = {
      summary: {
        totalTests: testResults.length,
        passed: 0,
        failed: 0,
        averageResponseTime: 0,
        totalResponseTime: 0
      },
      details: [],
      statistics: {
        statusCodes: {},
        responseTimeRanges: {
          'under_500ms': 0,
          '500ms_to_1s': 0,
          '1s_to_2s': 0,
          'over_2s': 0
        }
      }
    };

    let totalResponseTime = 0;

    testResults.forEach(result => {
      // Count pass/fail
      if (result.status >= 200 && result.status < 300) {
        report.summary.passed++;
      } else {
        report.summary.failed++;
      }

      // Accumulate response times
      totalResponseTime += result.responseTime || 0;

      // Count status codes
      const statusCode = result.status.toString();
      report.statistics.statusCodes[statusCode] = 
        (report.statistics.statusCodes[statusCode] || 0) + 1;

      // Categorize response times
      const responseTime = result.responseTime || 0;
      if (responseTime < 500) {
        report.statistics.responseTimeRanges.under_500ms++;
      } else if (responseTime < 1000) {
        report.statistics.responseTimeRanges['500ms_to_1s']++;
      } else if (responseTime < 2000) {
        report.statistics.responseTimeRanges['1s_to_2s']++;
      } else {
        report.statistics.responseTimeRanges.over_2s++;
      }

      // Add to details
      report.details.push({
        url: result.url,
        method: result.method || 'GET',
        status: result.status,
        responseTime: result.responseTime,
        success: result.status >= 200 && result.status < 300,
        error: result.error || null
      });
    });

    report.summary.averageResponseTime = testResults.length > 0 
      ? Math.round(totalResponseTime / testResults.length) 
      : 0;
    report.summary.totalResponseTime = totalResponseTime;

    return report;
  }
}

module.exports = ApiHelpers;
