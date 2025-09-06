# 🥒 CUCUMBER日本語テストガイド

## 📚 **目次**

1. [はじめに](#はじめに)
2. [セットアップとインストール](#セットアップとインストール)
3. [プロジェクト構造](#プロジェクト構造)
4. [フィーチャーファイルの書き方](#フィーチャーファイルの書き方)
5. [ステップ定義の作成](#ステップ定義の作成)
6. [テストの実行](#テストの実行)
7. [レポート機能](#レポート機能)
8. [ベストプラクティス](#ベストプラクティス)
9. [トラブルシューティング](#トラブルシューティング)

---

## 🌟 **はじめに**

このプロジェクトではCucumberを使用して**日本語でのBDD（振る舞い駆動開発）**を実現しています。

### **Cucumber日本語版の特徴**

- ✅ 日本語のGherkin記法でテストケースを記述
- ✅ 日本語のステップ定義で自然な読み書き
- ✅ 日本語のログとエラーメッセージ
- ✅ 日本語環境に最適化されたブラウザ設定
- ✅ 日本語レポート生成

---

## ⚙️ **セットアップとインストール**

### **1. 依存関係のインストール**

```bash
# 全ての依存関係をインストール
npm install

# Playwrightブラウザのインストール
npm run test:install-browsers
```

### **2. 日本語テスト環境の確認**

```bash
# 日本語スモークテストを実行
npm run test:cucumber:jp:smoke
```

---

## 📁 **プロジェクト構造**

```
Playwright/
├── features/jp/                       # 🇯🇵 日本語フィーチャーファイル
│   ├── お問い合わせ.feature            # お問い合わせ機能
│   ├── オートメーション演習.feature     # 総合テスト
│   └── step_definitions/              # 日本語ステップ定義
│       ├── 世界.js                     # Cucumber World コンテキスト
│       ├── お問い合わせ-steps.js       # お問い合わせ専用ステップ
│       └── 共通-steps.js               # 再利用可能ステップ
│
├── hooks/                             # 🪝 フック
│   └── 日本語ブラウザ.hooks.js         # 日本語ブラウザライフサイクル
│
├── reports/                           # 📊 日本語テストレポート
│   ├── cucumber-jp-report.html
│   └── cucumber-jp-report.json
│
├── .cucumberrc.jp.json                # 🔧 日本語Cucumber設定
└── package.json                       # 📦 日本語テストスクリプト追加済み
```

---

## 🥒 **フィーチャーファイルの書き方**

### **基本的なGherkin日本語記法**

```gherkin
# language: ja
@お問い合わせ @回帰テスト
機能: お問い合わせ機能
  Automation Exercise ウェブサイトのユーザーとして
  サポートチームに連絡を取りたい
  ヘルプやフィードバックを提供するために

  背景:
    前提 Automation Exercise のホームページにいる

  @スモーク @正常系
  シナリオ: お問い合わせフォームの送信が成功する
    前提 お問い合わせページに移動する
    もし 有効なデータでフォームを入力する
    かつ 送信ボタンをクリックする
    ならば 成功メッセージが表示される

  @データ駆動
  シナリオアウトライン: 異なるデータでフォームを送信する
    もし "<名前>" と "<メール>" でフォームを入力する
    ならば "<結果>" が表示される
    
    例:
      | 名前     | メール              | 結果   |
      | 田中太郎 | tanaka@email.com    | 成功   |
      | 佐藤花子 | sato@email.com      | 成功   |
```

### **使用可能な日本語タグ**

- `@スモーク` - スモークテスト
- `@回帰テスト` - 回帰テスト  
- `@正常系` - 正常パステスト
- `@異常系` - エラー/バリデーションテスト
- `@低速` - 高タイムアウトが必要なテスト
- `@表示モード` - ブラウザ表示でテスト実行
- `@スクリーンショット` - 自動スクリーンショット撮影

---

## 🔧 **ステップ定義の作成**

### **日本語ステップ定義の例**

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('Automation Exercise のホームページにいる', async function() {
  await this.homePage.openBrowser();
  await this.waitForPageLoad();
});

When('{string} をクリックする', async function(buttonText) {
  await this.page.click(`text=${buttonText}`);
});

Then('テキスト {string} が表示されている', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(true);
});
```

### **World コンテキストの使用**

```javascript
// ステップ定義内で使用可能な日本語メソッド
this.page          // Playwright ページインスタンス
this.browser       // ブラウザインスタンス
this.homePage      // ホームページオブジェクト
this.contactPage   // お問い合わせページオブジェクト
this.testData      // 生成されたテストデータ
this.takeScreenshot() // スクリーンショット撮影
this.logSuccess()  // 成功ログ（日本語）
this.logError()    // エラーログ（日本語）
```

---

## 🚀 **テストの実行**

### **基本的な実行コマンド**

```bash
# 全ての日本語Cucumberテストを実行
npm run test:cucumber:jp

# ブラウザ表示モードで実行
npm run test:cucumber:jp:headed

# スモークテストのみ実行
npm run test:cucumber:jp:smoke

# 回帰テストを実行
npm run test:cucumber:jp:regression

# お問い合わせ機能のテストのみ実行
npm run test:cucumber:jp:contact
```

### **ブラウザ別実行**

```bash
# Firefox で実行
npm run test:cucumber:jp:firefox

# Safari/WebKit で実行
npm run test:cucumber:jp:webkit

# Chrome（デフォルト）で実行
npm run test:cucumber:jp
```

### **タグによる実行**

```bash
# スモークテストのみ
npx cucumber-js --config .cucumberrc.jp.json --tags "@スモーク"

# 回帰テスト、低速テストを除外
npx cucumber-js --config .cucumberrc.jp.json --tags "@回帰テスト and not @低速"

# お問い合わせ機能のテスト
npx cucumber-js --config .cucumberrc.jp.json --tags "@お問い合わせ"
```

### **特定のフィーチャーファイル実行**

```bash
# 特定のフィーチャーファイルを実行
npx cucumber-js features/jp/お問い合わせ.feature --config .cucumberrc.jp.json

# 特定のシナリオを実行（行番号指定）
npx cucumber-js features/jp/お問い合わせ.feature:15 --config .cucumberrc.jp.json
```

### **環境変数を使用した実行**

```bash
# 表示モード
HEADED=true npm run test:cucumber:jp

# ブラウザ指定
BROWSER=firefox npm run test:cucumber:jp

# 環境指定
TEST_ENV=production npm run test:cucumber:jp
```

---

## 📊 **レポート機能**

### **HTMLレポート**

```bash
# HTMLレポート生成
npm run test:cucumber:jp
# 生成場所: reports/cucumber-jp-report.html
```

### **JSONレポート**

```bash
# JSONデータとして出力
npx cucumber-js --config .cucumberrc.jp.json --format json:reports/cucumber-jp-data.json
```

### **カスタム日本語レポート**

```javascript
// reports/japanese-report-generator.js
const report = require('multiple-cucumber-html-reporter');

report.generate({
    jsonDir: './reports/',
    reportPath: './reports/jp-multi-report/',
    metadata: {
        browser: {
            name: 'chrome',
            version: '最新版'
        },
        device: 'ローカルテストマシン',
        platform: {
            name: 'Windows',
            version: '10'
        }
    },
    customData: {
        title: '日本語Cucumberテストレポート',
        data: [
            {label: '実行日時', value: new Date().toLocaleString('ja-JP')},
            {label: 'テスト環境', value: 'ステージング'},
            {label: '実行者', value: 'QAチーム'}
        ]
    }
});
```

---

## 🎯 **ベストプラクティス**

### **1. フィーチャーファイルの組織化**

```gherkin
# ✅ 良い例 - 明確で意味のある日本語
シナリオ: ユーザーが有効な情報でお問い合わせフォームを正常に送信する
  前提 お問い合わせページにいる
  もし 有効な顧客情報でフォームを入力する
  かつ フォームを送信する
  ならば 成功確認メッセージが表示される

# ❌ 悪い例 - 技術的すぎて理解困難
シナリオ: お問い合わせフォーム送信テスト
  前提 "/contact_us" に移動する
  もし "#name" に "田中" を入力する
  かつ "#email" に "tanaka@test.com" を入力する
  ならば ".success" に "送信完了" が含まれる
```

### **2. 背景の適切な使用**

```gherkin
機能: ユーザー認証

  背景:
    前提 ログインページにいる
    # 全てのシナリオに必要な共通セットアップのみ

  シナリオ: 有効なログイン
    # 特定のテストステップ...
    
  シナリオ: 無効なログイン  
    # 特定のテストステップ...
```

### **3. データ駆動テスト**

```gherkin
# 似たようなテストケースにはシナリオアウトラインを使用
シナリオアウトライン: 異なる認証情報でのログイン
  もし "<ユーザー名>" と "<パスワード>" でログインする
  ならば "<メッセージ>" が表示される
  
  例:
    | ユーザー名 | パスワード | メッセージ        |
    | 有効       | 有効       | ようこそ          |
    | 無効       | 有効       | 無効なユーザー    |
    | 有効       | 無効       | パスワードが違います |
```

### **4. ステップ定義**

```javascript
// ✅ 良い例 - 再利用可能で柔軟
When('{string} と {string} でフォームを入力する', async function(name, email) {
  await this.contactPage.fillForm(name, email);
});

// ❌ 悪い例 - 特定すぎる
When('田中太郎とtanaka@example.comでお問い合わせフォームを入力する', async function() {
  await this.contactPage.fillForm('田中太郎', 'tanaka@example.com');
});
```

---

## 🐛 **トラブルシューティング**

### **よくある問題**

#### **1. "ステップ定義が見つかりません"**

```bash
# エラー: 前提 Automation Exercise のホームページにいる

# 解決策: ステップ定義が存在することを確認
Given('Automation Exercise のホームページにいる', async function() {
  // 実装
});
```

#### **2. "ブラウザが起動しません"**

```javascript
// 世界.js を確認
async initializeBrowser() {
  try {
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: ['--lang=ja-JP'] // 日本語設定
    });
    // ...
  } catch (error) {
    console.error('ブラウザの起動に失敗しました:', error);
    throw error;
  }
}
```

#### **3. "文字化けが発生"**

```javascript
// .cucumberrc.jp.json で文字エンコーディングを確認
{
  "worldParameters": {
    "encoding": "UTF-8",
    "locale": "ja-JP"
  }
}
```

#### **4. "日本語ステップが認識されない"**

```gherkin
# フィーチャーファイルの先頭に言語指定を追加
# language: ja
機能: テスト機能
```

### **デバッグのヒント**

```javascript
// 1. デバッグステップを追加
When('デバッグで一時停止する', async function() {
  await this.page.pause(); // Playwright デバッガー
});

// 2. スクリーンショットを撮影
When('デバッグ用スクリーンショットを撮る', async function() {
  await this.takeScreenshot('デバッグ-画面');
});

// 3. 日本語ログを出力
When('現在のページ情報をログ出力する', async function() {
  this.logInfo(`URL: ${this.page.url()}`);
  this.logInfo(`タイトル: ${await this.page.title()}`);
});
```

---

## 📝 **Playwrightテストからの移行**

### **PlaywrightテストからCucumber日本語版への移行**

**Playwrightテスト:**
```javascript
test('お問い合わせフォーム送信', async ({ page }) => {
  await page.goto('https://example.com/contact');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('[type="submit"]');
  await expect(page.locator('.success')).toBeVisible();
});
```

**Cucumber日本語フィーチャー:**
```gherkin
シナリオ: お問い合わせフォームを送信する
  前提 "https://example.com/contact" に移動する
  もし "email" フィールドに "test@example.com" を入力する
  かつ 送信ボタンをクリックする
  ならば 成功メッセージが表示される
```

**日本語ステップ:**
```javascript
Given('{string} に移動する', async function(url) {
  await this.page.goto(url);
});

When('{string} フィールドに {string} を入力する', async function(field, text) {
  await this.page.fill(`[name="${field}"]`, text);
});
```

---

## 📈 **CI/CDとの統合**

### **GitHub Actions 日本語テスト例**

```yaml
name: 日本語Cucumberテスト

on: [push, pull_request]

jobs:
  japanese-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: 依存関係のインストール
        run: npm ci
        
      - name: Playwrightのインストール
        run: npm run test:install-browsers
        
      - name: 日本語Cucumberテストの実行
        run: npm run test:cucumber:jp
        
      - name: レポートのアップロード
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: japanese-cucumber-reports
          path: reports/
```

---

## 🎯 **今後の開発計画**

### **Phase 1: 基本セットアップ (✅ 完了)**
- ✅ 日本語Cucumberセットアップ
- ✅ 基本フィーチャーファイル作成
- ✅ 日本語ステップ定義実装
- ✅ 日本語レポート設定

### **Phase 2: 高度な機能 (🚧 提案)**
- 🔄 APIテスト統合（日本語）
- 🔄 ビジュアル回帰テスト
- 🔄 パフォーマンステストシナリオ
- 🔄 クロスブラウザ並列実行

### **Phase 3: CI/CD統合 (📋 計画中)**
- 📋 GitHub Actions ワークフロー
- 📋 Slack/Teams 日本語通知
- 📋 テスト結果ダッシュボード
- 📋 自動レポート生成

---

## 📞 **サポート**

問題が発生した場合は：

1. [トラブルシューティング](#トラブルシューティング) セクションを確認
2. コンソールのログを確認
3. デバッグ機能を使用
4. [Cucumber公式ドキュメント](https://cucumber.io/docs)を参照
5. [Playwright公式ドキュメント](https://playwright.dev)を参照

---

**楽しいテストを！ 🎉**
**頑張って！ 💪**
