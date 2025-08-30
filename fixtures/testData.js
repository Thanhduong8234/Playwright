/**
 * TEST DATA
 * Centralized test data for test cases
 */

const TestHelpers = require('../utils/TestHelpers');

class TestData {
  /**
   * User test data
   */
  static users = {
    validUser: {
      email: 'valid.user@example.com',
      password: 'ValidPassword123!',
      name: 'Nguyễn Văn A',
      phone: '+84901234567',
      expectedBehavior: 'valid_user'
    },
    
    invalidUser: {
      email: 'invalid@example.com',
      password: 'wrongpass',
      name: 'User Invalid',
      expectedBehavior: 'invalid_user'
    },
    
    adminUser: {
      email: 'admin@example.com',
      password: 'AdminPass123!',
      name: 'Admin User',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    },
    
    guestUser: {
      email: 'guest@example.com',
      password: 'GuestPass123!',
      name: 'Guest User',
      role: 'guest',
      permissions: ['read']
    },
    
    // Generate random user for testing
    generateRandomUser: () => TestHelpers.generateFakeUser()
  };

  /**
   * Product test data
   */
  static products = {
    electronics: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        brand: 'Apple',
        price: 1000,
        originalPrice: 1200,
        quantity: 2,
        inStock: true,
        rating: 4.8,
        description: 'Latest iPhone with advanced features'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        category: 'Electronics',
        brand: 'Samsung',
        price: 800,
        originalPrice: 900,
        quantity: 1,
        inStock: true,
        rating: 4.6,
        description: 'Flagship Samsung smartphone'
      },
      {
        id: 3,
        name: 'MacBook Pro M3',
        category: 'Electronics',
        brand: 'Apple',
        price: 2000,
        originalPrice: 2200,
        quantity: 1,
        inStock: false,
        rating: 4.9,
        description: 'Professional laptop with M3 chip'
      }
    ],
    
    clothing: [
      {
        id: 4,
        name: 'Nike Air Force 1',
        category: 'Clothing',
        brand: 'Nike',
        price: 120,
        originalPrice: 150,
        quantity: 1,
        inStock: true,
        rating: 4.5,
        sizes: ['US 8', 'US 9', 'US 10'],
        colors: ['White', 'Black', 'Red']
      },
      {
        id: 5,
        name: 'Adidas Hoodie',
        category: 'Clothing',
        brand: 'Adidas',
        price: 80,
        originalPrice: 100,
        quantity: 2,
        inStock: true,
        rating: 4.3,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Grey', 'Navy']
      }
    ],
    
    // Generate random product for testing
    generateRandomProduct: () => TestHelpers.generateFakeProduct()
  };

  /**
   * Shopping cart test data
   */
  static shoppingCart = {
    emptyCart: {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      isEmpty: true
    },
    
    singleItemCart: {
      items: [
        {
          productId: 1,
          name: 'iPhone 15 Pro',
          price: 1000,
          quantity: 1,
          total: 1000
        }
      ],
      subtotal: 1000,
      tax: 100,
      shipping: 20,
      total: 1120,
      isEmpty: false
    },
    
    multipleItemsCart: {
      items: [
        {
          productId: 1,
          name: 'iPhone 15 Pro',
          price: 1000,
          quantity: 2,
          total: 2000
        },
        {
          productId: 2,
          name: 'Samsung Galaxy S24',
          price: 800,
          quantity: 1,
          total: 800
        }
      ],
      subtotal: 2800,
      tax: 280,
      shipping: 20,
      total: 3100,
      isEmpty: false
    }
  };

  /**
   * Order test data
   */
  static orders = {
    validOrder: {
      customer: {
        name: 'Nguyễn Văn A',
        email: 'customer@example.com',
        phone: '+84901234567',
        address: {
          street: '123 Đường ABC',
          district: 'Quận 1',
          city: 'TP.HCM',
          zipCode: '70000',
          country: 'Vietnam'
        }
      },
      items: [
        {
          productId: 1,
          name: 'iPhone 15 Pro',
          price: 1000,
          quantity: 1
        }
      ],
      payment: {
        method: 'credit_card',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        cardHolder: 'NGUYEN VAN A'
      },
      shipping: {
        method: 'standard',
        cost: 20,
        estimatedDays: 3
      },
      total: 1120
    },
    
    invalidOrder: {
      customer: {
        name: '',
        email: 'invalid-email',
        phone: '123',
        address: {
          street: '',
          district: '',
          city: '',
          zipCode: '',
          country: ''
        }
      },
      items: [],
      payment: {
        method: 'credit_card',
        cardNumber: '1234',
        expiryDate: '13/99',
        cvv: '12',
        cardHolder: ''
      },
      total: 0
    }
  };

  /**
   * Form validation test data
   */
  static formValidation = {
    validInputs: {
      email: 'test@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      name: 'Nguyễn Văn A',
      phone: '+84901234567',
      website: 'https://example.com',
      age: 25,
      date: '2024-01-01'
    },
    
    invalidInputs: {
      email: [
        'invalid-email',
        'test@',
        '@example.com',
        'test.example.com',
        ''
      ],
      password: [
        '123',           // Too short
        'password',      // No uppercase/numbers
        'PASSWORD',      // No lowercase/numbers
        '12345678',      // No letters
        ''               // Empty
      ],
      phone: [
        '123',
        'not-a-phone',
        '+84-invalid',
        ''
      ],
      website: [
        'not-a-url',
        'http://',
        'example',
        ''
      ]
    }
  };

  /**
   * Search test data
   */
  static search = {
    validQueries: [
      'iPhone',
      'Samsung',
      'laptop',
      'phone',
      'electronics'
    ],
    
    invalidQueries: [
      '',
      '   ',
      'xyznotfound',
      '!@#$%^&*()',
      'a'.repeat(1000) // Very long query
    ],
    
    specialQueries: [
      'iPhone 15',           // Multi-word
      'price:100-500',       // With filter
      '"exact phrase"',      // Exact match
      'brand:Apple',         // Category search
      'Samsung OR iPhone'    // Boolean search
    ]
  };

  /**
   * API test data
   */
  static api = {
    endpoints: {
      auth: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh'
      },
      users: {
        list: '/api/users',
        create: '/api/users',
        get: '/api/users/:id',
        update: '/api/users/:id',
        delete: '/api/users/:id'
      },
      products: {
        list: '/api/products',
        create: '/api/products',
        get: '/api/products/:id',
        update: '/api/products/:id',
        delete: '/api/products/:id',
        search: '/api/products/search'
      }
    },
    
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Playwright-Test-Client'
    },
    
    responseStructures: {
      user: {
        id: 'number',
        name: 'string',
        email: 'string',
        role: 'string',
        createdAt: 'string'
      },
      
      product: {
        id: 'number',
        name: 'string',
        price: 'number',
        category: 'string',
        inStock: 'boolean'
      },
      
      order: {
        id: 'number',
        total: 'number',
        status: 'string',
        items: [{
          productId: 'number',
          quantity: 'number',
          price: 'number'
        }]
      }
    }
  };

  /**
   * File upload test data
   */
  static files = {
    validFiles: {
      textFile: {
        name: 'test.txt',
        content: 'This is a test file content',
        type: 'text/plain',
        size: 25
      },
      
      imageFile: {
        name: 'test.jpg',
        content: 'fake-image-data',
        type: 'image/jpeg',
        size: 1024
      },
      
      documentFile: {
        name: 'test.pdf',
        content: 'fake-pdf-data',
        type: 'application/pdf',
        size: 2048
      }
    },
    
    invalidFiles: {
      tooLarge: {
        name: 'large.txt',
        content: 'x'.repeat(10000000), // 10MB
        type: 'text/plain',
        size: 10000000
      },
      
      invalidType: {
        name: 'malware.exe',
        content: 'fake-executable-data',
        type: 'application/x-executable',
        size: 1024
      },
      
      emptyFile: {
        name: 'empty.txt',
        content: '',
        type: 'text/plain',
        size: 0
      }
    }
  };

  /**
   * Performance test data
   */
  static performance = {
    thresholds: {
      pageLoadTime: 3000,      // 3 seconds
      apiResponseTime: 1000,   // 1 second
      renderTime: 500,         // 0.5 seconds
      interactionTime: 100     // 0.1 seconds
    },
    
    loadTestScenarios: {
      light: {
        users: 10,
        duration: 60,    // seconds
        rampUp: 10       // seconds
      },
      
      medium: {
        users: 50,
        duration: 300,   // 5 minutes
        rampUp: 30       // seconds
      },
      
      heavy: {
        users: 200,
        duration: 600,   // 10 minutes
        rampUp: 60       // seconds
      }
    }
  };

  /**
   * Environment configuration
   */
  static environments = {
    development: {
      baseUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:3001/api',
      timeout: 30000
    },
    
    staging: {
      baseUrl: 'https://staging.example.com',
      apiUrl: 'https://api-staging.example.com',
      timeout: 30000
    },
    
    production: {
      baseUrl: 'https://example.com',
      apiUrl: 'https://api.example.com',
      timeout: 15000
    }
  };

  /**
   * Get test data by category
   * @param {string} category - Data category
   * @param {string} key - Specific data key
   * @returns {any} Test data
   */
  static getData(category, key = null) {
    const categoryData = this[category];
    
    if (!categoryData) {
      throw new Error(`Test data category '${category}' not found`);
    }
    
    if (key) {
      if (!(key in categoryData)) {
        throw new Error(`Test data key '${key}' not found in category '${category}'`);
      }
      return categoryData[key];
    }
    
    return categoryData;
  }

  /**
   * Generate dynamic test data
   * @param {string} type - Type of data to generate
   * @param {Object} options - Generation options
   * @returns {any} Generated test data
   */
  static generateData(type, options = {}) {
    switch (type) {
      case 'user':
        return TestHelpers.generateFakeUser();
      case 'product':
        return TestHelpers.generateFakeProduct();
      case 'email':
        return TestHelpers.generateRandomEmail(options.domain);
      case 'phone':
        return TestHelpers.generateRandomPhone(options.prefix);
      case 'string':
        return TestHelpers.generateRandomString(options.length);
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }
}

module.exports = TestData;
