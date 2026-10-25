# Monster-Companion-System

## 1. 概要
お供モンスターシステム（Monster Companion System）は、プレイヤー（探索者）が拠点ギルドまたは倉庫に保管している所持モンスター 1 体を選択し、パートナー（お供）としてダンジョン探索に同行させる新機能提案仕様です。

探索者はソロでの探索に加えて、お供モンスターの前衛タンク、後衛火力、回復・バフ支援、あるいはアイテム探索などのAI行動を組み合わせることで、高難易度階層やモンスターハウスへの対応力を飛躍的に向上させることができます。

## 2. 出撃・送還メカニズム

### 2.1 出撃登録 (Deploy Companion)
- **同行可能数**: プレイヤー 1 人につき、同時に同行できるお供モンスターは **最大 1 体** です。
- **出撃可能場所**: 拠点の「ギルド・クエスト掲示板」または「倉庫」画面から編成が可能です。ダンジョン内部での新規編成・途中呼び出しはできません。
- **必要条件**:
  - 対象モンスターが倉庫ストック（`StoredMonster`）に存在し、ステータスが `'idle'`（待機中）であること。
  - 対象モンスターの活力（`vigor`）が **10 以上** 残存していること。
  - 対象モンスターの成長段階が「成体 (Adult)」（Level 5 以上）であること（※幼体は能力制限のため同行不可）。

### 2.2 送還・同行解除 (Dismiss Companion)
- 拠点での滞在中、いつでもお供モンスターを離脱（送還）させて倉庫へ戻すことができます。
- ダンジョン探索をクリア・脱出・死亡により終了した場合、お供モンスターは自動的に拠点倉庫へ帰還します。

## 3. AI作戦（Tactic）と行動パターン

お供モンスターはプレイヤーの周囲 1〜3 マス内で自動的に自律行動します。プレイヤーは行動コマンドおよび専用HUDウィジェットから、リアルタイムに **AI作戦（Tactic）** を変更可能です。

| AI作戦名 | ID | 行動パターンと優先ターゲット | 特徴・用途 |
| :--- | :--- | :--- | :--- |
| **攻勢 (Aggressive)** | `aggressive` | 視界内の敵モンスターへ最優先で接近・攻撃。 | 部屋のクリア速度向上・前衛火力。 |
| **守勢 (Defensive)** | `defensive` | プレイヤーの隣接 1 マスを維持し、プレイヤーまたは自身を攻撃した敵を反撃。 | 後衛プレイヤーの護衛・タンク役。 |
| **支援 (Support)** | `support` | 自身の所持スキル（回復・バフ・デバフ）の発動を最優先。スキル使用不能時はプレイヤーの背後へ退避。 | 回復・サポート役。 |
| **追従 (Follow)** | `follow` | 攻撃行動を行わず、プレイヤーの直後を追従して移動を最優先。 | 不要な戦闘の回避・迅速な階段目指し。 |

### 3.1 AI作戦のリアルタイム変更
- アクションコマンド `PUT /api/player/{userId}/companion/tactic` を介して即座に変更が可能です（待機時間・スタミナ消費なし）。

## 4. リソース管理（活力・満腹度・エサやり）

### 4.1 活力 (Vigor) と満腹度 (Satiety) の消費
- **時間経過消費**: ダンジョン内で **20 ティック経過するごとに、お供モンスターの満腹度が 1 減少** します。
- **活力の自動消費**: お供モンスターが戦闘行動（物理攻撃・スキル実行）を行うごとに、活力（`vigor`）が 1〜2 消費されます。
- **空腹・飢餓ペナルティ**:
  - 満腹度が 0（飢餓状態）になると、10 ティックごとに最大HPの 5% のダメージを受けます。
  - 活力が 0 になると、攻撃力・防御力が **50% 低下** し、スキル使用が不能になります。

### 4.2 エサやりメカニズム (Feeding Companion)
- **実行方法**: インベントリ内の食料アイテム（肉、パン、魚、野菜等）または特定の回復アイテムを選択し、お供モンスターへ「与える（エサやり）」アクションを行います。
- **REST API**: `POST /api/player/{userId}/companion/feed`
  - リクエストデータ構造: `CompanionFeedRequest` (`itemId: string`)
  - レスポンスデータ構造: `CompanionFeedResult`
