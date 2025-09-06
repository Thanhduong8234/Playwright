/**
 * お問い合わせ機能 STEP DEFINITIONS
 * Contact Us functionality のための日本語ステップ定義
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ===== 前提条件 (GIVEN STEPS) =====

Given('Automation Exercise のホームページにいる', async function() {
  try {
    await this.homePage.openBrowser();
    await this.waitForPageLoad();
    
    // ホームページにいることを確認
    const title = await this.page.title();
    expect(title).toContain('Automation Exercise');
    console.log('✅ ホームページへの移動が成功しました');
  } catch (error) {
    console.error('❌ ホームページへの移動に失敗しました:', error.message);
    throw error;
  }
});

Given('一意のテストデータを生成している', async function() {
  this.generateTestData();
  console.log('✅ 一意のテストデータを生成しました:', this.testData);
});

// ===== アクション (WHEN STEPS) =====

When('お問い合わせページに移動する', async function() {
  await this.homePage.clickContactUs();
  await this.waitForPageLoad();
  console.log('✅ お問い合わせページに移動しました');
});

When('空白のメールでお問い合わせフォームを入力する:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data['名前'],
    data['メール'], // これは空白になります
    data['件名'],
    data['メッセージ']
  );
  
  console.log('✅ 空白のメールでお問い合わせフォームを入力しました');
});

When('有効なデータでお問い合わせフォームを入力する:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  // プレースホルダーを生成されたデータで置換
  const name = data['名前'].replace('{生成された名前}', this.testData.name);
  const email = data['メール'].replace('{生成されたメール}', this.testData.email);
  const subject = data['件名'].replace('{生成された件名}', this.testData.subject);
  const message = data['メッセージ'].replace('{生成されたメッセージ}', this.testData.message);
  
  await this.contactPage.fillContactForm(name, email, subject, message);
  
  console.log('✅ 有効なデータでお問い合わせフォームを入力しました');
});

When('以下のデータでお問い合わせフォームを入力する:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data['名前'],
    data['メール'],
    data['件名'],
    data['メッセージ']
  );
  
  console.log('✅ 提供されたデータでお問い合わせフォームを入力しました');
});

When('無効なデータでお問い合わせフォームを入力する:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.contactPage.fillContactForm(
    data['名前'],
    data['メール'],
    data['件名'],
    data['メッセージ']
  );
  
  console.log('✅ 無効なデータでお問い合わせフォームを入力しました');
});

When('テストファイル {string} をアップロードする', async function(filePath) {
  await this.contactPage.setInputFile(filePath);
  console.log(`✅ ファイルをアップロードしました: ${filePath}`);
});

When('送信ボタンをクリックする', async function() {
  await this.contactPage.clickSubmit();
  console.log('✅ 送信ボタンをクリックしました');
});

When('確認ダイアログを処理する', async function() {
  // ダイアログをトリガーするアクションの前にダイアログハンドラーを設定
  await this.contactPage.acceptDialog();
  console.log('✅ 確認ダイアログを処理しました');
});

// ===== 検証 (THEN STEPS) =====

Then('お問い合わせページのタイトルが表示されている', async function() {
  const title = await this.page.title();
  expect(title).toContain('Contact Us');
  console.log('✅ お問い合わせページのタイトルを確認しました');
});

Then('お問い合わせフォームが表示されている', async function() {
  // フォーム要素が表示されていることを確認
  const formVisible = await this.contactPage.isContactFormVisible();
  expect(formVisible).toBe(true);
  console.log('✅ お問い合わせフォームが表示されています');
});

Then('メールバリデーションメッセージ {string} が表示される', async function(expectedMessage) {
  const validationMessage = await this.contactPage.getEmailValidationMessage();
  expect(validationMessage).toContain(expectedMessage);
  console.log(`✅ メールバリデーションメッセージを確認しました: ${validationMessage}`);
});

Then('成功メッセージ {string} が表示される', async function(expectedMessage) {
  const successMessage = await this.contactPage.getSuccessMessage();
  expect(successMessage).toContain(expectedMessage);
  console.log(`✅ 成功メッセージを確認しました: ${successMessage}`);
});

Then('{string} フィールドのバリデーションエラーが表示される', async function(fieldName) {
  // フィールド名を英語にマッピング
  const fieldMapping = {
    '名前': 'name',
    'メール': 'email', 
    '件名': 'subject',
    'メッセージ': 'message'
  };
  
  const englishFieldName = fieldMapping[fieldName] || fieldName;
  const hasValidationError = await this.contactPage.hasValidationError(englishFieldName);
  expect(hasValidationError).toBe(true);
  console.log(`✅ ${fieldName}フィールドのバリデーションエラーを確認しました`);
});

// ===== ユーティリティステップ =====

When('{int}秒待つ', async function(seconds) {
  await this.page.waitForTimeout(seconds * 1000);
  console.log(`✅ ${seconds}秒待機しました`);
});

// Removed duplicate - using the one in 共通-steps.js

Then('ページタイトルが {string} である', async function(expectedTitle) {
  const actualTitle = await this.page.title();
  expect(actualTitle).toBe(expectedTitle);
  console.log(`✅ ページタイトルを確認しました: ${actualTitle}`);
});

Then('ページタイトルに {string} が含まれている', async function(expectedText) {
  const actualTitle = await this.page.title();
  expect(actualTitle).toContain(expectedText);
  console.log(`✅ ページタイトルに期待されるテキストが含まれています: ${expectedText}`);
});

// ===== 追加の日本語ステップ =====

When('フォームをクリアする', async function() {
  // 全フィールドをクリア
  await this.page.fill('input[name="name"]', '');
  await this.page.fill('input[name="email"]', '');
  await this.page.fill('input[name="subject"]', '');
  await this.page.fill('textarea[name="message"]', '');
  console.log('✅ フォームをクリアしました');
});

Then('フォームが空であることを確認する', async function() {
  const nameValue = await this.page.inputValue('input[name="name"]');
  const emailValue = await this.page.inputValue('input[name="email"]');
  const subjectValue = await this.page.inputValue('input[name="subject"]');
  const messageValue = await this.page.inputValue('textarea[name="message"]');
  
  expect(nameValue).toBe('');
  expect(emailValue).toBe('');
  expect(subjectValue).toBe('');
  expect(messageValue).toBe('');
  console.log('✅ フォームが空であることを確認しました');
});

When('ページを更新する', async function() {
  await this.page.reload();
  await this.waitForPageLoad();
  console.log('✅ ページを更新しました');
});

Then('エラーメッセージが表示されない', async function() {
  // 一般的なエラーメッセージの要素をチェック
  const errorElements = await this.page.locator('.error, .alert-danger, .text-danger').count();
  expect(errorElements).toBe(0);
  console.log('✅ エラーメッセージが表示されていないことを確認しました');
});
