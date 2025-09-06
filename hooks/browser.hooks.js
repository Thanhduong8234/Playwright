/**
 * BROWSER HOOKS FOR CUCUMBER
 * Quản lý lifecycle của browser trong Cucumber tests
 */

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// ===== GLOBAL SETUP/TEARDOWN =====

BeforeAll(async function() {
  console.log('🚀 === CUCUMBER TEST SUITE STARTED ===');
  console.log(`📅 Test run started at: ${new Date().toISOString()}`);
  
  // Tạo thư mục reports nếu chưa có
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Tạo thư mục screenshots nếu chưa có  
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});

AfterAll(async function() {
  console.log('✅ === CUCUMBER TEST SUITE COMPLETED ===');
  console.log(`📅 Test run ended at: ${new Date().toISOString()}`);
});

// ===== SCENARIO HOOKS =====

Before(async function(scenario) {
  console.log(`\n🧪 Starting scenario: "${scenario.pickle.name}"`);
  console.log(`📂 Feature: ${scenario.gherkinDocument.feature.name}`);
  
  // Initialize browser cho mỗi scenario
  await this.initializeBrowser();
  
  // Log scenario info
  this.scenarioName = scenario.pickle.name;
  this.featureName = scenario.gherkinDocument.feature.name;
  this.startTime = Date.now();
});

After(async function(scenario) {
  const duration = Date.now() - this.startTime;
  console.log(`⏱️  Scenario duration: ${duration}ms`);
  
  // Take screenshot if scenario failed
  if (scenario.result.status === 'FAILED') {
    console.log('❌ Scenario failed - taking screenshot...');
    try {
      const screenshotPath = await this.takeScreenshot(`failed-${this.scenarioName.replace(/\s+/g, '-').toLowerCase()}`);
      
      // Attach screenshot to report (nếu sử dụng cucumber reporter hỗ trợ)
      if (screenshotPath && this.attach) {
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png');
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  } else {
    console.log('✅ Scenario passed successfully');
  }
  
  // Đóng browser sau mỗi scenario
  await this.closeBrowser();
  console.log(`🏁 Completed scenario: "${scenario.pickle.name}"`);
});

// ===== TAG-BASED HOOKS =====

// Hook for @slow tests - increase timeout
Before({ tags: '@slow' }, async function() {
  console.log('⏰ Slow test detected - increasing timeout');
  if (this.page) {
    this.page.setDefaultTimeout(120000); // 2 minutes
  }
});

// Hook for @headless tests - force headless mode
Before({ tags: '@headless' }, async function() {
  console.log('👻 Headless mode enforced for this scenario');
  this.config.headless = true;
});

// Hook for @headed tests - force headed mode  
Before({ tags: '@headed' }, async function() {
  console.log('👀 Headed mode enforced for this scenario');
  this.config.headless = false;
});

// Hook for @screenshot tests - take screenshot at end
After({ tags: '@screenshot' }, async function(scenario) {
  console.log('📸 Taking screenshot for @screenshot tagged test');
  await this.takeScreenshot(`${this.scenarioName.replace(/\s+/g, '-').toLowerCase()}`);
});

// ===== ERROR HANDLING HOOKS =====

Before(async function() {
  // Set up error handling
  this.errors = [];
  this.warnings = [];
});

After(async function(scenario) {
  // Log any accumulated errors/warnings
  if (this.errors.length > 0) {
    console.log('❌ Errors encountered during scenario:');
    this.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (this.warnings.length > 0) {
    console.log('⚠️  Warnings during scenario:');
    this.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
});
