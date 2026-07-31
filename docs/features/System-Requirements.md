# System-Requirements

## 1. システム構成
- **フロントエンド**: Angular 22.0.1
- **バックエンド連携**: `proxy.conf.json` により `http://localhost:8080/` の `/api` にプロキシされます。
- **データ通信**:
  - **HTTP (REST)**: プレイヤー操作、情報取得に使用。
  - **Server-Sent Events (SSE)**: ダンジョンフィールドのリアルタイム更新に使用。
- **開発・動作環境 (ランタイム)**:
  - **Node.js**: `^22.22.3`, `^24.15.0`, または `>=26.0.0` (Angular CLI v22 の動作要件)
  - **パッケージ管理**: npm
  - **開発ツール**: Angular CLI (`@angular/cli`)

## 2. 技術的な制約事項と開発環境の構築
- **ブラウザ要件**:
  - `localStorage` が有効である必要があります（セッション管理のため）。
  - SSE (Server-Sent Events) をサポートするモダンブラウザが必要です。
- **バックエンド接続**:
  - バックエンドサーバーが `localhost:8080` で動作している必要があります（開発環境）。
- **開発環境セットアップ**:
  - Angular CLI (v22) の動作には、特定の Node.js バージョン (22.22.3 以上) が必要です。推奨環境を構築するには、以下の手順を実行してください。
    ```bash
    # NVM (Node Version Manager) を使用した推奨 Node.js バージョンのインストールと切り替え
    nvm install 22.22.3
    nvm use 22.22.3

    # 依存関係のインストール
    npm install

    # テストの実行
    ./node_modules/.bin/ng test --watch=false --browsers=ChromeHeadless
    ```
