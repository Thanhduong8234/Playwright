# 🥒 Cucumber Test Runner - 使用ガイド

## 概要

Cucumber Test Runnerは、日本語のCucumberテストを簡単に実行するための強力なツールです。特定のテストケース、テストスイート、またはタグでフィルタリングしたテストを柔軟に実行できます。

## 🚀 クイックスタート

### 1. インタラクティブモード（推奨）

```bash
npm run test:run:interactive
```

または

```bash
node test-runner.js --interactive
```

インタラクティブモードでは、メニューから選択するだけで簡単にテストを実行できます。

### 2. 定義済みテストスイート

```bash
# スモークテスト
npm run test:run:smoke

# お問い合わせテスト
npm run test:run:contact

# 回帰テスト
npm run test:run:regression

# E2Eテスト
npm run test:run:e2e
```

### 3. レポート生成付きテスト実行

```bash
# レポート生成してブラウザで自動オープン
npm run test:run:report

# 各テストスイートでレポート生成
npm run test:run:smoke:report
npm run test:run:contact:report
npm run test:run:regression:report

# レポート生成なしで実行
npm run test:run:no-report

# 既存のレポートを開く
npm run test:open:report
```

### 4. ブラウザ指定

```bash
# Firefoxで実行
npm run test:run:firefox

# WebKit (Safari)で実行
npm run test:run:webkit

# ヘッドモード（ブラウザ表示）で実行
npm run test:run:headed
```

## 📋 利用可能なコマンド

### NPM Scripts

| コマンド | 説明 |
|---------|------|
| `npm run test:run` | デフォルトでテスト実行 |
| `npm run test:run:interactive` | インタラクティブモード |
| `npm run test:run:smoke` | スモークテスト実行 |
| `npm run test:run:contact` | お問い合わせテスト実行 |
| `npm run test:run:regression` | 回帰テスト実行 |
| `npm run test:run:e2e` | E2Eテスト実行 |
| `npm run test:run:headed` | ヘッドモードでスモークテスト |
| `npm run test:run:firefox` | Firefoxでスモークテスト |
| `npm run test:run:webkit` | WebKitでスモークテスト |
| `npm run test:run:parallel` | 並列実行で回帰テスト |
| `npm run test:run:help` | ヘルプ表示 |
| `npm run test:run:list` | テストスイート一覧表示 |
| `npm run test:run:report` | スモークテスト + レポート自動オープン |
| `npm run test:run:smoke:report` | スモークテスト + レポート生成 |
| `npm run test:run:contact:report` | お問い合わせテスト + レポート生成 |
| `npm run test:run:regression:report` | 回帰テスト + レポート生成 |
| `npm run test:run:no-report` | レポート生成なしで実行 |
| `npm run test:open:report` | 既存レポートを開く |

### 直接コマンド

```bash
# 基本的な使用方法
node test-runner.js [オプション]

# オプション一覧
-f, --feature <file>     # 特定のfeatureファイルを実行
-t, --tags <tags>        # タグでフィルタリング
-s, --suite <suite>      # 定義済みテストスイートを実行
-b, --browser <browser>  # ブラウザを指定
--headed                 # ブラウザを表示モードで実行
-p, --parallel <num>     # 並列実行数
  --format <format>        # 出力フォーマット
  -i, --interactive        # インタラクティブモード
  -l, --list               # テストスイート一覧表示
  --no-report              # レポート生成を無効にする
  --open-report            # テスト完了後にレポートを開く
  -h, --help               # ヘルプ表示
```

## 🎯 使用例

### 1. 特定のfeatureファイルを実行

```bash
# お問い合わせ機能のテストのみ実行
node test-runner.js --feature "features/jp/お問い合わせ.feature"

# ヘッドモードで実行
node test-runner.js --feature "features/jp/お問い合わせ.feature" --headed

# Firefoxで実行
node test-runner.js --feature "features/jp/お問い合わせ.feature" --browser firefox --headed
```

### 2. タグでフィルタリング

```bash
# スモークテストのみ実行
node test-runner.js --tags "@スモーク"

# スモークテストかつお問い合わせテスト
node test-runner.js --tags "@スモーク and @お問い合わせ"

# スキップタグを除外
node test-runner.js --tags "@スモーク and not @スキップ"

# 複数条件
node test-runner.js --tags "(@スモーク or @回帰テスト) and not @スロー"
```

### 3. テストスイートで実行

```bash
# スモークテストスイート
node test-runner.js --suite smoke

# お問い合わせテストスイート（Firefoxで）
node test-runner.js --suite contact --browser firefox --headed

# 回帰テストスイート（並列実行）
node test-runner.js --suite regression --parallel 3
```

### 4. 出力フォーマット指定

```bash
# プリティフォーマット
node test-runner.js --suite smoke --format pretty

# JSON出力
node test-runner.js --suite smoke --format json

# HTML出力
node test-runner.js --suite smoke --format html
```

### 5. 並列実行

```bash
# 3つのワーカーで並列実行
node test-runner.js --suite regression --parallel 3

# 単一実行（デバッグ用）
node test-runner.js --suite smoke --parallel 1
```

### 6. レポート生成とオープン

```bash
# レポート生成してブラウザで自動オープン
node test-runner.js --suite smoke --open-report

# レポート生成のみ（オープンしない）
node test-runner.js --suite smoke

# レポート生成を無効化
node test-runner.js --suite smoke --no-report

# 複数フォーマットでレポート生成
node test-runner.js --suite smoke --format pretty --open-report
```

