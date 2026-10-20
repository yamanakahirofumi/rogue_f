# Monster-Companion-System

## 1. 概要
モンスター同伴システム（Monster Companion System）は、探索者（プレイヤー）が拠点および倉庫に保管している所有モンスターを 1 体同行させ、ダンジョン探索を共に進めるための仕組みです。同伴モンスターはプレイヤーに追従し、野生モンスターへの自動攻撃、ヘイト（敵の標的）の引きつけ、スキルによる援護や回復を行い、ソロ探索の生存率向上とモンスター育成の楽しみを提供します。

## 2. 同伴モンスターの出撃と帰還メカニズム

### 2.1 出撃条件 (Deployment Rules)
- プレイヤーは拠点（ギルド/倉庫）またはダンジョン突入時に、倉庫内ストック（`StoredMonster`）から 1 体のモンスターを選択して同伴（出撃）させることができます。
- **制限事項**:
  - 同時に連れ出せる同伴モンスターは **1体のみ** です。
  - 出撃可能なモンスターのステータスは `status: 'idle'` の個体に限られます。ダンジョン配置中（`status: 'placed'`）や遠征中（`status: 'expedition'`）のモンスターは同伴できません。
  - 活力（`vigor`）が **0** のモンスターは出撃できません（最低 10 以上の活力が必要）。
  - 成長段階が「幼体（Larva）」の個体も出撃可能ですが、ステータスが 0.7 倍となりスキルを使用できないため制限を受けます。

### 2.2 帰還と解任 (Dismissal & Recall)
- プレイヤーは拠点滞在中、またはダンジョン内の安全地帯（階段マス・拠点帰還ポータル等）においていつでも同伴モンスターを解任（帰還）できます。
- 解任されたモンスターのステータスは `status: 'companion'` から `status: 'idle'` に戻り、経験値やレベル上昇を保持した状態で倉庫へ送られます。

## 3. AI 思考パターンと戦術切り替え (AI Tactics & Commands)

同伴モンスターはプレイヤーが指定した **4 種類の AI 戦術 (Tactics)** に従って自動行動します。プレイヤーは探索中、リアルタイムで戦術を切り替えることができます。

| 戦術名 | 識別子 (`tactic`) | 思考ロジックと挙動 |
| :--- | :--- | :--- |
| **積極攻撃** | `aggressive` | 視界内の最も近い敵モンスターに対し積極的に接近し、通常攻撃および特殊スキルをクールタイムごとに使用します。 |
| **防御優先** | `defensive` | プレイヤーの周囲 2 マス以内を維持し、プレイヤーをターゲットしている敵モンスターを優先して攻撃（ヘイト奪取）します。 |
| **サポート/回復** | `support` | プレイヤーや自身の HP が減少している場合、回復・バフ系スキルを優先使用します。攻撃は距離を保ちつつ遠距離または反撃のみ行います。 |
| **追従** | `follow` | 攻撃を行わずプレイヤーの直後を追従します。狭い通路での交戦回避や、強敵からの離脱時に使用します。 |

## 4. 活力・満腹度消費と給餌システム (Vigor & Feeding)

### 4.1 活力と満腹度の消費 (Vigor / Satiety Drain)
- 同伴モンスターはダンジョン内を行動中、**10 ティックごとに 1 ポイント** の活力（`vigor`）および満腹度（`satiety`）を消費します。
- **活力/満腹度低下ペナルティ**:
  - 活力/満腹度が 20% 以下: 攻撃力・防御力が 20% 低下。
  - 活力/満腹度が 0: 自然回復停止、全ステータス 50% 低下、および毎ターン最大 HP の 1% ダメージ（飢餓状態）。

### 4.2 給餌（エサやり）メカニズム (Feeding)
- プレイヤーはインベントリ内の食料・肉類・木の実系アイテムを同伴モンスターに「給餌（エサやり）」することができます。
- **回復効果**:
  - 食料アイテムの基本満腹度回復量と同等の満腹度および活力が回復します。
  - 肉系アイテム（`meat_small`, `meat_large` 等）を肉食系モンスターに与えた場合、回復量が **1.5 倍** にボーナス補正されます。
  - 同時に、最大 HP の 20% 〜 50% が回復します。

## 5. 倒倒・戦闘不能メカニズム (Downed & Withdrawal)

### 5.1 倒倒状態 (Downed State)
- 同伴モンスターの HP が 0 に達した場合、即座にロスト（完全消滅）せず、その場に「倒倒（`downed`）」状態で倒れ込みます。
- **倒倒時の制限**:
  - 行動不能（移動・攻撃・スキル不可）。
  - プレイヤーは倒倒した同伴モンスターの隣接マスで「蘇生」コマンド（または回復薬・蘇生薬の使用、回復の泉・祭壇の利用）を行うことで、HP を 30% 回復させて復帰させることができます。