- **回復効果**:
  - 食料アイテムの栄養価に応じて、お供モンスターの満腹度および活力が回復します。
  - 例: 「巨大な肉」: 満腹度 +100、活力 +30。

## 5. ダウン状態 (Downed State) と救護・死亡メカニズム

### 5.1 ダウン状態への移行
- ダンジョン内でお供モンスターの HP が 0 になると、直ちに「ダウン状態（Downed State）」に移行します。
- ダウン状態のお供モンスターは、その場に倒れ込み行動不能となりますが、**即座にはロスト・死亡しません**。

### 5.2 救護・復活
- プレイヤーはダウン状態のパートナーに隣接し、「気付け薬」の使用または救護アクション（5 ティック待機）を行うことで、HP 30% の状態で現場復活させることができます。

### 5.3 ダンジョン離脱時の処理
- パートナーがダウン状態のままプレイヤーが階段移動または脱出を行った場合、パートナーは回収されて倉庫へ送還されます。
- **ペナルティ**: 帰還したパートナーの活力は **0** となり、24時間（または休息アイテム使用まで）「衰弱状態（過労）」が付与されます（※通常モードでは個体消滅・永続死亡はありません）。

## 6. REST API 仕様

### 6.1 お供モンスター出撃 (`POST /api/player/{userId}/companion/deploy`)
- **リクエスト**: `CompanionDeployRequest` (`monsterId: string`, `initialTactic?: 'aggressive' | 'defensive' | 'support' | 'follow'`)
- **レスポンス**: `CompanionDeployResult` (`success: boolean`, `companionState?: CompanionState`, `message: string`)

### 6.2 お供モンスター送還 (`DELETE /api/player/{userId}/companion/dismiss`)
- **レスポンス**: `CompanionDismissResult` (`success: boolean`, `message: string`)

### 6.3 作戦変更 (`PUT /api/player/{userId}/companion/tactic`)
- **リクエスト**: `CompanionTacticUpdateRequest` (`tactic: 'aggressive' | 'defensive' | 'support' | 'follow'`)
- **レスポンス**: `CompanionTacticUpdateResult` (`success: boolean`, `updatedTactic: string`, `message: string`)

### 6.4 エサやり (`POST /api/player/{userId}/companion/feed`)
- **リクエスト**: `CompanionFeedRequest` (`itemId: string`)
- **レスポンス**: `CompanionFeedResult` (`success: boolean`, `recoveredSatiety: number`, `recoveredVigor: number`, `message: string`)

## 7. データモデル定義

```typescript
export interface CompanionState {
  monsterId: string;               // 倉庫内のモンスター個体ID
  monsterTypeId: string;           // モンスター種別ID (例: 'slime', 'fire_dragon')
  name: string;                    // モンスター個体名/種族名
  level: number;                   // 現在のレベル
  hp: number;                      // 現在のHP
  maxHp: number;                   // 最大HP
  satiety: number;                 // 現在の満腹度 (0〜100)
  maxSatiety: number;              // 最大満腹度
  vigor: number;                   // 現在の活力 (0〜100)
  tactic: 'aggressive' | 'defensive' | 'support' | 'follow'; // 現在のAI作戦
  isDowned: boolean;               // ダウン状態フラグ
  position: { x: number; y: number }; // マップ上の現在座標
}

export interface CompanionDeployRequest {
  monsterId: string;
  initialTactic?: 'aggressive' | 'defensive' | 'support' | 'follow';
}

export interface CompanionDeployResult {
  success: boolean;
  companionState?: CompanionState;
  message: string;
}

export interface CompanionDismissResult {
  success: boolean;
  message: string;
}

export interface CompanionTacticUpdateRequest {
  tactic: 'aggressive' | 'defensive' | 'support' | 'follow';
}

export interface CompanionTacticUpdateResult {
  success: boolean;
  updatedTactic: 'aggressive' | 'defensive' | 'support' | 'follow';
  message: string;
}

export interface CompanionFeedRequest {
  itemId: string;
}

export interface CompanionFeedResult {
  success: boolean;
  recoveredSatiety: number;
  recoveredVigor: number;
  message: string;
}
```

## 8. 相互参照
- [モンスターシステム](Monster-System.md)
- [アクションシステム](Action-System.md)
- [UI・UX設計](UI-UX-Design.md)
- [実装詳細](../implementation/Implementation-Details.md)
