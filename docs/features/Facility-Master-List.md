# Facility-Master-List

## 1. 概要
本ドキュメントでは、RogueF における全施設のマスターリストを定義します。各施設の設置コスト、容量消費、および効果を規定し、実装およびバランス調整の基準とします。

## 2. 施設詳細一覧

各施設の設置に必要なコスト、容量消費、および効果の一覧です。

| typeId | 名称 | 設置コスト (資材) | 設置コスト (ゴールド) | 容量消費 | 効果・備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `recovery_spring` | 回復の泉 | 魔力結晶 × 20 | 5,000 | 20 | HP/スタミナの継続回復。 |
| `teleport_gate` | 転送門 | 魔力結晶 × 15 | 3,000 | 15 | 指定座標へのワープ。 |
| `shop_counter` | ショップカウンター | 木材 × 10, 鉄材 × 2 | 2,000 | 10 | ショップ機能の有効化。 |
| `synthesis_workshop` | 合成工房 | 鉄材 × 10, 魔力結晶 × 5 | 5,000 | 20 | アイテム合成機能の有効化。 |
| `torch` | 松明 | 木材 × 2 | 150 | 1 | 周囲 3 マスを照らす。 |
| `statue` | 彫像 | 石材 × 10 | 800 | 5 | 特殊効果（畏怖、守護、癒やし、強欲、輝き）を設定・付与。詳細は [彫像システム](Statue-System.md) 参照。 |
| `altar` | 祭壇 | 魔力結晶 × 15, 石材 × 10 | 5,000 | 15 | 四大神を祀り、防衛モンスターへのバフ、神の祝福・神罰等の動的インタラクション。詳細は [祭壇システム](Altar-System.md) 参照。 |
| `fishing_point` | 釣り堀 | 木材 × 15, 石材 × 5 | 1,200 | 8 | 高レア釣獲率 1.5 倍の専用釣りポイント。設定可能利用料によりゴールド収益化。詳細は [釣りシステム](Fishing-System.md) 参照。 |

## 3. 施設の撤去・解体による資材・ゴールドの回収

管理者が配置済みの施設をダンジョン編集画面から撤去・解体した際、回収される資材およびゴールド（設置コストの 50%、端数切り捨て）の一覧です。

| typeId | 名称 | 回収される資材 | 回収されるゴールド |
| :--- | :--- | :--- | :--- |
| `recovery_spring` | 回復の泉 | 魔力結晶 × 10 | 2,500 |
| `teleport_gate` | 転送門 | 魔力結晶 × 7 | 1,500 |
| `shop_counter` | ショップカウンター | 木材 × 5, 鉄材 × 1 | 1,000 |
| `synthesis_workshop` | 合成工房 | 鉄材 × 5, 魔力結晶 × 2 | 2,500 |
| `torch` | 松明 | 木材 × 1 | 75 |
| `statue` | 彫像 | 石材 × 5 | 400 |
| `altar` | 祭壇 | 魔力結晶 × 7, 石材 × 5 | 2,500 |
| `fishing_point` | 釣り堀 | 木材 × 7, 石材 × 2 | 600 |

### 3.1 施設解体用 REST API エンドポイント
- **エンドポイント**: `DELETE /api/admin/dungeon/{dungeonId}/floor/{floorLevel}/facility/{facilityId}`
  - リクエスト型 (`FacilityDismantleRequest`):
    ```typescript
    interface FacilityDismantleRequest {
      floorLevel: number;
      facilityId?: string;
      position: { x: number; y: number };
    }
    ```
  - レスポンス型 (`FacilityDismantleResult`):
    ```typescript
    interface FacilityDismantleResult {
      success: boolean;
      recoveredGold: number;
      recoveredMaterials: { typeId: string; amount: number }[];
      message: string;
    }
    ```

## 4. 相互参照
- [釣りシステム (Fishing-System.md)](Fishing-System.md)
- [祭壇システム (Altar-System.md)](Altar-System.md)
- [彫像システム (Statue-System.md)](Statue-System.md)
- [建築システム](Construction-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [ショップシステム](Shop-System.md)
- [自然回復システム](Natural-Recovery-System.md)
