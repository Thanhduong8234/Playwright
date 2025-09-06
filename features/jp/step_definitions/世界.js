/**
 * CUCUMBER 世界コンテキスト (日本語版)
 * ステップ定義間でのコンテキストと共有状態を管理
 */

const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

// Page Objects をインポート
const HomePage = require('../../../pages/AutomationExercise/HomePage');
const ContactPage = require('../../../pages/AutomationExercise/ContactPage');
const TestDataGenerator = require('../../../utils/TestDataGenerator');

class 日本語世界 extends World {
  constructor(options) {
    super(options);
    
    // ブラウザとページのインスタンス
    this.browser = null;
    this.context = null;
    this.page = null;
    
    // Page Objects
    this.homePage = null;
    this.contactPage = null;
    
    // テストデータ
    this.testData = {};
    
    // world parameters からの設定
    this.config = options.parameters.playwright || {
      headless: true,
      browser: 'chromium',
      viewport: { width: 1920, height: 1080 },
      timeout: 60000
    };
    
    this.baseUrl = options.parameters.baseUrls?.[options.parameters.environment] || 'https://automationexercise.com';
    
    // 日本語設定
    this.locale = 'ja-JP';
    this.timezone = 'Asia/Tokyo';
  }

  /**
   * ブラウザとページの初期化
   */
  async initializeBrowser() {
    try {
      // ブラウザエンジンを選択
      let browserType;
      switch (this.config.browser.toLowerCase()) {
        case 'firefox':
          browserType = firefox;
          break;
        case 'webkit':
        case 'safari':
          browserType = webkit;
          break;
        case 'chromium':
        case 'chrome':
        default:
          browserType = chromium;
          break;
      }

      // ブラウザを起動
      this.browser = await browserType.launch({
        headless: this.config.headless,
        args: [
          '--start-maximized',
          '--window-size=1920,1080',
          '--disable-web-security',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          `--lang=${this.locale}`, // 日本語設定
          '--disable-background-timer-throttling'
        ]
      });

      // コンテキストを作成
      this.context = await this.browser.newContext({
        viewport: this.config.viewport,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        locale: this.locale,
        timezoneId: this.timezone,
        // 日本語のユーザーエージェント
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (Japanese)'
      });

      // ページを作成
      this.page = await this.context.newPage();
      
      // タイムアウトを設定
      this.page.setDefaultTimeout(this.config.timeout);
      this.page.setDefaultNavigationTimeout(this.config.timeout);
      
      // 日本語のExtra HTTPヘッダーを設定
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8'
      });
      
      // Page Objects を初期化
      this.homePage = new HomePage(this.page);
      this.contactPage = new ContactPage(this.page);
      
      console.log(`✅ ブラウザを初期化しました: ${this.config.browser} (日本語設定)`);
      
    } catch (error) {
      console.error('❌ ブラウザの初期化に失敗しました:', error);
      throw error;
    }
  }

  /**
   * ブラウザを閉じる
   */
  async closeBrowser() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      console.log('✅ ブラウザを正常に閉じました');
    } catch (error) {
      console.error('❌ ブラウザを閉じるのに失敗しました:', error);
    }
  }

  /**
   * テストデータを生成
   */
  generateTestData() {
    // 日本語名前のパターン
    const japaneseNames = [
      '田中太郎', '佐藤花子', '鈴木一郎', '高橋美穂', '伊藤健太',
      '渡辺さくら', '山本直樹', '中村愛', '小林大輔', '加藤みどり'
    ];
    
    // ランダムな日本語名前を選択
    const randomName = japaneseNames[Math.floor(Math.random() * japaneseNames.length)];
    
    this.testData = {
      name: TestDataGenerator.generateUniqueName(randomName),
      email: TestDataGenerator.generateUniqueEmail(),
      subject: TestDataGenerator.generateUniqueSubject('日本語テスト'),
      message: TestDataGenerator.generateUniqueMessage('日本語でのテストメッセージです。')
    };
    return this.testData;
  }

  /**
   * スクリーンショットを撮影
   */
  async takeScreenshot(name = 'スクリーンショット') {
    if (this.page) {
      const timestamp = new Date().toLocaleString('ja-JP').replace(/[\/:\s]/g, '-');
      const screenshotPath = `screenshots/cucumber-jp-${name}-${timestamp}.png`;
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      console.log(`📸 スクリーンショットを保存しました: ${screenshotPath}`);
      return screenshotPath;
    }
  }

  /**
   * ページの読み込み待機
   */
  async waitForPageLoad() {
    if (this.page) {
      await this.page.waitForLoadState('load');
      await this.page.waitForLoadState('domcontentloaded');
      try {
        await this.page.waitForLoadState('networkidle');
      } catch (error) {
        console.log('ネットワークアイドルタイムアウト - 継続します...');
      }
    }
  }

  /**
   * 日本語日付をフォーマット
   */
  formatJapaneseDate(date = new Date()) {
    return date.toLocaleDateString('ja-JP', {
      era: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  /**
   * 日本語時刻をフォーマット
   */
  formatJapaneseTime(date = new Date()) {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  }

  /**
   * エラーメッセージを日本語でログ
   */
  logError(message, error) {
    console.error(`❌ エラー: ${message}`);
    if (error) {
      console.error(`詳細: ${error.message}`);
      console.error(`スタックトレース: ${error.stack}`);
    }
  }

  /**
   * 成功メッセージを日本語でログ
   */
  logSuccess(message) {
    console.log(`✅ 成功: ${message}`);
  }

  /**
   * 情報メッセージを日本語でログ
   */
  logInfo(message) {
    console.log(`ℹ️ 情報: ${message}`);
  }

  /**
   * 警告メッセージを日本語でログ
   */
  logWarning(message) {
    console.warn(`⚠️ 警告: ${message}`);
  }

  /**
   * ブラウザウィンドウを最大化
   */
  async maximizeWindow() {
    try {
      if (this.page) {
        await this.page.evaluate(() => {
          window.moveTo(0, 0);
          window.resizeTo(screen.availWidth, screen.availHeight);
        });
        console.log('✅ ウィンドウを最大化しました');
      }
    } catch (error) {
      console.log('⚠️ ウィンドウ最大化に失敗しました、ビューポートを使用します');
      if (this.page) {
        await this.page.setViewportSize({ width: 1920, height: 1080 });
      }
    }
  }

  /**
   * 日本語特有のテストユーティリティ
   */
  async setJapaneseInput(selector, text) {
    // 日本語入力を想定した特別な処理
    await this.page.focus(selector);
    await this.page.fill(selector, ''); // まずクリア
    await this.page.type(selector, text, { delay: 50 }); // ゆっくり入力
    console.log(`✅ 日本語テキストを入力しました: ${text}`);
  }

  /**
   * 日本語文字列の検証
   */
  containsJapanese(text) {
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text);
  }

  /**
   * テスト開始時のログ
   */
  logTestStart(scenarioName) {
    console.log('\n🇯🇵 ==========================================');
    console.log(`🧪 シナリオ開始: ${scenarioName}`);
    console.log(`📅 開始時刻: ${this.formatJapaneseTime()}`);
    console.log('============================================');
  }

  /**
   * テスト終了時のログ
   */
  logTestEnd(scenarioName, duration) {
    console.log('\n✅ ==========================================');
    console.log(`🏁 シナリオ完了: ${scenarioName}`);
    console.log(`⏱️ 実行時間: ${duration}ms`);
    console.log(`📅 終了時刻: ${this.formatJapaneseTime()}`);
    console.log('============================================');
  }
}

// World Constructor を設定
setWorldConstructor(日本語世界);

module.exports = 日本語世界;
