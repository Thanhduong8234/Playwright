/**
 * TEST HELPERS
 * Utility functions to support testing
 */

class TestHelpers {
  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   * @param {string} domain - Email domain (default: example.com)
   * @returns {string} Random email
   */
  static generateRandomEmail(domain = 'example.com') {
    const username = this.generateRandomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   * @param {string} prefix - Phone number prefix
   * @returns {string} Random phone number
   */
  static generateRandomPhone(prefix = '+84') {
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${prefix}${number}`;
  }

  /**
   * Generate fake user data
   * @returns {Object} User data object
   */
  static generateFakeUser() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const middleNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    
    return {
      firstName,
      lastName,
      middleName,
      fullName: `${firstName} ${lastName} ${middleName}`,
      email: this.generateRandomEmail(),
      phone: this.generateRandomPhone(),
      password: this.generateRandomString(12),
      username: this.generateRandomString(8).toLowerCase()
    };
  }

  /**
   * Wait for specific amount of time
   * @param {number} ms - Milliseconds to wait
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry function until success or max attempts
   * @param {Function} fn - Function to retry
   * @param {number} maxAttempts - Maximum retry attempts
   * @param {number} delay - Delay between attempts (ms)
   * @returns {Promise<any>} Result of successful function call
   */
  static async retry(fn, maxAttempts = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await this.wait(delay);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, currency = 'VND', locale = 'vi-VN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Parse price from string
   * @param {string} priceText - Price text to parse
   * @returns {number} Parsed price number
   */
  static parsePrice(priceText) {
    if (!priceText) return 0;
    
    // Remove currency symbols và non-numeric characters except dot and comma
    const cleanPrice = priceText.replace(/[^\d.,]/g, '');
    
    // Handle different decimal separators
    let normalizedPrice;
    if (cleanPrice.includes(',') && cleanPrice.includes('.')) {
      // Both comma and dot present, assume comma is thousands separator
      normalizedPrice = cleanPrice.replace(/,/g, '');
    } else if (cleanPrice.includes(',')) {
      // Only comma, could be decimal separator (European style)
      normalizedPrice = cleanPrice.replace(',', '.');
    } else {
      normalizedPrice = cleanPrice;
    }
    
    return parseFloat(normalizedPrice) || 0;
  }

  /**
   * Get current timestamp
   * @param {boolean} includeTime - Include time in timestamp
   * @returns {string} Timestamp string
   */
  static getTimestamp(includeTime = true) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    
    if (includeTime) {
      const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      return `${date}_${time}`;
    }
    
    return date;
  }

  /**
   * Generate test data for different scenarios
   * @param {string} scenario - Test scenario type
   * @returns {Object} Test data for scenario
   */
  static generateTestData(scenario) {
    switch (scenario) {
      case 'valid_user':
        return {
          ...this.generateFakeUser(),
          isValid: true,
          expectedResult: 'success'
        };
        
      case 'invalid_email':
        return {
          ...this.generateFakeUser(),
          email: 'invalid-email',
          isValid: false,
          expectedResult: 'error',
          expectedError: 'Invalid email format'
        };
        
      case 'weak_password':
        return {
          ...this.generateFakeUser(),
          password: '123',
          isValid: false,
          expectedResult: 'error',
          expectedError: 'Password too weak'
        };
        
      case 'empty_data':
        return {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          isValid: false,
          expectedResult: 'error',
          expectedError: 'Required fields missing'
        };
        
      default:
        return this.generateFakeUser();
    }
  }

  /**
   * Compare two objects for testing
   * @param {Object} actual - Actual object
   * @param {Object} expected - Expected object
   * @param {string[]} ignoreKeys - Keys to ignore in comparison
   * @returns {boolean} True if objects match
   */
  static compareObjects(actual, expected, ignoreKeys = []) {
    const actualFiltered = this.filterObjectKeys(actual, ignoreKeys);
    const expectedFiltered = this.filterObjectKeys(expected, ignoreKeys);
    
    return JSON.stringify(actualFiltered) === JSON.stringify(expectedFiltered);
  }

  /**
   * Filter object keys
   * @param {Object} obj - Object to filter
   * @param {string[]} keysToRemove - Keys to remove
   * @returns {Object} Filtered object
   */
  static filterObjectKeys(obj, keysToRemove) {
    const filtered = { ...obj };
    keysToRemove.forEach(key => delete filtered[key]);
    return filtered;
  }

  /**
   * Create screenshot filename
   * @param {string} testName - Test name
   * @param {string} browser - Browser name
   * @param {string} status - Test status (passed/failed)
   * @returns {string} Screenshot filename
   */
  static createScreenshotFilename(testName, browser = 'unknown', status = 'capture') {
    const timestamp = this.getTimestamp();
    const sanitizedTestName = testName.replace(/[^a-zA-Z0-9]/g, '-');
    return `${sanitizedTestName}-${browser}-${status}-${timestamp}.png`;
  }

  /**
   * Log test info
   * @param {string} message - Log message
   * @param {string} level - Log level (info, warn, error)
   */
  static log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Generate random product data
   * @returns {Object} Product data
   */
  static generateFakeProduct() {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'];
    const adjectives = ['Amazing', 'Premium', 'Professional', 'Deluxe', 'Ultimate', 'Advanced'];
    const nouns = ['Phone', 'Laptop', 'Shirt', 'Shoes', 'Camera', 'Watch'];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return {
      id: Math.floor(Math.random() * 10000),
      name: `${brand} ${adjective} ${noun}`,
      category,
      brand,
      price: Math.floor(Math.random() * 2000) + 50,
      originalPrice: Math.floor(Math.random() * 2500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      reviewCount: Math.floor(Math.random() * 1000),
      inStock: Math.random() > 0.1, // 90% chance in stock
      quantity: Math.floor(Math.random() * 100) + 1,
      description: `This is a high-quality ${adjective.toLowerCase()} ${noun.toLowerCase()} from ${brand}.`,
      tags: [category.toLowerCase(), brand.toLowerCase(), adjective.toLowerCase()],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone to validate
   * @returns {boolean} True if phone is valid
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Create test environment info
   * @param {Object} browserInfo - Browser information
   * @returns {Object} Environment info
   */
  static createEnvironmentInfo(browserInfo = {}) {
    return {
      timestamp: new Date().toISOString(),
      browser: browserInfo.name || 'unknown',
      browserVersion: browserInfo.version || 'unknown',
      os: process.platform,
      nodeVersion: process.version,
      testFramework: 'Playwright'
    };
  }
}

module.exports = TestHelpers;
