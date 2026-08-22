# リプレイ・観戦システム (Replay & Spectator System)

## 1. 概要と目的
本ドキュメントでは、RogueF における**「リアルタイム観戦」**および**「リプレイ録画・再生」**機能の仕様を定義します。

RogueF は、探索者（Explorer）、ダンジョン管理者（Administrator）、および乱入者（PKer）がリアルタイムに攻防を繰り広げる非対称マルチプレイヤー・ローグライクです。本システムは以下の目的で導入されます。

- **コミュニティ・観戦体験の向上**: 拠点やWeb画面から他プレイヤーの命がけのダンジョン攻略や白熱したPK戦をリアルタイムで観戦・応援可能にします。
- **振り返り・攻略学習**: プレイヤー自身が死亡原因やクリア時の立ち回りを振り返ったり、他プレイヤーのハイスコア動画を再生して学習できるようにします。
- **管理者のダンジョン調整**: ダンジョン管理者が自身のマイ・ダンジョンにおけるプレイヤーの行動傾向（死亡地点、トラップ回避率等）を正確に分析し、仕掛けの再配置や難易度調整に活用できるようにします。
- **セキュリティ・不正検証**: ハイスコア達成時やランキング上位者のプレイを自動記録・公開することで、チートやデータ改ざんに対する透明性を確保します。

---

## 2. リアルタイム観戦メカニズム (Live Spectate)

### 2.1 観戦セッションの確立
- **接続エンドポイント**: `GET /api/spectate/dungeon/{dungeonId}` (Server-Sent Events: SSE)
- **参加条件**:
  - **拠点の観戦モニター / 掲示板**: 拠点（Base）内に設置された「観戦板」インタラクト、またはUIメニューから現在攻略中のダンジョン一覧を選択して観戦セッションを開始します。
  - **権限別視界制限**:
    - **管理者 (Admin)**: 自身の所有ダンジョン、または公開権限のあるダンジョンにおいて、マップ全体および全エンティティ（プレイヤー、モンスター、トラップ、未発見宝箱）を可視化する「全開視界 (Full View)」を利用可能。
    - **一般観戦者 (Explorer / Visitor)**: 選択した探索者（被観戦者）の視界半径に準拠した「視線限定視界 (Player Line-of-Sight)」が適用され、フォグ・オブ・ウォーが反映されます。

### 2.2 観戦者用インタラクション（声援・リアクション）
- 観戦者は被観戦者のゲームプレイを邪魔することなく、肯定的な演出フィードバックを送ることができます。
- **声援スタンプ (Cheer Stamp)**:
  - 観戦画面のスタンプパレットから、「ナイス！」「あぶない！」「ファイト！」などの声援スタンプやエモートを送信できます (`PUT /api/spectate/dungeon/{dungeonId}/cheer`)。
  - 送信されたスタンプは、対象プレイヤーの頭上に 2 秒間小さなエフェクトとして表示されます。
  - 乱用防止のため、観戦者ごとに 3 秒間のクールダウンが適用されます。

---

## 3. リプレイ録画・生成ロジック (Replay Recording)

### 3.1 イベント・ティック差分記録方式
リプレイは、動画ファイル（MP4等）ではなく、ゲーム内の時間単位（ティック）ごとに発生した状態変化およびキーコマンド・イベントログ (`DungeonEvent`) を記録する**軽量ベクトル/ログ形式**でシリアライズされます。

- **記録開始トリガー**:
  - 探索者がダンジョンに入場した時点 (`player_entry`)。
- **記録終了トリガー**:
  - 脱出 (`player_exit`)、クリア、死亡 (`player_death`)、または接続切断時。
- **記録要素**:
  - **ReplayHeader**: プレイヤー情報、ダンジョン構成ID、生成シード値、開始日時、クライアントバージョン。
  - **ReplayFrame**: 各ティックにおけるコマンド操作、エンティティ移動、戦闘ダメージ、アイテム消費、天候変化等の差分データ。

### 3.2 データ軽量化と圧縮
- マップ全体の静的データは `DungeonConfig` および `FloorConfig` の初期データとして 1 回のみヘッダーに格納されます。
- 毎ティックのフレームデータは、変化があったエンティティの座標とステータス変化のみを差分記録 (`delta encoding`) し、JSON/Protocol Buffer 圧縮を行って保存容量を最小限（1ランあたり数十KB〜数MB程度）に抑えます。

---

## 4. リプレイ再生・操作仕様 (Replay Playback)

### 4.1 再生コントローラー UI
リプレイ再生時には、画面下部に専用の再生コントローラーが表示されます。

- **タイムラインバー**: セッション開始から終了までの進行状況を示すプログレスバー。重要イベント（ボス遭遇、PK乱入、死亡/クリア）の位置にマーカーが付与されます。
- **再生制御ボタン**:
  - **再生 / 一時停止 (Play / Pause)**
  - **コマ送り / コマ戻し (Step Forward / Backward)**: 1 ティックごとのステップ実行。
  - **再生速度倍率 (Speed Multiplier)**: `0.5x`, `1.0x` (等倍), `2.0x`, `4.0x`, `8.0x` (高速送出し)。
