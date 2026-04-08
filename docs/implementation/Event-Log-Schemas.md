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
  attackerId?: string;     // 攻撃者のID（モンスターID等）
  attackerType: 'monster' | 'trap' | 'environment' | 'pker'; // 死亡原因の種別
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

## 3. 相互参照
- [管理者データモデル](Admin-Data-Models.md)
- [管理者システム](../features/Admin-System.md)
