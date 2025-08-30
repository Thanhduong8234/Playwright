/**
 * Test Data Generator Utility
 * Contains helper functions to create unique test data
 */

class TestDataGenerator {
    /**
     * Generate unique name
     * @param {string} baseName - Base name
     * @returns {string} Unique name with timestamp and random suffix
     */
    static generateUniqueName(baseName = 'John Doe') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseName} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Generate unique email
     * @param {string} baseEmail - Base email (without @domain)
     * @param {string} domain - Email domain (default: example.com)
     * @returns {string} Unique email with timestamp and random suffix
     */
    static generateUniqueEmail(baseEmail = 'john.doe', domain = 'example.com') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseEmail}.${timestamp}.${randomSuffix}@${domain}`;
    }

    /**
     * Generate unique subject
     * @param {string} baseSubject - Base subject
     * @returns {string} Unique subject with timestamp and random suffix
     */
    static generateUniqueSubject(baseSubject = 'Test Subject') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseSubject} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Generate unique message
     * @param {string} baseMessage - Base message
     * @returns {string} Unique message with timestamp and random suffix
     */
    static generateUniqueMessage(baseMessage = 'This is a test message') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseMessage} - ${timestamp} - ${randomSuffix}`;
    }

    /**
     * Generate unique phone number
     * @param {string} basePhone - Base phone number
     * @returns {string} Unique phone number with random suffix
     */
    static generateUniquePhone(basePhone = '0123456789') {
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${basePhone}${randomSuffix}`;
    }

    /**
     * Generate unique username
     * @param {string} baseUsername - Base username
     * @returns {string} Unique username with timestamp and random suffix
     */
    static generateUniqueUsername(baseUsername = 'user') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseUsername}_${timestamp}_${randomSuffix}`;
    }

    /**
     * Generate unique password
     * @param {string} basePassword - Base password
     * @returns {string} Unique password with random suffix
     */
    static generateUniquePassword(basePassword = 'password') {
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${basePassword}${randomSuffix}`;
    }

    /**
     * Generate unique company name
     * @param {string} baseCompany - Base company name
     * @returns {string} Unique company name with timestamp and random suffix
     */
    static generateUniqueCompany(baseCompany = 'Test Company') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseCompany} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Generate unique address
     * @param {string} baseAddress - Base address
     * @returns {string} Unique address with timestamp and random suffix
     */
    static generateUniqueAddress(baseAddress = '123 Test Street') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseAddress} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Generate unique city
     * @param {string} baseCity - Base city name
     * @returns {string} Unique city with timestamp and random suffix
     */
    static generateUniqueCity(baseCity = 'Test City') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseCity} ${timestamp} ${randomSuffix}`;
    }
}

module.exports = TestDataGenerator;
