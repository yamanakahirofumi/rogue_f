# Event-Log-Schemas

## 1. 概要
本ドキュメントでは、[管理者データモデル](Admin-Data-Models.md) で定義されている `DungeonEvent` インターフェースの `details` フィールドにおける、各種イベントタイプごとの具体的なデータ構造を定義します。

## 2. 各イベントのデータ構造

### 2.1 player_entry (プレイヤー入場)
プレイヤーがダンジョンに入場した際に記録されます。

```typescript
{
  entranceId: string;      // 入口のID
  position: { x: number, y: number }; // 出現座標
}
```

### 2.2 player_exit (プレイヤー脱出)
プレイヤーがダンジョンから脱出した際に記録されます（死亡時を除く）。

```typescript
{
  exitId: string;          // 出口（階段など）のID
  reason: 'escaped' | 'cleared'; // 脱出の理由
  position: { x: number, y: number }; // 脱出時の座標
}
```

### 2.3 player_death (プレイヤー死亡)
プレイヤーがダンジョン内で死亡した際に記録されます。

```typescript
{
  attackerId?: string;     // 攻撃者の個体ID（モンスターID等）
  attackerTypeId?: string; // 攻撃者の種別ID（'slime', 'spikes', 'lava' 等）
  attackerType: 'monster' | 'trap' | 'environment' | 'pker'; // 死亡原因のカテゴリ
  position: { x: number, y: number }; // 死亡座標
  lostGold: number;        // 没収されたゴールド量
  lostItems: string[];     // 没収されたアイテムのIDリスト
}
```

### 2.4 item_pickup (重要アイテム取得)
プレイヤーがアイテムを拾った際に記録されます。

```typescript
{
  itemId: string;          // アイテム個体ID
  itemTypeId: string;      // アイテム種別ID
  itemName: string;        // アイテム名
  position: { x: number, y: number }; // 取得座標
  isGold: boolean;         // ゴールドかどうか
  amount?: number;         // ゴールドの場合の金額
}
```

### 2.5 monster_slain (モンスター撃破)
モンスターがプレイヤー（または他の要因）によって撃破された際に記録されます。

```typescript
{
  monsterId: string;       // モンスター個体ID
  monsterTypeId: string;   // モンスター種別ID
  killerId: string;        // 撃破者のID（プレイヤーID等）
  position: { x: number, y: number }; // 撃破座標
  gainedExp: number;       // プレイヤーが獲得した経験値
}
```

### 2.6 trap_triggered (トラップ発動)
トラップがプレイヤー（またはモンスター）によって発動された際に記録されます。

```typescript
{
  trapTypeId: string;      // トラップ種別ID
  position: { x: number, y: number }; // トラップの座標
  triggeredBy: string;     // 発動させたエンティティのID
  isFound: boolean;        // 発動前に発見されていたか
  damageDealt?: number;    // 与えたダメージ
  statusEffect?: string;   // 付与された状態異常
}
```

### 2.7 admin_intervention (管理者介入)
管理者がリアルタイムでプレイヤーに干渉した際に記録されます。

```typescript
{
  actionType: 'summon' | 'trigger'; // 介入種別
  targetUserId: string;    // 対象プレイヤーID
  position: { x: number, y: number }; // 介入地点の座標
  monsterId?: string;      // 召喚したモンスターのID（summonの場合）
  effectId?: string;       // 発生させた効果のID（triggerの場合）
}
```

### 2.8 chest_opened (宝箱開封・破壊)
プレイヤーが宝箱を発見し、開錠試行、鍵の使用、破壊、または調査を行った際に記録されます。

```typescript
{
  chestType: 'wooden' | 'iron' | 'magic' | 'mimic';           // 宝箱の種類
  action: 'unlock_hand' | 'unlock_key' | 'smash' | 'inspect';  // 実行したアクション
  result: 'success' | 'failed_locked' | 'failed_jammed' | 'trap_triggered' | 'mimic_awakened' | 'broken'; // 開封結果
  itemId?: string;                                            // 獲得したアイテム種別ID (成功時)
  itemName?: string;                                          // 獲得したアイテム名 (成功時)
  damageDealt?: number;                                       // 罠やミミック、または破壊時の破片で受けたダメージ
  position: { x: number, y: number };                         // 宝箱の座標
}
```

### 2.9 fishing_attempt (釣り実行)
プレイヤーがダンジョン内の水辺や溶岩、または釣り堀にて釣り竿とエサを用いて釣りを試みた際に記録されます。

```typescript
{
  rodTypeId: string;                                          // 使用した釣り竿のID (例: 'rod_wood')
  baitTypeId?: string;                                        // 使用したエサのID (例: 'bait_worm')
  result: 'success' | 'missed' | 'monster_ambush' | 'no_bait'; // 釣りの結果
  catchItemTypeId?: string;                                   // 釣り上げたアイテム/魚の種別ID (成功時)
  fishingLevel: number;                                       // 実行時のプレイヤー釣りレベル
  position: { x: number, y: number };                         // 釣りポイントの座標
}
```

