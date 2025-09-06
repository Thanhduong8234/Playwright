#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class CucumberTestRunner {
    constructor() {
        this.baseCommand = 'cucumber-js';
        this.configFile = '.cucumberrc.jp.json';
        this.featuresDir = 'features/jp';
        
        // Predefined test suites
        this.testSuites = {
            'smoke': {
                name: 'スモークテスト',
                tags: '@スモーク',
                description: '基本的な機能をテストする'
            },
            'contact': {
                name: 'お問い合わせテスト',
                tags: '@お問い合わせ',
                description: 'お問い合わせ機能のテスト'
            },
            'regression': {
                name: '回帰テスト',
                tags: '@回帰テスト',
                description: '全機能の回帰テスト'
            },
            'e2e': {
                name: 'E2Eテスト',
                tags: '@E2E',
                description: 'エンドツーエンドテスト'
            },
            'validation': {
                name: 'バリデーションテスト',
                tags: '@バリデーション',
                description: 'フォームバリデーションテスト'
            },
            'performance': {
                name: 'パフォーマンステスト',
                tags: '@パフォーマンス',
                description: 'パフォーマンステスト'
            }
        };
        
        // Browser options
        this.browsers = {
            'chromium': 'Chromium (デフォルト)',
            'firefox': 'Firefox',
            'webkit': 'WebKit (Safari)'
        };
    }

    // Parse command line arguments
    parseArgs() {
        const args = process.argv.slice(2);
        const options = {
            feature: null,
            tags: null,
            suite: null,
            browser: 'chromium',
            headed: false,
            parallel: 1,
            format: 'progress',
            interactive: false,
            help: false,
            list: false,
            generateReport: true,
            openReport: false
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const nextArg = args[i + 1];

            switch (arg) {
                case '-f':
                case '--feature':
                    options.feature = nextArg;
                    i++;
                    break;
                case '-t':
                case '--tags':
                    options.tags = nextArg;
                    i++;
                    break;
                case '-s':
                case '--suite':
                    options.suite = nextArg;
                    i++;
                    break;
                case '-b':
                case '--browser':
                    options.browser = nextArg;
                    i++;
                    break;
                case '--headed':
                    options.headed = true;
                    break;
                case '-p':
                case '--parallel':
                    options.parallel = parseInt(nextArg) || 1;
                    i++;
                    break;
                case '--format':
                    options.format = nextArg;
                    i++;
                    break;
                case '-i':
                case '--interactive':
                    options.interactive = true;
                    break;
                case '-h':
                case '--help':
                    options.help = true;
                    break;
                case '-l':
                case '--list':
                    options.list = true;
                    break;
                case '--no-report':
                    options.generateReport = false;
                    break;
                case '--open-report':
                    options.openReport = true;
                    break;
            }
        }

        return options;
    }

    // Show help
    showHelp() {
        console.log(`
🥒 Cucumber Test Runner - 日本語版

使用方法:
  node test-runner.js [オプション]

オプション:
  -f, --feature <file>     特定のfeatureファイルを実行
  -t, --tags <tags>        タグでフィルタリング (例: @スモーク)
  -s, --suite <suite>      定義済みテストスイートを実行
  -b, --browser <browser>  ブラウザを指定 (chromium|firefox|webkit)
  --headed                 ブラウザを表示モードで実行
  -p, --parallel <num>     並列実行数 (デフォルト: 1)
  --format <format>        出力フォーマット (progress|pretty|json|html)
  -i, --interactive        インタラクティブモード
  -l, --list               利用可能なテストスイートを表示
  --no-report              レポート生成を無効にする
  --open-report            テスト完了後にレポートを開く
  -h, --help               このヘルプを表示

例:
  # インタラクティブモード
  node test-runner.js -i

  # 特定のfeatureファイルを実行
  node test-runner.js -f "features/jp/お問い合わせ.feature"

  # スモークテストを実行
  node test-runner.js -s smoke

  # タグでフィルタリング
  node test-runner.js -t "@スモーク and not @スキップ"

  # Firefoxでheadedモードで実行
  node test-runner.js -s smoke -b firefox --headed

  # 並列実行
  node test-runner.js -s regression -p 3

定義済みテストスイート:
${Object.entries(this.testSuites).map(([key, suite]) => 
    `  ${key.padEnd(12)} - ${suite.name} (${suite.tags})`
).join('\n')}

ブラウザオプション:
${Object.entries(this.browsers).map(([key, name]) => 
    `  ${key.padEnd(12)} - ${name}`
).join('\n')}
`);
    }

    // List available test suites
    listSuites() {
        console.log('\n🧪 利用可能なテストスイート:\n');
        Object.entries(this.testSuites).forEach(([key, suite]) => {
            console.log(`📋 ${key}`);
            console.log(`   名前: ${suite.name}`);
            console.log(`   タグ: ${suite.tags}`);
            console.log(`   説明: ${suite.description}\n`);
        });
    }

    // Interactive mode
    async interactive() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

        console.log('\n🥒 Cucumber Test Runner - インタラクティブモード\n');

        // Select test type
        console.log('テスト実行方法を選択してください:');
        console.log('1. 定義済みテストスイート');
        console.log('2. 特定のfeatureファイル');
        console.log('3. カスタムタグ');
        console.log('4. 全てのテスト');

        const testType = await question('\n選択 (1-4): ');
        let runOptions = {};

        switch (testType) {
            case '1':
                console.log('\n利用可能なテストスイート:');
                Object.entries(this.testSuites).forEach(([key, suite], index) => {
                    console.log(`${index + 1}. ${suite.name} (${key})`);
                });
                
                const suiteChoice = await question('\nスイートを選択 (1-' + Object.keys(this.testSuites).length + '): ');
                const suiteKey = Object.keys(this.testSuites)[parseInt(suiteChoice) - 1];
                if (suiteKey) {
                    runOptions.suite = suiteKey;
                }
                break;

            case '2':
                const featureFiles = this.getFeatureFiles();
                console.log('\n利用可能なfeatureファイル:');
                featureFiles.forEach((file, index) => {
                    console.log(`${index + 1}. ${file}`);
                });
                
                const fileChoice = await question('\nファイルを選択 (1-' + featureFiles.length + '): ');
                const selectedFile = featureFiles[parseInt(fileChoice) - 1];
                if (selectedFile) {
                    runOptions.feature = selectedFile;
                }
                break;

            case '3':
                const customTags = await question('\nタグを入力 (例: @スモーク and not @スキップ): ');
                if (customTags.trim()) {
                    runOptions.tags = customTags.trim();
                }
                break;

            case '4':
                // Run all tests
                break;

            default:
                console.log('無効な選択です。');
                rl.close();
                return;
        }

        // Select browser
        console.log('\nブラウザを選択してください:');
        Object.entries(this.browsers).forEach(([key, name], index) => {
            console.log(`${index + 1}. ${name} (${key})`);
        });
        
        const browserChoice = await question('\nブラウザを選択 (1-' + Object.keys(this.browsers).length + ', デフォルト: 1): ');
        const browserKey = Object.keys(this.browsers)[parseInt(browserChoice) - 1] || 'chromium';
        runOptions.browser = browserKey;

        // Headed mode
        const headedChoice = await question('\nブラウザを表示しますか? (y/N): ');
        runOptions.headed = headedChoice.toLowerCase() === 'y' || headedChoice.toLowerCase() === 'yes';

        // Parallel execution
        const parallelChoice = await question('\n並列実行数 (デフォルト: 1): ');
        runOptions.parallel = parseInt(parallelChoice) || 1;

        rl.close();

        console.log('\n🚀 テストを開始します...\n');
        this.runTests(runOptions);
    }

    // Get available feature files
    getFeatureFiles() {
        const featuresPath = path.join(process.cwd(), this.featuresDir);
        if (!fs.existsSync(featuresPath)) {
            return [];
        }

        return fs.readdirSync(featuresPath)
            .filter(file => file.endsWith('.feature'))
            .map(file => path.join(this.featuresDir, file));
    }

    // Build cucumber command
    buildCommand(options) {
        const args = [];

        // Add config file
        args.push('--config', this.configFile);

        // Add feature file or directory
        if (options.feature) {
            args.push(options.feature);
        } else if (options.suite && this.testSuites[options.suite]) {
            args.push('--tags', this.testSuites[options.suite].tags);
        } else if (options.tags) {
            args.push('--tags', options.tags);
        }

        // Add parallel execution
        if (options.parallel > 1) {
            args.push('--parallel', options.parallel.toString());
        }

        // Add format
        if (options.format && options.format !== 'progress') {
            args.push('--format', options.format);
        }

        // Add report generation
        if (options.generateReport !== false) {
            // Add HTML report
            args.push('--format', 'html:reports/cucumber-report.html');
            
            // Add JSON report for further processing
            args.push('--format', 'json:reports/cucumber-report.json');
        }

        return args;
    }

    // Create reports directory
    ensureReportsDirectory() {
        const reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
            console.log('📁 レポートディレクトリを作成しました: reports/');
        }
    }

    // Open report in browser
    openReport() {
        const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report.html');
        if (fs.existsSync(reportPath)) {
            const { exec } = require('child_process');
            const command = process.platform === 'win32' ? 'start' : 
                           process.platform === 'darwin' ? 'open' : 'xdg-open';
            
            exec(`${command} "${reportPath}"`, (error) => {
                if (error) {
                    console.log(`📊 レポートを手動で開いてください: ${reportPath}`);
                } else {
                    console.log('📊 レポートをブラウザで開きました');
                }
            });
        } else {
            console.log('❌ レポートファイルが見つかりません');
        }
    }

    // Generate enhanced HTML report
    generateEnhancedReport() {
        const jsonReportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
        const htmlReportPath = path.join(process.cwd(), 'reports', 'cucumber-enhanced-report.html');
        
        if (fs.existsSync(jsonReportPath)) {
            try {
                const reportData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
                const enhancedHtml = this.createEnhancedHtmlReport(reportData);
                fs.writeFileSync(htmlReportPath, enhancedHtml);
                console.log('📊 拡張HTMLレポートを生成しました: reports/cucumber-enhanced-report.html');
            } catch (error) {
                console.log('⚠️ 拡張レポート生成に失敗しました:', error.message);
            }
        }
    }

    // Create enhanced HTML report
    createEnhancedHtmlReport(data) {
        const timestamp = new Date().toLocaleString('ja-JP');
        const totalScenarios = data.reduce((sum, feature) => sum + feature.elements.length, 0);
        const passedScenarios = data.reduce((sum, feature) => 
            sum + feature.elements.filter(scenario => 
                scenario.steps.every(step => step.result.status === 'passed')
            ).length, 0
        );
        const failedScenarios = totalScenarios - passedScenarios;

        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cucumber テストレポート</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
        .stat-card.passed { border-left-color: #28a745; }
        .stat-card.failed { border-left-color: #dc3545; }
        .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9em; }
        .features { padding: 0 30px 30px; }
        .feature { margin-bottom: 30px; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .feature-header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e9ecef; }
        .feature-title { margin: 0; color: #495057; }
        .scenario { padding: 15px 20px; border-bottom: 1px solid #f1f3f4; }
        .scenario:last-child { border-bottom: none; }
        .scenario-title { margin: 0 0 10px 0; font-weight: 500; }
        .scenario.passed { background: #f8fff8; border-left: 4px solid #28a745; }
        .scenario.failed { background: #fff8f8; border-left: 4px solid #dc3545; }
        .steps { margin-top: 10px; }
        .step { padding: 5px 0; font-size: 0.9em; color: #666; }
        .step.passed::before { content: "✅ "; }
        .step.failed::before { content: "❌ "; }
        .step.skipped::before { content: "⏭️ "; }
        .error-message { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥒 Cucumber テストレポート</h1>
            <p>実行日時: ${timestamp}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${totalScenarios}</div>
                <div class="stat-label">総シナリオ数</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-number" style="color: #28a745;">${passedScenarios}</div>
                <div class="stat-label">成功</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-number" style="color: #dc3545;">${failedScenarios}</div>
                <div class="stat-label">失敗</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color: #667eea;">${Math.round((passedScenarios / totalScenarios) * 100)}%</div>
                <div class="stat-label">成功率</div>
            </div>
        </div>
        
        <div class="features">
            ${data.map(feature => `
                <div class="feature">
                    <div class="feature-header">
                        <h2 class="feature-title">📋 ${feature.name}</h2>
                    </div>
                    ${feature.elements.map(scenario => {
                        const isPassed = scenario.steps.every(step => step.result.status === 'passed');
                        const failedStep = scenario.steps.find(step => step.result.status === 'failed');
                        
                        return `
                            <div class="scenario ${isPassed ? 'passed' : 'failed'}">
                                <h3 class="scenario-title">${isPassed ? '✅' : '❌'} ${scenario.name}</h3>
                                <div class="steps">
                                    ${scenario.steps.map(step => `
                                        <div class="step ${step.result.status}">
                                            ${step.keyword}${step.name}
                                        </div>
                                    `).join('')}
                                </div>
                                ${failedStep && failedStep.result.error_message ? `
                                    <div class="error-message">
                                        <strong>エラー:</strong> ${failedStep.result.error_message.split('\n')[0]}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
        `;
    }

    // Run tests
    runTests(options) {
        // Ensure reports directory exists
        if (options.generateReport) {
            this.ensureReportsDirectory();
        }

        const args = this.buildCommand(options);
        
        // Set environment variables
        const env = { ...process.env };
        
        if (options.headed) {
            env.HEADED = 'true';
        }
        
        if (options.browser && options.browser !== 'chromium') {
            env.BROWSER = options.browser;
        }

        console.log(`🥒 Cucumber実行コマンド: npx ${this.baseCommand} ${args.join(' ')}`);
        console.log(`🌍 環境変数: HEADED=${env.HEADED || 'false'}, BROWSER=${env.BROWSER || 'chromium'}`);
        
        if (options.generateReport) {
            console.log('📊 レポート生成: 有効');
            console.log('📁 レポート保存先: reports/cucumber-report.html\n');
        } else {
            console.log('📊 レポート生成: 無効\n');
        }

        // Spawn cucumber process
        const cucumber = spawn('npx', [this.baseCommand, ...args], {
            stdio: 'inherit',
            env: env,
            shell: true
        });

        cucumber.on('close', (code) => {
            console.log(`\n🏁 テスト実行完了 (終了コード: ${code})`);
            
            if (code === 0) {
                console.log('✅ 全てのテストが成功しました！');
            } else {
                console.log('❌ 一部のテストが失敗しました。');
            }

            // Generate and open reports
            if (options.generateReport) {
                console.log('\n📊 レポートを生成中...');
                
                // Generate enhanced report
                setTimeout(() => {
                    this.generateEnhancedReport();
                    
                    // Open report if requested
                    if (options.openReport) {
                        setTimeout(() => {
                            this.openReport();
                        }, 1000);
                    } else {
                        console.log('📊 レポートが生成されました:');
                        console.log('   - reports/cucumber-report.html (標準レポート)');
                        console.log('   - reports/cucumber-enhanced-report.html (拡張レポート)');
                        console.log('   - reports/cucumber-report.json (JSONデータ)');
                    }
                }, 500);
            }
        });

        cucumber.on('error', (error) => {
            console.error('❌ テスト実行エラー:', error.message);
        });
    }

    // Main entry point
    run() {
        const options = this.parseArgs();

        if (options.help) {
            this.showHelp();
            return;
        }

        if (options.list) {
            this.listSuites();
            return;
        }

        if (options.interactive) {
            this.interactive();
            return;
        }

        // Run tests with provided options
        this.runTests(options);
    }
}

// Run the test runner
if (require.main === module) {
    const runner = new CucumberTestRunner();
    runner.run();
}

module.exports = CucumberTestRunner;
