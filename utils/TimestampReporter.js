/**
 * Custom Playwright Reporter với timestamp prefix
 * Tự động tạo multiple report files mà không cần thêm code vào test
 */

const fs = require('fs');
const path = require('path');

class TimestampReporter {
  constructor(options = {}) {
    this.baseOutputDir = options.outputDir || 'playwright-report';
    this.timestamp = this.generateTimestamp();
    this.dateFolder = this.generateDateFolder();
    this.outputDir = path.join(this.baseOutputDir, this.dateFolder);
    this.testResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Tạo timestamp cho report
   * @returns {string} Timestamp dạng YYYY-MM-DD_HH-MM-SS
   */
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  /**
   * Tạo folder theo ngày
   * @returns {string} Date folder dạng YYYY-MM-DD
   */
  generateDateFolder() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Tạo thư mục output nếu chưa tồn tại
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Được gọi khi bắt đầu test suite
   */
  onBegin(config, suite) {
    this.startTime = new Date();
    this.ensureOutputDir();
  }

  /**
   * Được gọi khi một test kết thúc
   */
  onTestEnd(test, result) {
    const testData = {
      title: test.title,
      file: test.location.file,
      line: test.location.line,
      column: test.location.column,
      status: result.status,
      duration: result.duration,
      error: result.error?.message || null,
      retries: result.retry,
      startTime: result.startTime,
      attachments: result.attachments.map(att => ({
        name: att.name,
        contentType: att.contentType,
        path: att.path
      }))
    };

    this.testResults.push(testData);
  }

  /**
   * Được gọi khi test suite kết thúc
   */
  onEnd(result) {
    this.endTime = new Date();
    const duration = this.endTime - this.startTime;

    // Tạo summary data
    const summary = {
      timestamp: this.timestamp,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      duration: duration,
      status: result.status,
      total: this.testResults.length,
      passed: this.testResults.filter(t => t.status === 'passed').length,
      failed: this.testResults.filter(t => t.status === 'failed').length,
      skipped: this.testResults.filter(t => t.status === 'skipped').length,
      timedOut: this.testResults.filter(t => t.status === 'timedOut').length,
      interrupted: this.testResults.filter(t => t.status === 'interrupted').length,
      tests: this.testResults
    };

    // Chỉ tạo HTML report
    this.createHtmlReport(summary);
  }



  /**
   * Tạo HTML report
   */
  createHtmlReport(summary) {
    const filename = `${this.timestamp}_test-results.html`;
    const filepath = path.join(this.outputDir, filename);

    const passRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(2) : 0;
    const statusColor = summary.passed === summary.total ? 'green' : summary.failed > 0 ? 'red' : 'orange';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results - ${this.timestamp}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .stat-card.passed { border-left-color: #28a745; }
        .stat-card.failed { border-left-color: #dc3545; }
        .stat-card.skipped { border-left-color: #ffc107; }
        .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #6c757d; text-transform: uppercase; font-size: 0.9em; }
        .test-list { margin-top: 20px; }
        .test-item { background: white; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
        .test-header { padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .test-header:hover { background: #f8f9fa; }
        .test-title { font-weight: 600; }
        .test-status { padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .status-skipped { background: #fff3cd; color: #856404; }
        .test-details { padding: 15px; border-top: 1px solid #dee2e6; background: #f8f9fa; display: none; }
        .test-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px; }
        .meta-item { font-size: 0.9em; }
        .meta-label { font-weight: bold; color: #495057; }
        .error-details { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 10px; margin-top: 10px; font-family: monospace; font-size: 0.9em; color: #721c24; }
        .toggle-icon { transition: transform 0.3s; }
        .expanded .toggle-icon { transform: rotate(90deg); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Results Report</h1>
            <p>Generated: ${new Date(summary.endTime).toLocaleString()}</p>
            <p>Timestamp: ${this.timestamp}</p>
        </div>

        <div class="summary">
            <div class="stat-card">
                <div class="stat-number" style="color: ${statusColor};">${passRate}%</div>
                <div class="stat-label">Pass Rate</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-number" style="color: #28a745;">${summary.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-number" style="color: #dc3545;">${summary.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card skipped">
                <div class="stat-number" style="color: #ffc107;">${summary.skipped}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${(summary.duration / 1000).toFixed(2)}s</div>
                <div class="stat-label">Duration</div>
            </div>
        </div>

        <div class="test-list">
            <h2>📋 Test Details</h2>
            ${summary.tests.map((test, index) => `
                <div class="test-item">
                    <div class="test-header" onclick="toggleTest(${index})">
                        <div>
                            <div class="test-title">${test.title}</div>
                            <small style="color: #6c757d;">${path.basename(test.file)}</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="test-status status-${test.status}">${test.status}</span>
                            <span class="toggle-icon">▶</span>
                        </div>
                    </div>
                    <div class="test-details" id="test-${index}">
                        <div class="test-meta">
                            <div class="meta-item">
                                <span class="meta-label">File:</span> ${test.file}
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Duration:</span> ${test.duration}ms
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Retries:</span> ${test.retries}
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Line:</span> ${test.line}:${test.column}
                            </div>
                        </div>
                        ${test.error ? `<div class="error-details"><strong>Error:</strong><br>${test.error}</div>` : ''}
                        ${test.attachments.length > 0 ? `
                            <div><strong>Attachments:</strong></div>
                            <ul>
                                ${test.attachments.map(att => `<li>${att.name} (${att.contentType})</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        function toggleTest(index) {
            const details = document.getElementById('test-' + index);
            const header = details.previousElementSibling;
            const icon = header.querySelector('.toggle-icon');
            
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                header.classList.add('expanded');
            } else {
                details.style.display = 'none';
                header.classList.remove('expanded');
            }
        }
    </script>
</body>
</html>`;

    try {
      fs.writeFileSync(filepath, htmlContent, 'utf8');
      console.log(`🌐 HTML report: ${filename}`);
    } catch (error) {
      console.error(`❌ Error creating HTML report: ${error.message}`);
    }
  }


}

module.exports = TimestampReporter;
