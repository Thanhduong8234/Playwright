const { test: base, expect } = require('@playwright/test');
const PlaywrightHomePage = require('../pages/PlaywrightHomePage');
const TodoMVCPage = require('../pages/TodoMVCPage');
const LoginComponent = require('../components/LoginComponent');
const ShoppingCartComponent = require('../components/ShoppingCartComponent');
const TestHelpers = require('../utils/TestHelpers');
const ApiHelpers = require('../utils/ApiHelpers');
const TestData = require('./testData');

/**
 * PLAYWRIGHT FIXTURES - SIMPLIFIED VERSION
 * Tự động setup các objects cần thiết cho tests
 */

const test = base.extend({
  /**
   * Playwright Home Page fixture
   */
  playwrightHomePage: async ({ page }, use) => {
    const homePage = new PlaywrightHomePage(page);
    await use(homePage);
  },

  /**
   * TodoMVC Page fixture
   */
  todoMVCPage: async ({ page }, use) => {
    const todoPage = new TodoMVCPage(page);
    await use(todoPage);
  },

  /**
   * Login Component fixture
   */
  loginComponent: async ({ page }, use) => {
    const loginComponent = new LoginComponent(page);
    await use(loginComponent);
  },

  /**
   * Shopping Cart Component fixture
   */
  shoppingCartComponent: async ({ page }, use) => {
    const cartComponent = new ShoppingCartComponent(page);
    await use(cartComponent);
  },

  /**
   * Test Helpers fixture
   */
  testHelpers: async ({}, use) => {
    await use(TestHelpers);
  },

  /**
   * Test Data fixture
   */
  testData: async ({}, use) => {
    await use(TestData);
  },

  /**
   * API Helpers fixture
   */
  apiHelpers: async ({ page }, use) => {
    const networkMonitor = ApiHelpers.setupNetworkMonitoring(page);
    
    const helpers = {
      ...ApiHelpers,
      networkMonitor
    };
    
    await use(helpers);
  },

  /**
   * Authenticated user fixture
   */
  authenticatedUser: async ({ page, testData }, use) => {
    await ApiHelpers.setupAuthMock(page, {
      validCredentials: testData.users.validUser
    });

    const loginComponent = new LoginComponent(page);
    
    await use({
      user: testData.users.validUser,
      loginComponent
    });
  },

  /**
   * Shopping cart with items fixture
   */
  cartWithItems: async ({ page, testData }, use) => {
    const cartComponent = new ShoppingCartComponent(page);
    
    await page.route('**/api/cart**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(testData.shoppingCart.multipleItemsCart)
      });
    });
    
    await use({
      cart: cartComponent,
      cartData: testData.shoppingCart.multipleItemsCart
    });
  },

  /**
   * Performance monitoring fixture
   */
  performanceMonitor: async ({ page }, use) => {
    const performanceData = {
      startTime: Date.now(),
      metrics: [],
      
      recordMetric: (name, value, unit = 'ms') => {
        performanceData.metrics.push({
          name,
          value,
          unit,
          timestamp: Date.now()
        });
      },
      
      getPageMetrics: async () => {
        try {
          return await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (!navigation) return null;
            
            return {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
              memoryUsage: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
              } : null
            };
          });
        } catch (error) {
          return null;
        }
      },
      
      getSummary: () => {
        const endTime = Date.now();
        const totalTestTime = endTime - performanceData.startTime;
        
        return {
          totalTestTime,
          metrics: performanceData.metrics,
          summary: {
            totalMetrics: performanceData.metrics.length,
            averageValue: performanceData.metrics.length > 0 
              ? performanceData.metrics.reduce((sum, m) => sum + m.value, 0) / performanceData.metrics.length
              : 0
          }
        };
      }
    };

    await use(performanceData);
  },

  /**
   * File upload fixture
   */
  fileUpload: async ({ page }, use) => {
    const fs = require('fs');
    const path = require('path');
    
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const testFiles = {
      textFile: path.join(tempDir, 'test.txt'),
      imageFile: path.join(tempDir, 'test.jpg'),
      largeFile: path.join(tempDir, 'large.txt')
    };

    fs.writeFileSync(testFiles.textFile, 'Test file content');
    fs.writeFileSync(testFiles.imageFile, 'fake-image-data');
    fs.writeFileSync(testFiles.largeFile, 'x'.repeat(10000));

    await ApiHelpers.setupFileUploadMock(page);

    await use({
      files: testFiles,
      cleanup: () => {
        Object.values(testFiles).forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
        
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir);
        }
      }
    });
  },

  /**
   * Database fixture (mock)
   */
  database: async ({}, use) => {
    // Mock database operations
    const mockDatabase = {
      users: new Map(),
      products: new Map(),
      orders: new Map(),
      
      // CRUD operations
      insert: (table, id, data) => {
        if (!mockDatabase[table]) {
          mockDatabase[table] = new Map();
        }
        mockDatabase[table].set(id, { ...data, id, createdAt: new Date() });
        return { success: true, id };
      },
      
      findById: (table, id) => {
        return mockDatabase[table]?.get(id) || null;
      },
      
      findAll: (table) => {
        return Array.from(mockDatabase[table]?.values() || []);
      },
      
      update: (table, id, data) => {
        if (mockDatabase[table]?.has(id)) {
          const existing = mockDatabase[table].get(id);
          mockDatabase[table].set(id, { ...existing, ...data, updatedAt: new Date() });
          return { success: true };
        }
        return { success: false, error: 'Record not found' };
      },
      
      delete: (table, id) => {
        if (mockDatabase[table]?.has(id)) {
          mockDatabase[table].delete(id);
          return { success: true };
        }
        return { success: false, error: 'Record not found' };
      },
      
      clear: (table) => {
        if (mockDatabase[table]) {
          mockDatabase[table].clear();
        }
      },
      
      clearAll: () => {
        mockDatabase.users.clear();
        mockDatabase.products.clear();
        mockDatabase.orders.clear();
      }
    };

    await use(mockDatabase);
    
    // Cleanup after test
    mockDatabase.clearAll();
  },

  /**
   * Multi-browser fixture
   */
  multiBrowser: async ({ browser }, use) => {
    // Create multiple contexts for parallel testing
    const contexts = await Promise.all([
      browser.newContext({ userAgent: 'Chrome-Test' }),
      browser.newContext({ userAgent: 'Firefox-Test' }),
      browser.newContext({ userAgent: 'Safari-Test' })
    ]);

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    await use({
      contexts,
      pages,
      chrome: pages[0],
      firefox: pages[1],
      safari: pages[2]
    });

    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  },

  /**
   * Mobile device fixture
   */
  mobileDevice: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...require('@playwright/test').devices['iPhone 12'],
    });
    
    const page = await context.newPage();
    
    await use({ page, context });
    
    await context.close();
  }
});

module.exports = { test, expect };