## 📊 定義済みテストスイート

| スイート名 | タグ | 説明 |
|-----------|------|------|
| `smoke` | `@スモーク` | 基本的な機能をテストする |
| `contact` | `@お問い合わせ` | お問い合わせ機能のテスト |
| `regression` | `@回帰テスト` | 全機能の回帰テスト |
| `e2e` | `@E2E` | エンドツーエンドテスト |
| `validation` | `@バリデーション` | フォームバリデーションテスト |
| `performance` | `@パフォーマンス` | パフォーマンステスト |

## 🌐 ブラウザオプション

| ブラウザ | 説明 |
|---------|------|
| `chromium` | Chromium（デフォルト） |
| `firefox` | Firefox |
| `webkit` | WebKit（Safari） |

## 📊 レポート機能

### 生成されるレポートファイル

Test Runnerは以下のレポートファイルを自動生成します：

| ファイル名 | 説明 |
|-----------|------|
| `reports/cucumber-report.html` | 標準Cucumberレポート |
| `reports/cucumber-enhanced-report.html` | 拡張HTMLレポート（推奨） |
| `reports/cucumber-report.json` | JSON形式のテストデータ |

### 拡張HTMLレポートの特徴

✅ **美しいUI**: モダンなデザインと日本語対応  
✅ **統計情報**: 成功率、実行時間、シナリオ数  
✅ **詳細表示**: 各ステップの実行結果  
✅ **エラー情報**: 失敗時のエラーメッセージ  
✅ **レスポンシブ**: モバイル対応デザイン  

### レポートの使用方法

```bash
# テスト実行 + レポート自動オープン
npm run test:run:smoke:report

# 既存レポートを開く
npm run test:open:report

# 手動でレポートを開く
start reports/cucumber-enhanced-report.html
```

## 🔧 高度な使用方法

### 1. 環境変数の設定

```bash
# ヘッドモードを強制
export HEADED=true
node test-runner.js --suite smoke

# ブラウザを指定
export BROWSER=firefox
node test-runner.js --suite smoke
```

### 2. カスタムタグの組み合わせ

```bash
# 複雑なタグフィルタリング
node test-runner.js --tags "(@スモーク or @重要) and not (@スロー or @不安定)"

# 特定の機能のテストのみ
node test-runner.js --tags "@お問い合わせ and @正常系"

# バリデーションテストのみ
node test-runner.js --tags "@バリデーション"
```

### 3. デバッグモード

```bash
# 単一実行でデバッグ
node test-runner.js --feature "features/jp/お問い合わせ.feature" --parallel 1 --headed

# 詳細出力
node test-runner.js --suite smoke --format pretty --parallel 1
```

## 🐛 トラブルシューティング

### 1. タイムアウトエラー

```bash
# タイムアウトが発生する場合は単一実行を試す
node test-runner.js --suite smoke --parallel 1

# ヘッドモードで確認
node test-runner.js --suite smoke --headed --parallel 1
```

### 2. ブラウザが起動しない

```bash
# ブラウザをインストール
npm run test:install-browsers

# 特定のブラウザをテスト
node test-runner.js --suite smoke --browser chromium --headed
```

### 3. featureファイルが見つからない

```bash
# 利用可能なファイルを確認
node test-runner.js --list

# インタラクティブモードで選択
node test-runner.js --interactive
```

## 📈 パフォーマンス最適化

### 1. 並列実行の調整

```bash
# CPUコア数に応じて調整（推奨: CPUコア数 - 1）
node test-runner.js --suite regression --parallel 3

# 軽いテストは多めに並列実行
node test-runner.js --tags "@スモーク" --parallel 4

# 重いテストは少なめに並列実行
node test-runner.js --tags "@E2E" --parallel 2
```

### 2. ブラウザ選択

```bash
# 最速: Chromium
node test-runner.js --suite smoke --browser chromium

# クロスブラウザテスト
node test-runner.js --suite smoke --browser firefox
node test-runner.js --suite smoke --browser webkit
```

## 🔄 CI/CD統合

### GitHub Actions例

```yaml
- name: Run Smoke Tests
  run: npm run test:run:smoke

- name: Run Regression Tests
  run: npm run test:run:parallel

- name: Run Cross-browser Tests
  run: |
    npm run test:run:firefox
    npm run test:run:webkit
```

### Jenkins例

```bash
# パイプラインでの使用
sh 'npm run test:run:smoke'
sh 'npm run test:run:regression'
```

## 📝 カスタマイズ

### 1. 新しいテストスイートの追加

`test-runner.js`の`testSuites`オブジェクトに追加:

```javascript
'custom': {
    name: 'カスタムテスト',
    tags: '@カスタム',
    description: 'カスタムテストスイート'
}
```

### 2. デフォルト設定の変更

`test-runner.js`のコンストラクタで設定を変更:

```javascript
this.configFile = '.cucumberrc.jp.json';
this.featuresDir = 'features/jp';
```

## 🎉 まとめ

Cucumber Test Runnerを使用することで、日本語のCucumberテストを効率的に実行できます。インタラクティブモードから始めて、慣れてきたら直接コマンドを使用することをお勧めします。

質問や問題がある場合は、`npm run test:run:help`でヘルプを確認してください。
