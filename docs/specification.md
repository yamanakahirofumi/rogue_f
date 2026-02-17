# RogueF 仕様書

## プロジェクト概要
RogueFは、Angular (v14) を使用して構築されたローグライクゲームのフロントエンドアプリケーションです。
バックエンドAPI (`/api`) と連携し、ダンジョンの探索、プレイヤーの状態管理、アイテムの取得などの機能を提供します。

## システム構成
- **フロントエンド**: Angular 14.0.4
- **バックエンド連携**: `proxy.conf.json` により `http://localhost:8080/` の `/api` にプロキシされます。
- **データ通信**: HTTPクライアント (`HttpClient`) および Server-Sent Events (SSE) を使用してダンジョン情報のリアルタイム更新を行います。

## 主要画面
1. **ユーザー作成画面 (`/user/create`)**: 新規プレイヤーの作成。
2. **プレイ画面 (`/play`)**: ダンジョン探索のメイン画面。
3. **管理画面 (`/admin`)**: 世界設定、アイテム設定、メニュー管理など。

## ゲームメカニクス
### プレイヤー属性
- **HP**: 体力。0になるとゲームオーバー（の実装が想定される）。
- **スタミナ**: 行動（移動等）によって消費される。スタミナが切れると代わりにHPが減少する。
- **ゴールド**: ゲーム内通貨。

### 行動とスタミナ
- 移動やアイテム取得などの行動にはインターバル（`actionInterval`）が設定されており、連続した高速な行動は制限されます。
- 一定時間（3秒ごと）でスタミナが自動回復します。

### 操作方法
- **移動**: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` および `h`, `j`, `k`, `l`, `2`, `4`, `6`, `8`
- **アイテム取得**: `g`
- **階段の上り下り**: `<` (上), `>` (下)

## API仕様 (コードより推論)
- `GET /api/user/name/{name}/exist`: ユーザー名の存在確認。
- `POST /api/user/name/{name}`: ユーザー作成。
- `GET /api/player/{userId}`: プレイヤー情報の取得。
- `GET /api/fields/{userId}/now`: フィールドの現在の状態取得。
- `GET /api/fields/{userId}/info`: ダンジョン情報の取得。
- `PUT /api/player/{userId}/command/{command}`: 移動やアクションのコマンド送信（top, down, right, left, pickup, downStairs, upStairs）。
- `POST /api/player/{userId}/command/dungeon/default`: ダンジョンへの入場。

## テスト状況
現状、以下の理由により複数の単体テストが失敗しています（修正が必要な項目）：
- **HttpClientModuleの欠落**: 各コンポーネントのテスト用Moduleにおいて `HttpClientTestingModule` がインポートされていないため、`NullInjectorError: No provider for HttpClient!` が発生しています。
- **期待値の不一致**: `AppComponent` のテストで、実際のタイトル `'rogueF'` と期待値 `'rogue-f'` が異なっています。
- **テンプレートの不一致**: `AppComponent` のテストで、存在しないHTML要素（`.content span`）を検証しようとしています。
- **アニメーションの欠落**: `StatusBarComponent` のテストで、`BrowserAnimationsModule` がインポートされていないためアニメーションの検証に失敗しています。

## 不足している情報 (確実に実装するために必要)
1. **APIレスポンスの詳細定義**:
   - `DisplayData` や `Player` の詳細なフィールド定義（特にバックエンド側の完全なモデル）。
   - アイテム取得時の `resultSet` の詳細（typeごとの意味、itemName以外に何が含まれるかなど）。
2. **エラーハンドリング**:
   - APIがエラー（4xx, 5xx）を返した場合の共通的な処理方針。
   - ネットワーク切断時の挙動（SSEの再接続ロジックなど）。
3. **ゲームルール詳細**:
   - モンスターとの戦闘メカニクス（現状のフロントエンドコードには移動とアイテム取得以外のロジックが少ない）。
   - レベルアップの仕組みや経験値の概念。
   - アイテムの種類と効果の定義。
4. **管理画面の機能**:
   - `admin` 以下のコンポーネント（`item`, `menu`, `world`）の具体的な要件と機能。
