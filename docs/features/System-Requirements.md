# System-Requirements

## 1. システム構成
- **フロントエンド**: Angular 17.3.12
- **バックエンド連携**: `proxy.conf.json` により `http://localhost:8080/` の `/api` にプロキシされます。
- **データ通信**:
  - **HTTP (REST)**: プレイヤー操作、情報取得に使用。
  - **Server-Sent Events (SSE)**: ダンジョンフィールドのリアルタイム更新に使用。

## 2. 技術的な制約事項
- ブラウザの `localStorage` が有効である必要があります（セッション管理のため）。
- SSE (Server-Sent Events) をサポートするモダンブラウザが必要です。
- バックエンドサーバーが `localhost:8080` で動作している必要があります（開発環境）。
