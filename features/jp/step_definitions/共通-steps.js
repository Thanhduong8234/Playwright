/**
 * 共通 STEP DEFINITIONS
 * 機能間で再利用可能な日本語ステップ定義
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ===== ナビゲーションステップ =====

Given('{string} に移動する', async function(url) {
  try {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await this.waitForPageLoad();
    console.log(`✅ 移動しました: ${url}`);
  } catch (error) {
    console.error(`❌ ページ移動に失敗しました: ${url}`, error.message);
    throw error;
  }
});

Given('{string} ページにいる', async function(pageName) {
  // ページ名をURLにマッピング
  const pageUrls = {
    'ホームページ': this.baseUrl,
    'お問い合わせ': `${this.baseUrl}/contact_us`,
    'ログイン': `${this.baseUrl}/login`,
    'サインアップ': `${this.baseUrl}/signup`,
    '商品': `${this.baseUrl}/products`,
    'カート': `${this.baseUrl}/view_cart`
  };
  
  const url = pageUrls[pageName];
  if (url) {
    await this.page.goto(url);
    await this.waitForPageLoad();
    console.log(`✅ ${pageName}ページに移動しました`);
  } else {
    throw new Error(`不明なページです: ${pageName}`);
  }
});

When('{string} をクリックする', async function(elementText) {
  await this.page.click(`text=${elementText}`);
  console.log(`✅ クリックしました: ${elementText}`);
});

When('セレクター {string} の要素をクリックする', async function(selector) {
  await this.page.click(selector);
  console.log(`✅ セレクターの要素をクリックしました: ${selector}`);
});

// ===== 入力ステップ =====

When('{string} フィールドに {string} を入力する', async function(fieldLabel, text) {
  // ラベル、プレースホルダー、name属性でフィールドを探す
  const selectors = [
    `[aria-label="${fieldLabel}"]`,
    `[placeholder="${fieldLabel}"]`,
    `[name="${fieldLabel}"]`,
    `input[type="text"]:has-text("${fieldLabel}")`,
    `textarea:has-text("${fieldLabel}")`
  ];
  
  for (const selector of selectors) {
    try {
      await this.page.fill(selector, text);
      console.log(`✅ "${fieldLabel}" に "${text}" を入力しました`);
      return;
    } catch (error) {
      // 次のセレクターを試す
    }
  }
  
  throw new Error(`フィールドが見つかりません: ${fieldLabel}`);
});

When('セレクター {string} のフィールドに {string} を入力する', async function(selector, text) {
  await this.page.fill(selector, text);
  console.log(`✅ セレクターのフィールドに "${text}" を入力しました: ${selector}`);
});

When('{string} フィールドをクリアする', async function(fieldLabel) {
  // 入力ステップと同様のロジック
  const selectors = [
    `[aria-label="${fieldLabel}"]`,
    `[placeholder="${fieldLabel}"]`,
    `[name="${fieldLabel}"]`
  ];
  
  for (const selector of selectors) {
    try {
      await this.page.fill(selector, '');
      console.log(`✅ フィールドをクリアしました: ${fieldLabel}`);
      return;
    } catch (error) {
      // 次のセレクターを試す
    }
  }
  
  throw new Error(`フィールドが見つかりません: ${fieldLabel}`);
});

// ===== 待機ステップ =====

When('{int}秒待機する', async function(seconds) {
  await this.page.waitForTimeout(seconds * 1000);
  console.log(`✅ ${seconds}秒待機しました`);
});

When('要素 {string} が表示されるまで待つ', async function(selector) {
  await this.page.waitForSelector(selector, { state: 'visible' });
  console.log(`✅ 要素が表示されました: ${selector}`);
});

When('要素 {string} が非表示になるまで待つ', async function(selector) {
  await this.page.waitForSelector(selector, { state: 'hidden' });
  console.log(`✅ 要素が非表示になりました: ${selector}`);
});

When('テキスト {string} が表示されるまで待つ', async function(text) {
  await this.page.waitForSelector(`text=${text}`);
  console.log(`✅ テキストが表示されました: ${text}`);
});

// ===== 検証ステップ =====

Then('テキスト {string} が表示されている', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(true);
  console.log(`✅ テキストが表示されています: ${expectedText}`);
});

Then('テキスト {string} が表示されていない', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(false);
  console.log(`✅ テキストが表示されていません: ${expectedText}`);
});

Then('要素 {string} が表示されている', async function(selector) {
  const isVisible = await this.page.isVisible(selector);
  expect(isVisible).toBe(true);
  console.log(`✅ 要素が表示されています: ${selector}`);
});

Then('要素 {string} が表示されていない', async function(selector) {
  const isVisible = await this.page.isVisible(selector);
  expect(isVisible).toBe(false);
  console.log(`✅ 要素が表示されていません: ${selector}`);
});

Then('要素 {string} にテキスト {string} が含まれている', async function(selector, expectedText) {
  const elementText = await this.page.textContent(selector);
  expect(elementText).toContain(expectedText);
  console.log(`✅ 要素に期待されるテキストが含まれています: ${expectedText}`);
});

Then('ページURLに {string} が含まれている', async function(expectedUrlPart) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(expectedUrlPart);
  console.log(`✅ URLに含まれています: ${expectedUrlPart}`);
});

Then('ページURLが {string} である', async function(expectedUrl) {
  const currentUrl = this.page.url();
  expect(currentUrl).toBe(expectedUrl);
  console.log(`✅ URLです: ${expectedUrl}`);
});

// ===== ユーティリティステップ =====

When('スクリーンショットを撮る', async function() {
  await this.takeScreenshot();
});

When('{string} という名前でスクリーンショットを撮る', async function(name) {
  await this.takeScreenshot(name);
});

When('ページを更新する', async function() {
  await this.page.reload();
  await this.waitForPageLoad();
  console.log('✅ ページを更新しました');
});

When('前のページに戻る', async function() {
  await this.page.goBack();
  await this.waitForPageLoad();
  console.log('✅ 前のページに戻りました');
});

When('要素 {string} までスクロールする', async function(selector) {
  await this.page.locator(selector).scrollIntoViewIfNeeded();
  console.log(`✅ 要素までスクロールしました: ${selector}`);
});

When('要素 {string} にホバーする', async function(selector) {
  await this.page.hover(selector);
  console.log(`✅ 要素にホバーしました: ${selector}`);
});

// ===== デバッグステップ =====

When('デバッグで一時停止する', async function() {
  await this.page.pause();
});

When('ページタイトルを表示する', async function() {
  const title = await this.page.title();
  console.log(`📄 現在のページタイトル: ${title}`);
});

When('現在のURLを表示する', async function() {
  const url = this.page.url();
  console.log(`🔗 現在のURL: ${url}`);
});

Then('メッセージ {string} をログに出力する', async function(message) {
  console.log(`📝 カスタムログ: ${message}`);
});

// ===== MISSING STEP DEFINITIONS =====

Then('{string} のテキストが表示されている', async function(expectedText) {
  const isVisible = await this.page.isVisible(`text=${expectedText}`);
  expect(isVisible).toBe(true);
  console.log(`✅ テキストが表示されています: ${expectedText}`);
});

When('メインナビゲーションメニューを確認する', async function() {
  // メニューが表示されていることを確認
  const menuVisible = await this.page.isVisible('nav, .navbar, .menu');
  expect(menuVisible).toBe(true);
  console.log('✅ メインナビゲーションメニューを確認しました');
});

// ===== 日本語特有のステップ =====

When('ブラウザを最大化する', async function() {
  await this.maximizeWindow();
  console.log('✅ ブラウザを最大化しました');
});

Then('ページが正常に読み込まれている', async function() {
  // ページの基本的な要素が読み込まれていることを確認
  await this.waitForPageLoad();
  const readyState = await this.page.evaluate(() => document.readyState);
  expect(readyState).toBe('complete');
  console.log('✅ ページが正常に読み込まれています');
});

When('フォーカスを {string} に移動する', async function(selector) {
  await this.page.focus(selector);
  console.log(`✅ フォーカスを移動しました: ${selector}`);
});

Then('フィールド {string} にフォーカスが当たっている', async function(selector) {
  const focusedElement = await this.page.evaluate(() => document.activeElement);
  const targetElement = await this.page.locator(selector).elementHandle();
  expect(focusedElement).toBe(targetElement);
  console.log(`✅ フィールドにフォーカスが当たっています: ${selector}`);
});

// ===== エラーハンドリング =====

Then('エラーが発生していない', async function() {
  // ブラウザのエラーをチェック
  const errors = await this.page.evaluate(() => {
    return window.errors || [];
  });
  expect(errors.length).toBe(0);
  console.log('✅ エラーが発生していません');
});

When('コンソールエラーをチェックする', async function() {
  // コンソールエラーをキャプチャ
  this.page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ コンソールエラー: ${msg.text()}`);
    }
  });
  console.log('✅ コンソールエラーの監視を開始しました');
});
