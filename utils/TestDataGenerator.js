/**
 * Test Data Generator Utility
 * Chứa các helper functions để tạo dữ liệu duy nhất cho test
 */

class TestDataGenerator {
    /**
     * Tạo name duy nhất
     * @param {string} baseName - Tên cơ bản
     * @returns {string} Tên duy nhất với timestamp và random suffix
     */
    static generateUniqueName(baseName = 'John Doe') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseName} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Tạo email duy nhất
     * @param {string} baseEmail - Email cơ bản (không có @domain)
     * @param {string} domain - Domain email (mặc định: example.com)
     * @returns {string} Email duy nhất với timestamp và random suffix
     */
    static generateUniqueEmail(baseEmail = 'john.doe', domain = 'example.com') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseEmail}.${timestamp}.${randomSuffix}@${domain}`;
    }

    /**
     * Tạo subject duy nhất
     * @param {string} baseSubject - Subject cơ bản
     * @returns {string} Subject duy nhất với timestamp và random suffix
     */
    static generateUniqueSubject(baseSubject = 'Test Subject') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseSubject} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Tạo message duy nhất
     * @param {string} baseMessage - Message cơ bản
     * @returns {string} Message duy nhất với timestamp và random suffix
     */
    static generateUniqueMessage(baseMessage = 'This is a test message') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseMessage} - ${timestamp} - ${randomSuffix}`;
    }

    /**
     * Tạo phone number duy nhất
     * @param {string} basePhone - Số điện thoại cơ bản
     * @returns {string} Số điện thoại duy nhất với random suffix
     */
    static generateUniquePhone(basePhone = '0123456789') {
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${basePhone}${randomSuffix}`;
    }

    /**
     * Tạo username duy nhất
     * @param {string} baseUsername - Username cơ bản
     * @returns {string} Username duy nhất với timestamp và random suffix
     */
    static generateUniqueUsername(baseUsername = 'user') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseUsername}_${timestamp}_${randomSuffix}`;
    }

    /**
     * Tạo password duy nhất
     * @param {string} basePassword - Password cơ bản
     * @returns {string} Password duy nhất với random suffix
     */
    static generateUniquePassword(basePassword = 'password') {
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${basePassword}${randomSuffix}`;
    }

    /**
     * Tạo company name duy nhất
     * @param {string} baseCompany - Tên công ty cơ bản
     * @returns {string} Tên công ty duy nhất với timestamp và random suffix
     */
    static generateUniqueCompany(baseCompany = 'Test Company') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseCompany} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Tạo address duy nhất
     * @param {string} baseAddress - Địa chỉ cơ bản
     * @returns {string} Địa chỉ duy nhất với timestamp và random suffix
     */
    static generateUniqueAddress(baseAddress = '123 Test Street') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseAddress} ${timestamp} ${randomSuffix}`;
    }

    /**
     * Tạo city duy nhất
     * @param {string} baseCity - Tên thành phố cơ bản
     * @returns {string} Tên thành phố duy nhất với timestamp và random suffix
     */
    static generateUniqueCity(baseCity = 'Test City') {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `${baseCity} ${timestamp} ${randomSuffix}`;
    }
}

module.exports = TestDataGenerator;
