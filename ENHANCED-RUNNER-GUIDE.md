# 🚀 Enhanced Test Runner Guide

## Tổng quan

Enhanced Test Runner là phiên bản cải tiến của test runner gốc với nhiều tính năng nâng cao:

- ✅ **Multi-language support** (English & Japanese)
- ✅ **Smart parallel execution** với auto-detection
- ✅ **Enhanced reporting** với timestamps và metrics
- ✅ **Advanced browser management** (Chromium, Chrome, Firefox, WebKit, Edge)
- ✅ **Environment management** (local, dev, staging, prod)
- ✅ **CI/CD integration** ready
- ✅ **Docker support**
- ✅ **Web dashboard** option
- ✅ **Performance monitoring**
- ✅ **Visual testing** capabilities

## 🎯 So sánh với Runner cũ

| Feature | Old Runner | Enhanced Runner |
|---------|------------|-----------------|
| Languages | Japanese only | English + Japanese |
| Browsers | Basic support | 5 browsers with configs |
| Parallel | Fixed count | Auto-optimized |
| Reporting | Basic HTML | Enhanced with metrics |
| Environments | Hardcoded | Configurable |
| Timeout handling | Issues | Robust handling |
| CI/CD | Limited | Full integration |
| Docker | No | Full support |
| Web UI | No | Optional dashboard |

## 🛠️ Cài đặt

### Cài đặt dependencies mới:
```bash
npm run setup:enhanced
```

### Hoặc cài đặt manual:
```bash
npm install chalk
```

## 📖 Cách sử dụng

### 1. Basic Usage

```bash
# Show help
npm run enhanced:help

# List available suites
npm run enhanced:list

# Show system info
npm run enhanced:system
```

### 2. Running Tests

```bash
# Smoke tests (recommended for quick feedback)
npm run enhanced:smoke

# Regression tests with parallel execution
npm run enhanced:regression

# E2E tests with Firefox
npm run enhanced:e2e

# Contact tests with screenshots
npm run enhanced:contact

# Performance tests with tracing
npm run enhanced:performance

# Interactive mode
npm run enhanced:interactive
```

### 3. Advanced Options

```bash
# Custom configuration
node enhanced-test-runner.js --suite smoke --browser chrome --environment staging --parallel 3 --headed

# With videos and traces
node enhanced-test-runner.js --suite regression --videos --trace --screenshots always

# Specific tags
node enhanced-test-runner.js --tags "@contact and not @slow" --browser firefox

# Dry run (show what would execute)
node enhanced-test-runner.js --suite e2e --dry-run
```

## 🎮 Interactive Mode

```bash
npm run enhanced:interactive
```

Interactive mode sẽ hướng dẫn bạn chọn:
- Test suite
- Browser
- Environment  
- Execution options
- Reporting preferences

## 🌐 Web Dashboard

### Start dashboard:
```bash
npm run dashboard
```

Truy cập: http://localhost:3001

Features:
- Real-time test execution monitoring
- Test history
- Interactive test configuration
- Live logs and results
- Report management

## 🐳 Docker Support

### Build container:
```bash
npm run docker:build
```

### Run tests in container:
```bash
npm run docker:run
```

### Full environment with dashboard:
```bash
npm run docker:compose
```

