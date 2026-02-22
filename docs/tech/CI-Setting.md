# CI/CD 設定

本プロジェクトでは、GitHub Actions を使用してビルドとテストの自動化を行っています。

## 1. GitHub Actions 設定

### ワークフローの概要
GitHub へのプッシュ（Push）またはプルリクエスト（Pull Request）が作成された際に、以下のプロセスが自動的に実行されます。

1. **チェックアウト**：リポジトリのソースコードを取得します。
2. **Node.js のセットアップ**：プロジェクトで規定されたバージョンの Node.js をセットアップします（詳細は [技術スタック](Tech-Stack.md) を参照）。
3. **npm 依存関係のキャッシュ**：ビルド時間の短縮のため、npm の依存関係をキャッシュします。
4. **ビルドとテスト**：`npm run build` および `npm test` を実行し、プロジェクトのビルドとテストを実施します。
5. **カバレッジ測定**：テスト実行時にカバレッジレポートを生成します。

### 設定ファイルの例 (`.github/workflows/build.yml`)
以下は、Angular を使用した標準的なワークフロー構成です。

```yaml
name: Angular CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '16'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Lint
      run: npx ng lint
    - name: Build
      run: npx ng build
    - name: Test
      run: npx ng test --no-watch --no-progress --code-coverage --browsers=ChromeHeadless
    - name: Upload Coverage
      uses: actions/upload-artifact@v4
      with:
        name: coverage-report
        path: coverage/
```

## 2. CI の目的
- **品質の維持**：常にビルドが通る状態を維持し、意図しない破壊的変更を早期に発見します。
- **自動テスト**：Jasmine によるユニットテストを自動実行し、ロジックの正しさを検証します。
- **カバレッジの可視化**：テストの網羅率を測定し、テスト不足の箇所を特定します。
- **静的解析**：ESLint 等による静的解析を行い、コードの品質と一貫性を保ちます。