### 2.10 altar_interaction (祭壇との相互作用)
探索者が祭壇にて祈りを捧げたり、ゴールドやアイテムを供物として捧げた際、またはPKerが祭壇を冒涜したり略奪を試みて神罰や祝福が発生した際に記録されます。

```typescript
{
  deityId: 'ares' | 'athena' | 'demeter' | 'fortuna';          // 祀られている神のID
  action: 'pray' | 'offer_gold' | 'offer_item' | 'desecrate' | 'loot'; // 実行したアクション
  offerDetails?: {                                            // 捧げ物の詳細
    itemId?: string;                                          // 捧げたアイテムID
    goldAmount?: number;                                      // 捧げたゴールド
  };
  result: 'divine_blessing' | 'divine_punishment' | 'favor_increased' | 'favor_decreased' | 'loot_success' | 'loot_failed_punished'; // 結果
  position: { x: number, y: number };                         // 祭壇の座標
}
```

### 2.11 statue_placed (彫像設置・撤去)
ダンジョン管理者がマイ・ダンジョン内のフロアに彫像を配置、または撤去した際に記録されます。

```typescript
{
  action: 'place' | 'remove';                                 // 設置または撤去
  effectType: 'dread' | 'guardian' | 'healing' | 'greed' | 'glow'; // 彫像の効果種類
  position: { x: number, y: number };                         // 設置座標
}
```

### 2.12 quest_progress (クエスト進行・達成・報酬受取)
プレイヤー（探索者、管理者、PKer）がクエストを受注、進行目標をカウント、達成、または報酬をクレーム（受取）した際に記録されます。

```typescript
{
  questId: string;                                            // 対象クエストのID
  action: 'accept' | 'advance' | 'complete' | 'claim_rewards'; // クエストのアクション
  progressCount?: number;                                     // 進捗状況 ('advance' 時)
  rewardsClaimed?: {                                          // 獲得した報酬 ('claim_rewards' 時)
    gold?: number;
    exp?: number;
    materials?: { typeId: string; amount: number }[];
    items?: string[];
  };
}
```

### 2.13 title_changed (称号解放・装備変更)
プレイヤーが新しい称号（実績）をアンロック、またはプロフィールに表示・バフを得るために称号を装備/装備解除した際に記録されます。

```typescript
{
  titleId: string;                                            // 対象の称号ID
  action: 'unlock' | 'equip' | 'unequip';                     // 称号のアクション
}
```

### 2.14 weather_changed (天候変化)
フロアの天候が時間の経過、バイオーム効果、または管理者の介入によって遷移した際に記録されます。

```typescript
{
  previousWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave'; // 変更前の天候
  newWeather: 'clear' | 'rain' | 'fog' | 'blizzard' | 'heatwave';      // 変更後の天候
}
```

### 2.15 emote_stamp_used (エモート・スタンプ使用)
プレイヤーやPKerが非対称マルチプレイヤー環境でのコミュニケーションとしてエモート（文字列メッセージ）またはスタンプ（ビジュアルアイコン）を使用した際に記録されます。

```typescript
{
  targetType: 'emote' | 'stamp';                              // エモートまたはスタンプ
  targetId: string;                                           // エモートIDまたはスタンプID
  speakerRole: 'explorer' | 'admin' | 'pker';                  // 使用者の役割
  position: { x: number, y: number };                         // 使用された座標
}
```

### 2.16 balance_telemetry (ゲームバランス調整用テレメトリ記録)
ゲームバランスを最適に自動チューニングまたは開発・管理者用分析を行うための、各種動的イベント（プレイヤー死亡ヒートマップ、特定アイテム使用・売却、PK勝率変動など）の情報を記録します。

```typescript
{
  metricType: 'death' | 'item_usage' | 'pk_win_ratio' | 'matchmaking_failure'; // テレメトリの指標種別
  details: any;                                               // 指標の詳細データ
}
```

## 3. 相互参照
- [管理者データモデル](Admin-Data-Models.md)
- [管理者システム](../features/Admin-System.md)
- [宝箱・鍵システム](../features/Chest-Key-System.md)
- [釣りシステム](../features/Fishing-System.md)
- [祭壇システム](../features/Altar-System.md)
- [彫像システム](../features/Statue-System.md)
- [クエストシステム](../features/Quest-System.md)
- [称号・実績システム](../features/Title-System.md)
- [昼夜・天候システム](../features/Time-Weather-System.md)
- [エモート・スタンプマスターリスト](../features/Emote-Stamp-Master-List.md)
- [ゲームバランス調整システム](../features/Game-Balance-System.md)
