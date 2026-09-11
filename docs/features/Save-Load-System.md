# Save-Load-System

## 1. 概要
セーブ・ロードシステムは、プレイヤーの冒険の進行状況を保存し、中断した箇所から再開できるようにするための仕組みです。本作では、ローグライク特有の「緊張感」を維持しつつ、利便性を考慮した保存メカニズムを採用します。

## 2. 保存のタイミングと種類

冒険の状況に応じて、以下の 3 種類の保存方法を規定します。

### 2.1 オートセーブ (Auto-save)
- **トリガー**: ダンジョン内での「階層移動（階段の利用）」が完了した直後に自動的に実行されます。
- **目的**: 万が一の通信切断やアプリの異常終了時に、直前の階層開始時点の状態を復元できるようにします。
- **保存内容**: 現在の階層レベル、プレイヤーのステータス、インベントリの内容、およびその階層の生成シード値（または生成済みマップデータ）。

### 2.2 拠点セーブ (Base Save)
- **トリガー**: 拠点（町）において、特定の操作（メニューからのセーブ、または施設利用時）を行った際に実行されます。
- **目的**: 拠点での準備状況（倉庫、繁殖、合成の結果）を永続化します。
- **保存内容**: [SaveData](../implementation/Implementation-Details.md#3-12-savedata) に含まれる全データ（プレイヤー、ダンジョン設定、倉庫状態）。

### 2.3 中断セーブ (Suspend Save)
- **トリガー**: ダンジョン探索中にメニューから「中断してタイトルへ」を選択した際に実行されます。
- **目的**: 探索の途中で安全にゲームを終了し、後でその地点から再開できるようにします。
- **制限**:
    - **一度きりの再開**: 中断セーブデータは、一度ロード（再開）されると自動的に**削除（または無効化）**されます。これにより、同じ場面を何度もやり直す（リセットマラソン）を防止します。
    - **戦闘中の制限**: モンスターが隣接している、または戦闘状態にある場合は中断セーブを行えない場合があります。

## 3. パーマデス (Permadeath) との兼ね合い
ローグライクとしての性質上、プレイヤーが死亡した際のセーブデータの扱いは厳格に行われます。

- **データ削除**: プレイヤーがダンジョン内で死亡（HP が 0 に到達）し、リザルト画面が表示された時点で、該当するダンジョン探索中のセーブデータ（オートセーブおよび中断セーブ）は**即座に破棄**されます。
- **永続的なペナルティの適用**: [機能仕様書](Functional-Specification.md#4-デスペナルティの設定) に基づき、没収されたアイテムや減少したレベルが反映された「拠点状態」のみが保存されます。

## 4. 保存先とデータ構造
データはサーバー側のデータベースに保存されることを基本としますが、オフライン対応や通信量削減のため、クライアント側の `localStorage` も補助的に活用します。

### 4.1 データ構造 (SaveData, SuspendSaveState, SaveLoadResult)
保存されるデータの構造は、[実装詳細](../implementation/Implementation-Details.md) に規定されている `SaveData`、`SuspendSaveState`、および `SaveLoadResult` インターフェースに準じます。

```typescript
interface SaveData {
  userId: string;                 // ユーザーID
  player: Player;                 // プレイヤーの動的ステータス
  dungeonConfig: DungeonConfig;   // 管理しているダンジョンの設定
  warehouseState: WarehouseState; // 倉庫（ストック）の状態
  suspendState?: SuspendSaveState;// 存在する場合、ダンジョン探索中の中断セーブ状態
}

interface SuspendSaveState {
  dungeonId: string;              // 探索中ダンジョンのID
  dungeonName: string;            // ダンジョン名
  floorLevel: number;             // 中断時点の階層レベル
  seed: number;                   // マップ生成シード値
  savedAt: number;                // 中断日時のタイムスタンプ (UNIX ms)
  playerState: Player;            // 中断時点のプレイヤー完全ステータス
  mapStateSnapshot?: any;         // マップ内のアイテム・敵・配置物のスナップショット
}

interface SaveLoadResult {
  success: boolean;               // セーブ・ロード処理の成否
  saveData?: SaveData;            // 取得されたセーブデータ
  suspendState?: SuspendSaveState;// 復元された中断セーブデータ
  message: string;                // 処理結果メッセージ
}
```

## 5. REST API エンドポイント仕様

セーブ・ロード処理を制御・連携するための REST API を以下のように定義します。

### 5.1 最新セーブデータの取得
- **エンドポイント**: `GET /api/player/{userId}/save`
- **目的**: ログイン時またはタイトル画面表示時に、該当ユーザーの最新セーブデータ（拠点の永続データおよび未完了の中断セーブ状態の有無）を取得します。
- **レスポンス**: `SaveLoadResult`

### 5.2 拠点・手動セーブの実行
- **エンドポイント**: `POST /api/player/{userId}/save`
- **目的**: 拠点（町）での施設利用後やセーブコマンド実行時に、最新の `SaveData` を永続化保存します。
- **リクエスト**: `Partial<SaveData>`
- **レスポンス**: `SaveLoadResult`

### 5.3 ダンジョン中断セーブの作成
- **エンドポイント**: `POST /api/player/{userId}/save/suspend`
- **目的**: ダンジョン探索中に「中断してタイトルへ」を選択した際、現在フロアの完全な状態（`SuspendSaveState`）を一時保存します。
- **リクエスト**: `{ dungeonId: string; floorLevel: number; seed: number; mapStateSnapshot?: any }`
- **レスポンス**: `SaveLoadResult`

### 5.4 ダンジョン中断セーブの消去
- **エンドポイント**: `DELETE /api/player/{userId}/save/suspend`
- **目的**: 中断データからの再開完了時、またはダンジョン内で死亡（パーマデス発生）した際に、該当ユーザーの中断セーブデータを削除・無効化します。
- **レスポンス**: `SaveLoadResult`

## 6. ロードのプロセス
- ログイン時、サーバーから最新の `SaveData` を取得します。
- 未完了の「中断セーブ (`suspendState`)」が存在する場合は、タイトル画面に「続きから（探索再開）」の選択肢が表示されます。
- 中断セーブから再開した場合、即座に `DELETE /api/player/{userId}/save/suspend` が呼び出され、ワンタイムでの再開を保証します。
- それ以外の場合は、拠点からスタートします。

## 7. 相互参照
- [機能仕様書](Functional-Specification.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [拠点システム](Base-System.md)
