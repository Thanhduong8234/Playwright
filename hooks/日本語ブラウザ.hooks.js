/**
 * 日本語ブラウザフック for CUCUMBER
 * Cucumberテストでのブラウザライフサイクルを管理（日本語版）
 */

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// ===== グローバルセットアップ/ティアダウン =====

BeforeAll(async function() {
  console.log('🇯🇵 === CUCUMBER日本語テストスイート開始 ===');
  console.log(`📅 テスト実行開始時刻: ${new Date().toLocaleString('ja-JP')}`);
  
  // reportsディレクトリを作成（存在しない場合）
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // screenshotsディレクトリを作成（存在しない場合）
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('✅ 日本語テスト環境の準備が完了しました');
});

AfterAll(async function() {
  console.log('🏁 === CUCUMBER日本語テストスイート完了 ===');
  console.log(`📅 テスト実行終了時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log('お疲れ様でした！');
});

// ===== シナリオフック =====

Before(async function(scenario) {
  const scenarioName = scenario.pickle.name;
  const featureName = scenario.gherkinDocument.feature.name;
  
  console.log(`\n🧪 シナリオ開始: "${scenarioName}"`);
  console.log(`📂 機能: ${featureName}`);
  console.log(`⏰ 開始時刻: ${new Date().toLocaleTimeString('ja-JP')}`);
  
  // 各シナリオでブラウザを初期化
  await this.initializeBrowser();
  
  // シナリオ情報をログ
  this.scenarioName = scenarioName;
  this.featureName = featureName;
  this.startTime = Date.now();
  
  // 日本語テスト開始ログ
  this.logTestStart(scenarioName);
});

After(async function(scenario) {
  const duration = Date.now() - this.startTime;
  const durationSeconds = (duration / 1000).toFixed(2);
  
  console.log(`⏱️ シナリオ実行時間: ${duration}ms (${durationSeconds}秒)`);
  
  // シナリオ失敗時のスクリーンショット
  if (scenario.result.status === 'FAILED') {
    console.log('❌ シナリオが失敗しました - スクリーンショットを撮影中...');
    try {
      const failedScenarioName = this.scenarioName.replace(/\s+/g, '-').toLowerCase();
      const screenshotPath = await this.takeScreenshot(`失敗-${failedScenarioName}`);
      
      // レポートにスクリーンショットを添付（サポートしている場合）
      if (screenshotPath && this.attach) {
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png');
      }
      
      // エラー詳細をログ
      this.logError(`シナリオ失敗: ${this.scenarioName}`, scenario.result.exception);
      
    } catch (error) {
      console.error('スクリーンショットの撮影に失敗しました:', error);
    }
  } else {
    console.log('✅ シナリオが正常に完了しました');
    this.logSuccess(`シナリオ完了: ${this.scenarioName}`);
  }
  
  // 各シナリオ後にブラウザを閉じる
  await this.closeBrowser();
  
  // 日本語テスト終了ログ
  this.logTestEnd(this.scenarioName, duration);
  
  console.log(`🏁 シナリオ完了: "${scenario.pickle.name}"`);
});

// ===== タグベースのフック =====

// @低速 テスト用フック - タイムアウトを増加
Before({ tags: '@低速' }, async function() {
  console.log('⏰ 低速テストを検出 - タイムアウトを増加します');
  if (this.page) {
    this.page.setDefaultTimeout(120000); // 2分
  }
  this.logInfo('低速テスト用のタイムアウト設定を適用しました');
});

// @表示モード テスト用フック - ヘッドレスモードを無効化
Before({ tags: '@表示モード' }, async function() {
  console.log('👀 表示モードテストを検出');
  this.config.headless = false;
  this.logInfo('ブラウザ表示モードを有効にしました');
});

// @非表示モード テスト用フック - ヘッドレスモードを強制
Before({ tags: '@非表示モード' }, async function() {
  console.log('👻 非表示モードテストを検出');
  this.config.headless = true;
  this.logInfo('ヘッドレスモードを強制しました');
});

// @スクリーンショット テスト用フック - 終了時にスクリーンショット撮影
After({ tags: '@スクリーンショット' }, async function(scenario) {
  console.log('📸 @スクリーンショット タグ付きテストのスクリーンショットを撮影');
  const screenshotName = this.scenarioName.replace(/\s+/g, '-').toLowerCase();
  await this.takeScreenshot(`完了-${screenshotName}`);
  this.logInfo('タグ指定スクリーンショットを撮影しました');
});

// @お問い合わせ テスト用フック
Before({ tags: '@お問い合わせ' }, async function() {
  console.log('📧 お問い合わせ機能テストを開始します');
  this.logInfo('お問い合わせテスト用の準備を開始');
});

After({ tags: '@お問い合わせ' }, async function() {
  console.log('📧 お問い合わせ機能テストが完了しました');
  this.logInfo('お問い合わせテストのクリーンアップを実行');
});

// @データ駆動 テスト用フック
Before({ tags: '@データ駆動' }, async function() {
  console.log('📊 データ駆動テストを開始します');
  this.logInfo('複数のデータセットでテストを実行します');
});

// ===== エラーハンドリングフック =====

Before(async function() {
  // エラーハンドリングの設定
  this.errors = [];
  this.warnings = [];
  
  // 日本語でのエラー追跡を初期化
  this.japaneseErrors = [];
  this.japaneseWarnings = [];
});

After(async function(scenario) {
  // 蓄積されたエラー/警告をログ出力
  if (this.errors.length > 0) {
    console.log('❌ シナリオ実行中に発生したエラー:');
    this.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (this.warnings.length > 0) {
    console.log('⚠️ シナリオ実行中の警告:');
    this.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  // 日本語エラーのログ
  if (this.japaneseErrors.length > 0) {
    console.log('❌ 日本語テスト固有のエラー:');
    this.japaneseErrors.forEach(error => console.log(`  - ${error}`));
  }
});

// ===== パフォーマンステスト用フック =====

Before({ tags: '@パフォーマンス' }, async function() {
  console.log('⚡ パフォーマンステストを開始します');
  this.performanceMetrics = {
    startTime: Date.now(),
    memoryUsage: process.memoryUsage()
  };
  this.logInfo('パフォーマンス測定を開始しました');
});

After({ tags: '@パフォーマンス' }, async function() {
  if (this.performanceMetrics) {
    const endTime = Date.now();
    const duration = endTime - this.performanceMetrics.startTime;
    const currentMemory = process.memoryUsage();
    
    console.log('📊 パフォーマンス結果:');
    console.log(`  - 実行時間: ${duration}ms`);
    console.log(`  - メモリ使用量 (開始): ${Math.round(this.performanceMetrics.memoryUsage.heapUsed / 1024 / 1024)}MB`);
    console.log(`  - メモリ使用量 (終了): ${Math.round(currentMemory.heapUsed / 1024 / 1024)}MB`);
    
    this.logInfo(`パフォーマンステスト完了 - 実行時間: ${duration}ms`);
  }
});

// ===== ブラウザ別フック =====

Before({ tags: '@Chrome' }, async function() {
  this.config.browser = 'chromium';
  console.log('🌐 Chrome/Chromiumブラウザでテストを実行します');
});

Before({ tags: '@Firefox' }, async function() {
  this.config.browser = 'firefox';
  console.log('🦊 Firefoxブラウザでテストを実行します');
});

Before({ tags: '@Safari' }, async function() {
  this.config.browser = 'webkit';
  console.log('🧭 Safari/WebKitブラウザでテストを実行します');
});

// ===== 特別な日本語環境フック =====

Before({ tags: '@日本語入力' }, async function() {
  console.log('🇯🇵 日本語入力テストのための特別設定を適用します');
  // 日本語IME関連の設定があればここに追加
  this.logInfo('日本語入力環境を準備しました');
});

Before({ tags: '@モバイル日本語' }, async function() {
  console.log('📱 日本語モバイル環境でのテストを開始します');
  // モバイル日本語環境の設定
  if (this.context) {
    await this.context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'ja-JP' });
      Object.defineProperty(navigator, 'languages', { value: ['ja-JP', 'ja'] });
    });
  }
  this.logInfo('日本語モバイル環境を設定しました');
});
