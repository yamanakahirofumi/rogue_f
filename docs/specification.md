# RogueF 仕様書

## 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [システム構成](#システム構成)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [画面構成とルーティング](#画面構成とルーティング)
5. [コンポーネント階層](#コンポーネント階層)
6. [ゲームメカニクス](#ゲームメカニクス)
7. [APIリファレンス](#apiリファレンス)
8. [データモデル](#データモデル)
9. [技術的詳細](#技術的詳細)
10. [開発状況と課題](#開発状況と課題)

---

## プロジェクト概要
RogueFは、Angular (v14) を使用して構築されたローグライクゲームのフロントエンドアプリケーションです。
バックエンドAPI (`/api`) と連携し、ダンジョンの探索、プレイヤーの状態管理、アイテムの取得などの機能を提供します。

## システム構成
- **フロントエンド**: Angular 14.0.4
- **バックエンド連携**: `proxy.conf.json` により `http://localhost:8080/` の `/api` にプロキシされます。
- **データ通信**:
  - **HTTP (REST)**: プレイヤー操作、情報取得に使用。
  - **Server-Sent Events (SSE)**: ダンジョンフィールドのリアルタイム更新に使用。

## ディレクトリ構成
主要なディレクトリ構成は以下の通りです。

- `src/app/admin/`: 管理画面機能。
  - `item/`: アイテム管理コンポーネント。
  - `menu/`: 管理メニューコンポーネント。
  - `world/`: 世界設定コンポーネント。
- `src/app/fields/`: ゲームメイン機能。
  - `d/`: ドメインモデル（PlayerDomain等）。
  - `dungeon/`: メインのダンジョン探索画面。
  - `message/`: ゲーム内メッセージ表示用。
  - `player/`: ユーザー作成画面。
  - `services/`: APIアクセス、SSE通信、状態管理等のサービス。
  - `status-bar/`: HP/スタミナ等のバー表示用。
- `src/app/random/`: 乱数生成等のユーティリティ。
- `src/@types/`: グローバルなTypeScript型定義。

## 画面構成とルーティング
アプリケーションは以下のルートで構成されています。

- `/user/create`: **ユーザー作成画面**
  - 新規プレイヤーの作成を行います。
- `/play`: **プレイ画面**
  - ダンジョン探索のメイン画面です。
- `/admin`: **管理画面**
  - 世界設定、アイテム設定、メニュー管理などを行います。
  - `/admin/menu`: 管理メニューを表示します。
  - `/admin/menu/menu`: 世界設定（WorldComponent）を表示します（子ルート）。

## コンポーネント階層
主なコンポーネントの階層構造は以下の通りです。

- `AppComponent`
  - `CreateUserComponent` (ユーザー作成)
  - `DungeonComponent` (プレイ画面)
    - `MessageComponent` (メッセージ表示)
    - `StatusBarComponent` (ステータス表示)
  - `AdminModule` (遅延読み込み)
    - `MenuComponent` (管理メニュー)
      - `WorldComponent` (世界設定、子ルートとして表示)

## ゲームメカニクス

### プレイヤー属性
- **HP**: 体力。0になるとゲームオーバーが想定されます。
- **スタミナ**: 行動（移動等）によって消費されます。スタミナが切れると代わりにHPが減少します。
- **ゴールド**: ゲーム内通貨。

### 行動とスタミナ
- 移動やアイテム取得などの行動にはインターバル（`actionInterval`）が設定されており、連続した高速な行動は制限されます。
- `IntervalService` により、3秒ごとにスタミナが自動回復します。

### 操作方法
- **移動**:
  - キーボード: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
  - Viライク: `h`, `j`, `k`, `l`
  - テンキー: `2`, `4`, `6`, `8`
- **アイテム取得**: `g`
- **階段の上り下り**: `<` (上), `>` (下)

## APIリファレンス

### ユーザー管理
- `GET /api/user/name/{name}/exist`: ユーザー名の存在確認。
  - レスポンス: `boolean`
- `POST /api/user/name/{name}`: ユーザー作成。
  - レスポンス: `string` (作成されたユーザーのID)

### プレイヤー情報
- `GET /api/player/{userId}`: プレイヤー情報の取得。
  - レスポンス: `Player`
- `PUT /api/player/{userId}/command/{command}`: 移動やアクションのコマンド送信。
  - コマンド: `top`, `down`, `right`, `left`, `pickup`, `downStairs`, `upStairs`
  - レスポンス (pickup以外): `{ [name: string]: boolean }`
  - レスポンス (pickup): `PickUpResult`

### フィールド・ダンジョン
- `GET /api/fields/{userId}/now`: フィールドの現在の状態取得。
  - レスポンス: `DisplayData[]`
- `GET /api/fields/{userId}/info`: ダンジョン情報の取得。
  - レスポンス: `DungeonInfo`
- `POST /api/player/{userId}/command/dungeon/default`: ダンジョンへの入場。
- `GET /api/fields/{userId}` (SSE): フィールドのリアルタイム更新。
  - ストリーム要素: `DisplayData`

## データモデル

### Player
```typescript
{
  id: string;        // ユーザーID
  name: string;      // ユーザー名
  gold: number;      // 所持ゴールド
  actionTime: number; // 最終行動時刻のタイムスタンプ
}
```

### DisplayData
```typescript
{
  position: {
    x: number;
    y: number;
  };
  data: string[];    // 描画データの配列
}
```

### DungeonInfo (mapSet)
```typescript
{
  name: string;      // ダンジョン名
  level: number;     // 現在の階層
}
```

### PickUpResult (resultSet)
- `result`: boolean (取得成否)
- `type`: number (アイテム種別: 1=ゴールド, 2=アイテム)
- `gold`: number (取得したゴールド量, type=1の場合)
- `itemName`: string (取得したアイテム名, type=2の場合)
- `message`: string (エラーメッセージ等, 例: 'NoObjectOnTheFloor')

## 技術的詳細

### 主要サービス
- **FieldsAccessService**: 全てのHTTPリクエスト（REST API）を統括します。
- **SseFieldService**: `EventSource` を使用し、バックエンドからのフィールド更新イベントをリアルタイムに受信します。
- **IntervalService**: `rxjs` の `interval` をラップし、ゲーム内の定期的なイベント（スタミナ回復等）のトリガーを提供します。
- **StorageService**: ブラウザの `localStorage` へのアクセスをカプセル化し、プレイヤー情報の永続化等を行います。

### リアルタイム更新 (SSE)
- `SseFieldService` を通じて `GET /api/fields/{userId}` から配信されるイベントを購読します。
- 他のプレイヤーの移動や環境の変化がリアルタイムに反映されます。

### セッション管理
- `StorageService` を使用して、ブラウザの `localStorage` に `playerId` を保存します。
- 初回アクセス時またはユーザー作成時に `playerId` を取得・保存し、以降のAPIリクエストで使用します。

### フロントエンドでの状態管理
- `PlayerDomain` クラスがプレイヤーの現在の状態（HP、スタミナ等）を管理しています。
- 現状、HPやスタミナの初期値や最大値は `PlayerDomain` 内にハードコードされています。

## 開発状況と課題

### 既知のバグ・不整合
- **管理画面メニュー**: `MenuComponent` において、テンプレート上は3項目（Dungeon, Item, World）存在しますが、内部の `isSelected` 配列が2要素で初期化されており、インデックスの不整合が発生しています。

### テスト状況
現在、以下の理由により複数の単体テストが失敗しています：
- **HttpClientModuleの欠落**: `HttpClientTestingModule` がインポートされていない。
- **Routerの欠落**: `RouterTestingModule` がインポートされていない。
- **期待値の不一致**: `AppComponent` のタイトル検証（`rogueF` vs `rogue-f`）。
- **DOM要素の不在**: `AppComponent` で存在しない `.content span` を探している。
- **アニメーションモジュールの欠落**: `BrowserAnimationsModule` が必要。

### 今後の課題
1. **バックエンドモデルとの同期**: HP、スタミナ、経験値などの属性をバックエンドから取得・反映する。
2. **エラーハンドリングの強化**: APIエラーやネットワーク切断（SSE再接続など）への対応。
3. **ゲームルールの実装**: 戦闘メカニクス、レベルアップ、アイテム効果の詳細実装。
4. **管理画面の機能拡充**: `admin` 配下の各コンポーネントの要件定義と実装。
