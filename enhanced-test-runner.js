#!/usr/bin/env node

/**
 * ENHANCED PLAYWRIGHT + CUCUMBER TEST RUNNER
 * Advanced test runner with multiple language support, smart parallel execution,
 * enhanced reporting, and CI/CD integration
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
// Import chalk with fallback for older versions
let chalk;
try {
    chalk = require('chalk');
} catch (error) {
    // Fallback if chalk is not available
    chalk = {
        cyan: (text) => text,
        yellow: (text) => text,
        green: (text) => text,
        red: (text) => text,
        blue: (text) => text,
        gray: (text) => text,
        white: (text) => text
    };
}

class EnhancedTestRunner {
    constructor() {
        this.version = '2.0.0';
        this.configFiles = {
            en: '.cucumberrc.json',
            jp: '.cucumberrc.jp.json'
        };
        
        // Enhanced test suites with multiple languages
        this.testSuites = {
            smoke: {
                name: { en: 'Smoke Tests', jp: 'スモークテスト' },
                tags: { en: '@smoke', jp: '@スモーク' },
                description: { en: 'Basic functionality tests', jp: '基本的な機能をテストする' },
                priority: 1,
                estimatedTime: '2-5 minutes'
            },
            regression: {
                name: { en: 'Regression Tests', jp: '回帰テスト' },
                tags: { en: '@regression', jp: '@回帰テスト' },
                description: { en: 'Full regression testing', jp: '全機能の回帰テスト' },
                priority: 2,
                estimatedTime: '10-20 minutes'
            },
            e2e: {
                name: { en: 'E2E Tests', jp: 'E2Eテスト' },
                tags: { en: '@e2e', jp: '@E2E' },
                description: { en: 'End-to-end testing', jp: 'エンドツーエンドテスト' },
                priority: 3,
                estimatedTime: '15-30 minutes'
            },
            contact: {
                name: { en: 'Contact Tests', jp: 'お問い合わせテスト' },
                tags: { en: '@contact', jp: '@お問い合わせ' },
                description: { en: 'Contact form testing', jp: 'お問い合わせ機能のテスト' },
                priority: 2,
                estimatedTime: '5-10 minutes'
            },
            performance: {
                name: { en: 'Performance Tests', jp: 'パフォーマンステスト' },
                tags: { en: '@performance', jp: '@パフォーマンス' },
                description: { en: 'Performance testing', jp: 'パフォーマンステスト' },
                priority: 3,
                estimatedTime: '10-15 minutes'
            },
            visual: {
                name: { en: 'Visual Tests', jp: 'ビジュアルテスト' },
                tags: { en: '@visual', jp: '@ビジュアル' },
                description: { en: 'Visual regression testing', jp: 'ビジュアル回帰テスト' },
                priority: 3,
                estimatedTime: '5-10 minutes'
            }
        };

        // Enhanced browser configurations
        this.browsers = {
            chromium: {
                name: 'Chromium',
                args: ['--start-maximized', '--disable-web-security', '--no-sandbox'],
                viewport: { width: 1920, height: 1080 }
            },
            chrome: {
                name: 'Google Chrome',
                args: ['--start-maximized', '--disable-web-security'],
                viewport: { width: 1920, height: 1080 }
            },
            firefox: {
                name: 'Firefox',
                args: ['--width=1920', '--height=1080'],
                viewport: { width: 1920, height: 1080 }
            },
            webkit: {
                name: 'WebKit (Safari)',
                args: [],
                viewport: { width: 1920, height: 1080 }
            },
            edge: {
                name: 'Microsoft Edge',
                args: ['--start-maximized', '--disable-web-security'],
                viewport: { width: 1920, height: 1080 }
            }
        };

        // Environment configurations
        this.environments = {
            local: 'http://localhost:3000',
            dev: 'https://dev.automationexercise.com',
            staging: 'https://staging.automationexercise.com',
            prod: 'https://automationexercise.com'
        };

        this.defaultOptions = {
            language: 'en',
            browser: 'chromium',
            environment: 'prod',
            headed: false,
            parallel: this.getOptimalParallelCount(),
            timeout: 120000,
            retries: 1,
            generateReport: true,
            openReport: false,
            screenshots: 'on-failure',
            videos: false,
            trace: false
        };
    }

    // Get optimal parallel count based on system resources
    getOptimalParallelCount() {
        const cpuCount = os.cpus().length;
        const totalMemory = os.totalmem() / (1024 * 1024 * 1024); // GB
        
        if (totalMemory >= 16 && cpuCount >= 8) return 4;
        if (totalMemory >= 8 && cpuCount >= 4) return 2;
        return 1;
    }

    // Enhanced argument parsing with validation
    parseArgs() {
        const args = process.argv.slice(2);
        const options = { ...this.defaultOptions };
        
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const nextArg = args[i + 1];

            switch (arg) {
                case '-l':
                case '--language':
                    if (['en', 'jp'].includes(nextArg)) {
                        options.language = nextArg;
                        i++;
                    } else {
                        this.showError('Invalid language. Use: en, jp');
                    }
                    break;
                case '-s':
                case '--suite':
                    if (this.testSuites[nextArg]) {
                        options.suite = nextArg;
                        i++;
                    } else {
                        this.showError(`Invalid suite. Available: ${Object.keys(this.testSuites).join(', ')}`);
                    }
                    break;
                case '-b':
                case '--browser':
                    if (this.browsers[nextArg]) {
                        options.browser = nextArg;
                        i++;
                    } else {
                        this.showError(`Invalid browser. Available: ${Object.keys(this.browsers).join(', ')}`);
                    }
                    break;
                case '-e':
                case '--environment':
                    if (this.environments[nextArg]) {
                        options.environment = nextArg;
                        i++;
                    } else {
                        this.showError(`Invalid environment. Available: ${Object.keys(this.environments).join(', ')}`);
                    }
                    break;
                case '--headed':
                    options.headed = true;
                    break;
                case '-p':
                case '--parallel':
                    const parallelCount = parseInt(nextArg);
                    if (parallelCount > 0 && parallelCount <= 8) {
                        options.parallel = parallelCount;
                        i++;
                    } else {
                        this.showError('Parallel count must be between 1-8');
                    }
                    break;
                case '--timeout':
                    const timeout = parseInt(nextArg);
                    if (timeout > 0) {
                        options.timeout = timeout * 1000;
                        i++;
                    }
                    break;
                case '--retries':
                    const retries = parseInt(nextArg);
                    if (retries >= 0 && retries <= 3) {
                        options.retries = retries;
                        i++;
                    }
                    break;
                case '--screenshots':
                    if (['always', 'on-failure', 'never'].includes(nextArg)) {
                        options.screenshots = nextArg;
                        i++;
                    }
                    break;
                case '--videos':
                    options.videos = true;
                    break;
                case '--trace':
                    options.trace = true;
                    break;
                case '--no-report':
                    options.generateReport = false;
                    break;
                case '--open-report':
                    options.openReport = true;
                    break;
                case '-t':
                case '--tags':
                    options.tags = nextArg;
                    i++;
                    break;
                case '-f':
                case '--feature':
                    options.feature = nextArg;
                    i++;
                    break;
                case '--dry-run':
                    options.dryRun = true;
                    break;
                case '--list':
                    this.listSuites(options.language);
                    return null;
                case '--system-info':
                    this.showSystemInfo();
                    return null;
                case '-h':
                case '--help':
                    this.showHelp(options.language);
                    return null;
                case '-v':
                case '--version':
                    console.log(`Enhanced Test Runner v${this.version}`);
                    return null;
                case '-i':
                case '--interactive':
                    options.interactive = true;
                    break;
                default:
                    if (arg.startsWith('-')) {
                        this.showError(`Unknown option: ${arg}`);
                    }
            }
        }

        return options;
    }

    // Enhanced help with examples
    showHelp(language = 'en') {
        const help = {
            en: {
                title: '🚀 Enhanced Playwright + Cucumber Test Runner',
                usage: 'Usage: node enhanced-test-runner.js [options]',
                options: [
                    '  -l, --language <lang>     Language (en|jp) [default: en]',
                    '  -s, --suite <suite>       Test suite to run',
                    '  -b, --browser <browser>   Browser (chromium|chrome|firefox|webkit|edge)',
                    '  -e, --environment <env>   Environment (local|dev|staging|prod)',
                    '  --headed                  Run in headed mode',
                    '  -p, --parallel <count>    Parallel execution count [default: auto]',
                    '  --timeout <seconds>       Test timeout in seconds [default: 120]',
                    '  --retries <count>         Retry count for failed tests [default: 1]',
                    '  --screenshots <mode>      Screenshot mode (always|on-failure|never)',
                    '  --videos                  Record videos',
                    '  --trace                   Enable tracing',
                    '  -t, --tags <tags>         Filter by tags',
                    '  -f, --feature <file>      Run specific feature file',
                    '  --dry-run                 Show what would be executed',
                    '  --list                    List available test suites',
                    '  --system-info             Show system information',
                    '  -i, --interactive         Interactive mode',
                    '  -h, --help                Show this help',
                    '  -v, --version             Show version'
                ],
                examples: [
                    '# Run smoke tests in headed mode',
                    'node enhanced-test-runner.js --suite smoke --headed',
                    '',
                    '# Run regression tests with Firefox in parallel',
                    'node enhanced-test-runner.js --suite regression --browser firefox --parallel 2',
                    '',
                    '# Run specific tags with videos and traces',
                    'node enhanced-test-runner.js --tags "@contact and not @slow" --videos --trace',
                    '',
                    '# Interactive mode',
                    'node enhanced-test-runner.js --interactive'
                ]
            },
            jp: {
                title: '🚀 拡張Playwright + Cucumberテストランナー',
                usage: '使用方法: node enhanced-test-runner.js [オプション]',
                options: [
                    '  -l, --language <lang>     言語 (en|jp) [デフォルト: en]',
                    '  -s, --suite <suite>       実行するテストスイート',
                    '  -b, --browser <browser>   ブラウザ (chromium|chrome|firefox|webkit|edge)',
                    '  -e, --environment <env>   環境 (local|dev|staging|prod)',
                    '  --headed                  表示モードで実行',
                    '  -p, --parallel <count>    並列実行数 [デフォルト: 自動]',
                    '  --timeout <seconds>       テストタイムアウト（秒） [デフォルト: 120]',
                    '  --retries <count>         失敗テストの再試行回数 [デフォルト: 1]',
                    '  --screenshots <mode>      スクリーンショットモード (always|on-failure|never)',
                    '  --videos                  ビデオ録画',
                    '  --trace                   トレース有効化',
                    '  -t, --tags <tags>         タグでフィルタリング',
                    '  -f, --feature <file>      特定のfeatureファイルを実行',
                    '  --dry-run                 実行予定を表示',
                    '  --list                    利用可能なテストスイートを表示',
                    '  --system-info             システム情報を表示',
                    '  -i, --interactive         インタラクティブモード',
                    '  -h, --help                このヘルプを表示',
                    '  -v, --version             バージョンを表示'
                ]
            }
        };

        const h = help[language];
        console.log(chalk.cyan(h.title));
        console.log(chalk.yellow(`\n${h.usage}\n`));
        console.log(chalk.green('Options:'));
        h.options.forEach(option => console.log(chalk.white(option)));
        
        if (h.examples) {
            console.log(chalk.green('\nExamples:'));
            h.examples.forEach(example => {
                if (example.startsWith('#')) {
                    console.log(chalk.gray(example));
                } else if (example === '') {
                    console.log('');
                } else {
                    console.log(chalk.cyan(example));
                }
            });
        }
    }

    // Show system information
    showSystemInfo() {
        console.log(chalk.cyan('🖥️  System Information'));
        console.log(chalk.yellow('─'.repeat(50)));
        console.log(`OS: ${os.type()} ${os.release()}`);
        console.log(`Architecture: ${os.arch()}`);
        console.log(`CPU Cores: ${os.cpus().length}`);
        console.log(`Total Memory: ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);
        console.log(`Free Memory: ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);
        console.log(`Node.js Version: ${process.version}`);
        console.log(`Optimal Parallel Count: ${this.getOptimalParallelCount()}`);
    }

    // Enhanced suite listing
    listSuites(language = 'en') {
        console.log(chalk.cyan(`\n📋 Available Test Suites (${language.toUpperCase()}):\n`));
        
        Object.entries(this.testSuites).forEach(([key, suite]) => {
            console.log(chalk.green(`🧪 ${key}`));
            console.log(`   Name: ${suite.name[language]}`);
            console.log(`   Tags: ${suite.tags[language]}`);
            console.log(`   Description: ${suite.description[language]}`);
            console.log(`   Priority: ${suite.priority}/3`);
            console.log(`   Estimated Time: ${suite.estimatedTime}`);
            console.log('');
        });
    }

    // Show error and exit
    showError(message) {
        console.error(chalk.red(`❌ Error: ${message}`));
        console.log(chalk.yellow('Use --help for usage information'));
        process.exit(1);
    }

    // Build enhanced cucumber command
    buildCommand(options) {
        const args = ['cucumber-js'];
        
        // Config file based on language
        args.push('--config', this.configFiles[options.language]);
        
        // Feature selection
        if (options.feature) {
            args.push(options.feature);
        } else if (options.suite) {
            args.push('--tags', this.testSuites[options.suite].tags[options.language]);
        } else if (options.tags) {
            args.push('--tags', options.tags);
        }
        
        // Parallel execution
        if (options.parallel > 1) {
            args.push('--parallel', options.parallel.toString());
        }
        
        // Retries
        if (options.retries > 0) {
            args.push('--retry', options.retries.toString());
        }
        
        // Reporting
        if (options.generateReport) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            args.push('--format', `html:reports/enhanced-report-${timestamp}.html`);
            args.push('--format', `json:reports/enhanced-report-${timestamp}.json`);
        }
        
        // Dry run
        if (options.dryRun) {
            args.push('--dry-run');
        }
        
        return args;
    }

    // Enhanced test execution with monitoring
    async runTests(options) {
        console.log(chalk.cyan('🚀 Enhanced Test Runner Starting...'));
        console.log(chalk.yellow('─'.repeat(60)));
        
        // Pre-flight checks
        await this.preFlightChecks(options);
        
        // Show execution plan
        this.showExecutionPlan(options);
        
        if (options.dryRun) {
            console.log(chalk.yellow('🔍 Dry run completed - no tests executed'));
            return;
        }
        
        // Setup environment
        const env = this.setupEnvironment(options);
        
        // Build command
        const args = this.buildCommand(options);
        
        console.log(chalk.green(`\n▶️  Executing: npx ${args.join(' ')}`));
        console.log(chalk.gray(`Environment: ${JSON.stringify(env, null, 2)}\n`));
        
        const startTime = Date.now();
        
        // Execute tests
        const cucumber = spawn('npx', args, {
            stdio: 'inherit',
            env: { ...process.env, ...env },
            shell: true
        });
        
        cucumber.on('close', (code) => {
            const duration = Date.now() - startTime;
            this.showResults(code, duration, options);
        });
        
        cucumber.on('error', (error) => {
            console.error(chalk.red(`❌ Execution failed: ${error.message}`));
        });
    }

    // Pre-flight system checks
    async preFlightChecks(options) {
        console.log(chalk.blue('🔍 Running pre-flight checks...'));
        
        // Check Node.js version
        const nodeVersion = process.version;
        if (parseInt(nodeVersion.slice(1)) < 16) {
            this.showError('Node.js 16+ is required');
        }
        
        // Check if Playwright browsers are installed
        try {
            await this.checkPlaywrightInstallation();
        } catch (error) {
            console.log(chalk.yellow('⚠️  Playwright browsers may not be installed'));
            console.log(chalk.gray('Run: npx playwright install'));
        }
        
        // Check feature files exist
        const featuresDir = options.language === 'jp' ? 'features/jp' : 'features';
        if (!fs.existsSync(featuresDir)) {
            this.showError(`Features directory not found: ${featuresDir}`);
        }
        
        console.log(chalk.green('✅ Pre-flight checks passed'));
    }

    // Check Playwright installation
    async checkPlaywrightInstallation() {
        return new Promise((resolve, reject) => {
            exec('npx playwright --version', (error, stdout) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    // Setup environment variables
    setupEnvironment(options) {
        return {
            HEADED: options.headed ? 'true' : 'false',
            BROWSER: options.browser,
            ENVIRONMENT: options.environment,
            BASE_URL: this.environments[options.environment],
            TIMEOUT: options.timeout.toString(),
            SCREENSHOTS: options.screenshots,
            VIDEOS: options.videos ? 'true' : 'false',
            TRACE: options.trace ? 'true' : 'false',
            PARALLEL: options.parallel.toString()
        };
    }

    // Show execution plan
    showExecutionPlan(options) {
        console.log(chalk.blue('📋 Execution Plan:'));
        console.log(`   Language: ${options.language.toUpperCase()}`);
        console.log(`   Browser: ${this.browsers[options.browser].name}`);
        console.log(`   Environment: ${options.environment} (${this.environments[options.environment]})`);
        console.log(`   Mode: ${options.headed ? 'Headed' : 'Headless'}`);
        console.log(`   Parallel: ${options.parallel} worker${options.parallel > 1 ? 's' : ''}`);
        console.log(`   Timeout: ${options.timeout / 1000}s`);
        console.log(`   Retries: ${options.retries}`);
        console.log(`   Screenshots: ${options.screenshots}`);
        console.log(`   Videos: ${options.videos ? 'Enabled' : 'Disabled'}`);
        console.log(`   Trace: ${options.trace ? 'Enabled' : 'Disabled'}`);
        
        if (options.suite) {
            const suite = this.testSuites[options.suite];
            console.log(`   Suite: ${suite.name[options.language]} (${suite.estimatedTime})`);
        }
    }

    // Show results summary
    showResults(exitCode, duration, options) {
        const durationStr = this.formatDuration(duration);
        
        console.log(chalk.cyan('\n🏁 Test Execution Complete'));
        console.log(chalk.yellow('─'.repeat(60)));
        console.log(`Duration: ${durationStr}`);
        console.log(`Exit Code: ${exitCode}`);
        
        if (exitCode === 0) {
            console.log(chalk.green('✅ All tests passed!'));
        } else {
            console.log(chalk.red('❌ Some tests failed'));
        }
        
        if (options.generateReport) {
            console.log(chalk.blue('\n📊 Reports generated in reports/ directory'));
            if (options.openReport) {
                this.openLatestReport();
            }
        }
    }

    // Format duration
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    // Open latest report
    openLatestReport() {
        const reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(reportsDir)) return;
        
        const reports = fs.readdirSync(reportsDir)
            .filter(file => file.startsWith('enhanced-report-') && file.endsWith('.html'))
            .sort()
            .reverse();
        
        if (reports.length > 0) {
            const latestReport = path.join(reportsDir, reports[0]);
            const command = process.platform === 'win32' ? 'start' : 
                           process.platform === 'darwin' ? 'open' : 'xdg-open';
            
            exec(`${command} "${latestReport}"`);
            console.log(chalk.green(`📊 Opened report: ${reports[0]}`));
        }
    }

    // Interactive mode
    async interactive() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log(chalk.cyan('🎮 Interactive Mode'));
        console.log(chalk.yellow('─'.repeat(40)));
        
        // Implementation would continue with interactive prompts...
        // This is a simplified version
        rl.close();
    }

    // Main entry point
    async run() {
        try {
            const options = this.parseArgs();
            if (!options) return;
            
            if (options.interactive) {
                await this.interactive();
            } else {
                await this.runTests(options);
            }
        } catch (error) {
            console.error(chalk.red(`❌ Fatal error: ${error.message}`));
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const runner = new EnhancedTestRunner();
    runner.run();
}

module.exports = EnhancedTestRunner;