### 5.2 自動撤退 (Withdrawal to Warehouse)
- 倒倒状態のまま **60 ティックが経過** するか、プレイヤーが同伴モンスターを蘇生させずに **階層移動（階段・ポータル）** を行った場合、同伴モンスターは自動的に緊急離脱し、拠点倉庫へ送られます。
- **撤退後の状態**:
  - 倉庫内の個体ステータスは `status: 'idle'`、`vigor: 0`、`hp: 1` となり、拠点での休息や回復アイテムの使用によって再出撃が可能となります。

## 6. REST API 仕様

### 6.1 同伴出撃 (Deploy Companion)
- **REST API エンドポイント**: `POST /api/player/{userId}/companion/deploy`
- **リクエスト**: `CompanionDeployRequest`
  ```json
  {
    "monsterId": "mon_12345",
    "initialTactic": "defensive"
  }
  ```
- **レスポンス**: `CompanionDeployResult`
  ```json
  {
    "success": true,
    "companion": {
      "monsterId": "mon_12345",
      "typeId": "wolf",
      "name": "ウルフ",
      "level": 8,
      "hp": 45,
      "maxHp": 45,
      "vigor": 100,
      "maxVigor": 100,
      "tactic": "defensive",
      "status": "active"
    },
    "message": "ウルフが同伴モンスターとして出撃しました。"
  }
  ```

### 6.2 同伴解任 (Dismiss Companion)
- **REST API エンドポイント**: `DELETE /api/player/{userId}/companion/dismiss`
- **レスポンス**: `CompanionDismissResult`
  ```json
  {
    "success": true,
    "returnedMonsterId": "mon_12345",
    "message": "同伴モンスターを解任し、倉庫へ帰還させました。"
  }
  ```

### 6.3 戦術変更 (Update Tactic)
- **REST API エンドポイント**: `PUT /api/player/{userId}/companion/tactic`
- **リクエスト**: `CompanionTacticUpdateRequest`
  ```json
  {
    "tactic": "aggressive"
  }
  ```
- **レスポンス**: `CompanionTacticUpdateResult`
  ```json
  {
    "success": true,
    "updatedTactic": "aggressive",
    "message": "同伴モンスターの戦術を『積極攻撃』に変更しました。"
  }
  ```

### 6.4 給餌 (Feed Companion)
- **REST API エンドポイント**: `POST /api/player/{userId}/companion/feed`
- **リクエスト**: `CompanionFeedRequest`
  ```json
  {
    "itemId": "item_meat_01"
  }
  ```
- **レスポンス**: `CompanionFeedResult`
  ```json
  {
    "success": true,
    "healedHp": 20,
    "recoveredVigor": 30,
    "recoveredSatiety": 30,
    "consumedItemId": "item_meat_01",
    "message": "同伴モンスターに肉を与え、HPと活力が回復しました。"
  }
  ```

## 7. データ構造とイベントログ仕様

### 7.1 TypeScript データモデル
`src/@types/player.d.ts` および `src/@types/admin.d.ts` に定義されるデータモデル構造です。

```typescript
interface CompanionState {
  monsterId: string;           // モンスター個体ID (倉庫内ID)
  typeId: string;              // モンスター種別ID
  name: string;                // モンスター表示名
  level: number;               // 現在のレベル
  hp: number;                  // 現在のHP
  maxHp: number;               // 最大HP
  stamina?: number;            // 現在のスタミナ
  maxStamina?: number;         // 最大スタミナ
  vigor: number;               // 現在の活力
  maxVigor: number;            // 最大活力
  satiety: number;             // 現在の満腹度
  maxSatiety: number;          // 最大満腹度
  tactic: 'aggressive' | 'defensive' | 'support' | 'follow'; // 現在のAI戦術
  status: 'active' | 'downed'; // 出撃中のステータス
  position?: { x: number; y: number }; // マップ上の現在座標
}
```

### 7.2 イベントログ構造 (`companion_event`)
同伴モンスターの出撃、戦術変更、給餌、倒倒、撤退時に記録されるイベントログ（`DungeonEvent`）です。

```typescript
interface CompanionEventDetails {
  action: 'deploy' | 'dismiss' | 'tactic_change' | 'feed' | 'downed' | 'revived' | 'withdrawn';
  monsterId: string;
  monsterTypeId: string;
  tactic?: 'aggressive' | 'defensive' | 'support' | 'follow';
  consumedItemId?: string;
  position?: { x: number; y: number };
}
```

## 8. UI/UX 設計統合
- **同伴者 HUD ウィジェット**: プレイヤー HUD の隣接位置に、同伴モンスターの HP バー、活力/満腹度ゲージ、現在レベル、アイコン、および現在戦術（`aggressive` 等）バッジを表示します。
- **戦術切り替えパレット**: 探索画面でショートカットキーまたはコマンドボタンから 4 種類の戦術を 1 タップで即座に切り替えられるUIパレットを提供します。

## 9. 相互参照
- [モンスターシステム](Monster-System.md)
- [活力システム](Vigor-System.md)
- [満腹度システム](Hunger-System.md)
- [拠点システム](Base-System.md)
- [倉庫システム](Warehouse-System.md)
- [UI・UX設計](UI-UX-Design.md)
- [アクションシステム](Action-System.md)
- [実装詳細](../implementation/Implementation-Details.md)