- **カメラフォーカス切り替え (Camera Focus)**:
  - **追跡対象選択**: 探索者、乱入PKer、ボスモンスターにカメラフォーカスをワンクリックで切り替え可能。
  - **フリーカメラ (Free Camera)**: 矢印キーでマップ内を自由にスクロール閲覧（全開視界モード時のみ）。

---

## 5. 殿堂入り・ランキングおよびサーバー間共有

### 5.1 殿堂入りリプレイ (Hall of Fame)
- ランキング上位のクリアレコード（[ランキングシステム](Ranking-System.md) 参照）および「高難易度ダンジョン初クリア」「PK連勝撃退」などの快挙達成セッションは、自動的に「殿堂入りリプレイ」として永続化されます。

### 5.2 トラストネットワーク経由の共有
- サーバー間連携（[機能仕様書](Functional-Specification.md) 参照）に基づき、信頼関係を結んだ他サーバーからでも公開リプレイのIDを取得・再生可能です。
- エンドポイント: `GET /api/replays/{replayId}`

---

## 6. データ構造と API 仕様

### 6.1 リプレイデータモデル

```typescript
// リプレイヘッダー情報
interface ReplayHeader {
  replayId: string;           // リプレイ固有ID
  dungeonId: string;          // 対象ダンジョンID
  dungeonName: string;        // ダンジョン名
  floorCount: number;         // 記録対象の総階層数
  userId: string;             // プレイヤーユーザーID
  username: string;           // プレイヤー名
  role: 'explorer' | 'pker';  // メインプレイヤーのロール
  seed: number;               // マップ生成シード値
  startTime: number;          // 開始日時 (UNIXタイムスタンプ)
  durationTicks: number;      // 総経過ティック数
  result: 'cleared' | 'escaped' | 'died'; // 攻略結果
  clearTimeSeconds: number;   // 実経過時間（秒）
  clientVersion: string;      // 記録時のクライアント/ゲームバージョン
}

// ティックごとのフレーム差分データ
interface ReplayFrame {
  tick: number;               // 経過ティック数
  timestamp: number;          // 発生タイムスタンプ
  commands?: {                // 該当ティックで実行された操作コマンド
    userId: string;
    command: string;
    args?: any;
  }[];
  events?: DungeonEvent[];     // 該当ティックで発生したイベントログ
  entityUpdates?: {           // 位置やステータスに更新があったエンティティ
    entityId: string;
    position?: { x: number; y: number };
    hp?: number;
    stamina?: number;
    statusEffects?: string[];
  }[];
}

// リプレイ完全データ
interface ReplayData {
  header: ReplayHeader;
  frames: ReplayFrame[];
}

// 観戦セッション状態
interface SpectatorSession {
  dungeonId: string;
  activeExplorers: { userId: string; username: string; currentFloor: number }[];
  spectatorCount: number;
  viewMode: 'full_view' | 'player_los';
}
```

### 6.2 API エンドポイント

- **リアルタイム観戦**
  - `GET /api/spectate/dungeons`: 現在観戦可能なアクティブダンジョン一覧の取得。
    - レスポンス: `SpectatorSession[]`
  - `GET /api/spectate/dungeon/{dungeonId}` (SSE): 指定ダンジョンのリアルタイム観戦ストリーム。
    - ストリーム要素: `DisplayData` および リアルタイム `DungeonEvent`
  - `PUT /api/spectate/dungeon/{dungeonId}/cheer`: 観戦声援・リアクションスタンプの送信。
    - リクエスト: `{ stampId: string; targetUserId?: string }`
    - レスポンス: `boolean`

- **リプレイ管理・再生**
  - `GET /api/replays`: リプレイ一覧の検索・取得（クエリ: `userId`, `dungeonId`, `result`, `limit`, `offset`）。
    - レスポンス: `ReplayHeader[]`
  - `GET /api/replays/{replayId}`: 指定リプレイの完全データ取得。
    - レスポンス: `ReplayData`
  - `POST /api/replays/{replayId}/bookmark`: ブックマーク/お気に入り登録。
    - レスポンス: `boolean`

---

## 7. UI/UX 設計方針

### 7.1 観戦者用 HUD オーバーレイ
- プレイ画面の周囲に暗い枠線を配置し、「観戦中 (SPECTATING)」のインジケーターと現在選択されている視界モード（全開視界 / 探索者視界）を表示。
- 画面右側に「観戦者リスト」および「リアルタイム声援パレット」を格納可能な折りたたみ可能サイドパネルを配置。

### 7.2 リプレイプレイヤー モーダル
- ローグライクらしいレトロなレコーダー風デザイン（再生/停止ボタン、1x/2x/4x表示、タイムラインバー）。
- 死亡理由（例: 「3F 溶岩トラップにより死亡」）や特定イベント発生時にタイムラインバー上に視覚的なアイコンマーカーを表示し、ワンクリックでそのイベントの 5 ティック前までジャンプ（シーク）可能。
