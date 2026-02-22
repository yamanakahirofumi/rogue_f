# Implementation-Details

## 1. クラス設計とロジックの概要
詳細は [アーキテクチャ設計](../tech/Architecture.md) を参照してください。

## 2. APIリファレンス

### 2.1 ユーザー管理
- `GET /api/user/name/{name}/exist`: ユーザー名の存在確認。
  - レスポンス: `boolean`
- `POST /api/user/name/{name}`: ユーザー作成。
  - レスポンス: `string` (作成されたユーザーのID)

### 2.2 プレイヤー情報
- `GET /api/player/{userId}`: プレイヤー情報の取得。
  - レスポンス: `Player`
- `PUT /api/player/{userId}/command/{command}`: 移動やアクションのコマンド送信。
  - コマンド: `top`, `down`, `right`, `left`, `pickup`, `downStairs`, `upStairs`
  - レスポンス (pickup以外): `{ [name: string]: boolean }`
  - レスポンス (pickup): `PickUpResult`

### 2.3 フィールド・ダンジョン
- `GET /api/fields/{userId}/now`: フィールドの現在の状態取得。
  - レスポンス: `DisplayData[]`
- `GET /api/fields/{userId}/info`: ダンジョン情報の取得。
  - レスポンス: `DungeonInfo`
- `POST /api/player/{userId}/command/dungeon/default`: ダンジョンへの入場。
- `GET /api/fields/{userId}` (SSE): フィールドのリアルタイム更新。
  - ストリーム要素: `DisplayData`

## 3. データモデル

### 3.1 Player
```typescript
{
  id: string;        // ユーザーID
  name: string;      // ユーザー名
  gold: number;      // 所持ゴールド
  actionTime: number; // 最終行動時刻のタイムスタンプ
}
```

### 3.2 DisplayData
```typescript
{
  position: {
    x: number;
    y: number;
  };
  data: string[];    // 描画データの配列
}
```

### 3.3 DungeonInfo (mapSet)
```typescript
{
  name: string;      // ダンジョン名
  level: number;     // 現在の階層
}
```

### 3.4 PickUpResult (resultSet)
- `result`: boolean (取得成否)
- `type`: number (アイテム種別: 1=ゴールド, 2=アイテム)
- `gold`: number (取得したゴールド量, type=1の場合)
- `itemName`: string (取得したアイテム名, type=2の場合)
- `message`: string (エラーメッセージ等, 例: 'NoObjectOnTheFloor')

## 4. 技術的詳細

### 4.1 主要サービス
- **FieldsAccessService**: 全てのHTTPリクエスト（REST API）を統括します。
- **SseFieldService**: `EventSource` を使用し、バックエンドからのフィールド更新イベントをリアルタイムに受信します。
- **IntervalService**: `rxjs` の `interval` をラップし、ゲーム内の定期的なイベント（スタミナ回復等）のトリガーを提供します。
- **StorageService**: ブラウザの `localStorage` へのアクセスをカプセル化し、プレイヤー情報の永続化等を行います。

### 4.2 リアルタイム更新 (SSE)
- `SseFieldService` を通じて `GET /api/fields/{userId}` から配信されるイベントを購読します。
- 他のプレイヤーの移動や環境の変化がリアルタイムに反映されます。

### 4.3 セッション管理
- `StorageService` を使用して、ブラウザの `localStorage` に `playerId` を保存します。

### 4.4 フロントエンドでの状態管理
- `PlayerDomain` クラスがプレイヤーの現在の状態（HP、スタミナ等）を管理しています。
- 内部的に `CurrentStatus` クラスを持ち、HP/スタミナの動的な変更を扱います。
- 現状、HPやスタミナの初期値や最大値は `PlayerDomain` 内にハードコードされています。
