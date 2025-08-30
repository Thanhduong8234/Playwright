/**
 * PAGE URLS
 * Centralized URL management for test pages
 */

class PageUrls {
  /**
   * Base URLs for different environments
   */
  static baseUrls = {
    development: 'http://localhost:3000',
    staging: 'https://staging.example.com',
    production: 'https://example.com'
  };

  /**
   * Demo and test URLs
   */
  static demo = {
    playwright: 'https://playwright.dev/',
    todoMVC: 'https://demo.playwright.dev/todomvc',
    fileUpload: 'https://the-internet.herokuapp.com/upload',
    fileDownload: 'https://the-internet.herokuapp.com/download',
    login: 'https://the-internet.herokuapp.com/login',
    dragAndDrop: 'https://the-internet.herokuapp.com/drag_and_drop',
    dropdown: 'https://the-internet.herokuapp.com/dropdown',
    checkboxes: 'https://the-internet.herokuapp.com/checkboxes',
    frames: 'https://the-internet.herokuapp.com/frames',
    tables: 'https://the-internet.herokuapp.com/tables'
  };

  /**
   * API endpoints
   */
  static api = {
    jsonPlaceholder: {
      base: 'https://jsonplaceholder.typicode.com',
      posts: 'https://jsonplaceholder.typicode.com/posts',
      users: 'https://jsonplaceholder.typicode.com/users',
      comments: 'https://jsonplaceholder.typicode.com/comments'
    },
    
    restCountries: {
      base: 'https://restcountries.com/v3.1',
      all: 'https://restcountries.com/v3.1/all',
      byName: 'https://restcountries.com/v3.1/name'
    }
  };

  /**
   * E-commerce demo URLs
   */
  static ecommerce = {
    home: '/home',
    products: '/products',
    productDetail: '/products/:id',
    cart: '/cart',
    checkout: '/checkout',
    profile: '/profile',
    orders: '/orders',
    search: '/search'
  };

  /**
   * Authentication URLs
   */
  static auth = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    logout: '/logout',
    profile: '/profile'
  };

  /**
   * Admin URLs
   */
  static admin = {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    products: '/admin/products',
    orders: '/admin/orders',
    reports: '/admin/reports'
  };

  /**
   * Get URL for specific environment
   * @param {string} environment - Environment name
   * @param {string} path - Path to append
   * @returns {string} Complete URL
   */
  static getUrl(environment, path = '') {
    const baseUrl = this.baseUrls[environment];
    if (!baseUrl) {
      throw new Error(`Unknown environment: ${environment}`);
    }
    
    return path ? `${baseUrl}${path}` : baseUrl;
  }

  /**
   * Get demo URL
   * @param {string} page - Demo page name
   * @returns {string} Demo URL
   */
  static getDemoUrl(page) {
    const url = this.demo[page];
    if (!url) {
      throw new Error(`Unknown demo page: ${page}`);
    }
    
    return url;
  }

  /**
   * Get API URL
   * @param {string} service - API service name
   * @param {string} endpoint - Endpoint path
   * @returns {string} Complete API URL
   */
  static getApiUrl(service, endpoint = '') {
    const serviceConfig = this.api[service];
    if (!serviceConfig) {
      throw new Error(`Unknown API service: ${service}`);
    }
    
    const baseUrl = serviceConfig.base;
    return endpoint ? `${baseUrl}${endpoint}` : baseUrl;
  }

  /**
   * Build URL with parameters
   * @param {string} template - URL template with :param placeholders
   * @param {Object} params - Parameters to replace
   * @returns {string} URL with parameters replaced
   */
  static buildUrl(template, params = {}) {
    let url = template;
    
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    }
    
    return url;
  }

  /**
   * Add query parameters to URL
   * @param {string} url - Base URL
   * @param {Object} params - Query parameters
   * @returns {string} URL with query parameters
   */
  static addQueryParams(url, params = {}) {
    const urlObject = new URL(url);
    
    for (const [key, value] of Object.entries(params)) {
      urlObject.searchParams.set(key, value);
    }
    
    return urlObject.toString();
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all URLs for a category
   * @param {string} category - URL category
   * @returns {Object} URLs in category
   */
  static getCategory(category) {
    const categoryUrls = this[category];
    if (!categoryUrls) {
      throw new Error(`Unknown URL category: ${category}`);
    }
    
    return { ...categoryUrls };
  }

  /**
   * Get environment-specific URLs
   * @param {string} environment - Environment name
   * @returns {Object} All URLs for environment
   */
  static getEnvironmentUrls(environment) {
    const baseUrl = this.baseUrls[environment];
    if (!baseUrl) {
      throw new Error(`Unknown environment: ${environment}`);
    }
    
    return {
      base: baseUrl,
      ecommerce: Object.fromEntries(
        Object.entries(this.ecommerce).map(([key, path]) => [key, `${baseUrl}${path}`])
      ),
      auth: Object.fromEntries(
        Object.entries(this.auth).map(([key, path]) => [key, `${baseUrl}${path}`])
      ),
      admin: Object.fromEntries(
        Object.entries(this.admin).map(([key, path]) => [key, `${baseUrl}${path}`])
      )
    };
  }
}

module.exports = PageUrls;