## 🔧 Configuration Options

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-l, --language` | Language (en\|jp) | en |
| `-s, --suite` | Test suite | - |
| `-b, --browser` | Browser | chromium |
| `-e, --environment` | Environment | prod |
| `--headed` | Show browser | false |
| `-p, --parallel` | Parallel count | auto |
| `--timeout` | Timeout (seconds) | 120 |
| `--retries` | Retry count | 1 |
| `--screenshots` | Screenshot mode | on-failure |
| `--videos` | Record videos | false |
| `--trace` | Enable tracing | false |

### Test Suites

| Suite | Priority | Est. Time | Description |
|-------|----------|-----------|-------------|
| smoke | 1 | 2-5 min | Basic functionality |
| contact | 2 | 5-10 min | Contact form tests |
| regression | 2 | 10-20 min | Full regression |
| e2e | 3 | 15-30 min | End-to-end tests |
| performance | 3 | 10-15 min | Performance tests |
| visual | 3 | 5-10 min | Visual regression |

### Browsers

| Browser | Description | Notes |
|---------|-------------|-------|
| chromium | Chromium (default) | Fast, reliable |
| chrome | Google Chrome | Real Chrome |
| firefox | Firefox | Good for compatibility |
| webkit | WebKit (Safari) | macOS/iOS testing |
| edge | Microsoft Edge | Windows testing |

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| local | http://localhost:3000 | Local development |
| dev | https://dev.automationexercise.com | Development |
| staging | https://staging.automationexercise.com | Pre-production |
| prod | https://automationexercise.com | Production |

## 📊 Enhanced Reporting

### Report Types

1. **HTML Report** - Visual test results
2. **JSON Report** - Machine-readable data
3. **Console Output** - Real-time feedback
4. **Screenshots** - Visual evidence
5. **Videos** - Test execution recordings
6. **Traces** - Detailed debugging info

### Report Locations

```
reports/
├── enhanced-report-[timestamp].html
├── enhanced-report-[timestamp].json
├── screenshots/
├── videos/
└── traces/
```

## 🚀 CI/CD Integration

### GitHub Actions

Copy `ci-cd/github-actions.yml` to `.github/workflows/tests.yml`

Features:
- Automatic test execution on push/PR
- Matrix testing (multiple browsers)
- Scheduled runs
- Performance monitoring
- Slack notifications
- PR comments with results

### Manual Trigger

```bash
# Trigger with specific options
gh workflow run tests.yml -f test_suite=smoke -f browser=chromium -f environment=staging
```

## 🔍 Troubleshooting

### Common Issues

1. **Timeout errors**
   ```bash
   # Increase timeout
   node enhanced-test-runner.js --suite smoke --timeout 180
   ```

2. **Browser not found**
   ```bash
   # Install browsers
   npx playwright install
   ```

3. **Memory issues**
   ```bash
   # Reduce parallel count
   node enhanced-test-runner.js --suite regression --parallel 1
   ```

4. **Network issues**
   ```bash
   # Use staging environment
   node enhanced-test-runner.js --suite smoke --environment staging
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* node enhanced-test-runner.js --suite smoke

# Trace mode for detailed debugging
node enhanced-test-runner.js --suite smoke --trace --headed
```

## 📈 Performance Tips

1. **Optimal Parallel Count**: Runner auto-detects based on system resources
2. **Browser Choice**: Chromium is fastest, Firefox for compatibility
3. **Environment**: Use staging for faster response times
4. **Screenshots**: Use 'on-failure' to save disk space
5. **Videos**: Only enable for debugging (large files)

## 🔮 Future Enhancements

- [ ] VS Code extension
- [ ] Slack/Teams integration
- [ ] Test scheduling
- [ ] AI-powered test analysis
- [ ] Mobile device testing
- [ ] API testing integration
- [ ] Load testing capabilities

## 🆘 Support

### Getting Help

```bash
# Show help
npm run enhanced:help

# System information
npm run enhanced:system

# List available options
npm run enhanced:list
```

### Reporting Issues

1. Run with `--dry-run` to see execution plan
2. Check system requirements
3. Verify browser installation
4. Review logs in reports directory
5. Create issue with full command and error output

## 📝 Migration Guide

### From Old Runner

1. **Install enhanced runner**:
   ```bash
   npm run setup:enhanced
   ```

2. **Update scripts**:
   - Old: `npm run test:run:smoke`
   - New: `npm run enhanced:smoke`

3. **New features to try**:
   - Interactive mode: `npm run enhanced:interactive`
   - System info: `npm run enhanced:system`
   - Web dashboard: `npm run dashboard`

### Backward Compatibility

Old runner vẫn hoạt động bình thường. Bạn có thể sử dụng cả hai:
- Old: `npm run test:run:smoke`
- New: `npm run enhanced:smoke`

## 🎉 Kết luận

Enhanced Test Runner cung cấp:
- **Hiệu suất tốt hơn** với smart parallel execution
- **Linh hoạt hơn** với multi-language và multi-browser support
- **Báo cáo tốt hơn** với enhanced reporting
- **Tích hợp tốt hơn** với CI/CD và Docker
- **Trải nghiệm tốt hơn** với interactive mode và web dashboard

Hãy thử enhanced runner và cảm nhận sự khác biệt! 🚀
