# Synthesis-System

## 1. 概要
合成システムは、探索や解体で入手した資材を組み合わせて、新たなアイテムや上位の資材を作成するための仕組みです。管理者は自身の拠点（Admin Area）において、所持しているリソースを消費して戦略的に必要なアイテムを生成できます。

## 2. 合成のプロセス

### 2.1 施設の利用
- 合成は、拠点エリアに設置された「合成工房（Synthesis Workshop）」で行います。
- 合成には、材料となる資材と一定のゴールドが必要です。

### 2.2 材料の消費
- 合成を開始した時点で、必要材料（資材・ゴールド）が**管理者の倉庫（ストック）および所持金から即座に消費**されます。
- 合成の結果（成功・失敗）に関わらず、消費された材料は戻りません（失敗時のゴールド一部返金を除く）。

### 2.3 成功率と失敗のリスク
- 合成の成功率はアイテムごとに異なります。
- **基本成功率**:
    - 基本資材・装飾品 (`torch`, `statue` 等): **100%**
    - 中位資材・特殊アイテム (`magic_crystal`, `capture_ball`, `orb_intrusion`): **90%**
    - 装備品 (`composite_bow`, `armor_magic`, `sword_magic` 等): **70%**
- **運 (Luck) によるボーナス**:
    - プレイヤーの「運」ステータスに応じて、基本成功率にボーナスが付与されます。
    - `最終成功率(%) = 基本成功率 + (運 / 5)`
    - ※上限は 100% とします。
- **失敗時の影響**:
    - 合成に失敗した場合、投入した**材料（資材）はすべて失われます。**
    - 消費したゴールドについては、その **50%** が返金されます。

### 2.4 制限事項 (Restrictions)
- **サーキュレーション制限**: [アイテムマスターリスト](Item-Master-List.md) において流通上限（上限数）が設定されているアイテムは、世界内の現在の流通数がその上限に達している場合、**合成を実行することができません。**
- **呪われたアイテムの扱い**: 「呪い」状態にある装備品やアイテムを、合成の材料として使用することはできません。
- **倉庫容量の制限**: 合成後のアイテムを格納するための[倉庫（ストック）](Warehouse-System.md)の空き容量が不足している場合、合成を開始することができません。
    - **モンスターの卵**: 「モンスター枠」の空きを確認。
    - **装備品・特殊アイテム・消耗品**: 「アイテム枠」の空きを確認。
    - **資材 (`magic_crystal`, `torch`, `statue`)**: 「資材枠」の空きを確認。

## 3. 合成レシピ (Recipes)

主な合成レシピの一覧です。各資材の詳細は **[アイテムマスターリスト](Item-Master-List.md)** を参照してください。

### 3.1 資材・消耗品
| 生成アイテム | 必要材料 | 必要ゴールド | 備考 |
| :--- | :--- | :--- | :--- |
| `magic_crystal` | `iron` × 5 | 1,000 | 上位施設の建設に必須。 |
| `torch` | `wood` × 2 | 150 | ダンジョン内の照明。 |
| `statue` | `stone` × 10 | 800 | ダンジョン装飾。容量を 5 消費。 |

### 3.2 特殊アイテム
| 生成アイテム | 必要材料 | 必要ゴールド | 参照 |
| :--- | :--- | :--- | :--- |
| `orb_intrusion` | `magic_crystal` × 5 | 2,000 | [PKシステム](PK-System.md) |
| `capture_ball` | `iron` × 2, `magic_crystal` × 1 | 500 | [モンスターシステム](Monster-System.md) |
| `incubation_accelerator` | `magic_crystal` × 2, `demon_blood` × 1 | 500 | [繁殖システム](Monster-Breeding-System.md) |
| `mutation_potion` | `demon_blood` × 1, `magic_crystal` × 1 | 800 | [繁殖システム](Monster-Breeding-System.md) |
| `vigor_drink` | `magic_crystal` × 1, `ration` × 1 | 600 | [繁殖システム](Monster-Breeding-System.md) |
| `key_iron` | `iron` × 2 | 200 | [宝箱・鍵システム](Chest-Key-System.md) |
| `key_magic` | `magic_crystal` × 1, `magic_stone` × 1 | 1,000 | [宝箱・鍵システム](Chest-Key-System.md) |

### 3.3 装備品 (Equipment)
| 生成アイテム | 必要材料 | 必要ゴールド | 参照 |
| :--- | :--- | :--- | :--- |
| `sword_iron` | `iron` × 8 | 500 | [アイテムマスターリスト](Item-Master-List.md) |
| `armor_leather` | `wood` × 10 | 800 | [アイテムマスターリスト](Item-Master-List.md) |
| `short_bow` | `wood` × 15 | 2,000 | [アイテムマスターリスト](Item-Master-List.md) |
| `sword_steel` | `sword_iron` × 1, `iron` × 10 | 2,000 | [アイテムマスターリスト](Item-Master-List.md) |
| `dagger_poison` | `iron` × 5, `demon_blood` × 1 | 1,500 | [アイテムマスターリスト](Item-Master-List.md) |
| `composite_bow` | `short_bow` × 1, `iron` × 5 | 1,500 | [アイテムマスターリスト](Item-Master-List.md) |
| `armor_iron` | `armor_leather` × 1, `iron` × 12 | 1,800 | [アイテムマスターリスト](Item-Master-List.md) |
| `ring_power` | `iron` × 8, `magic_crystal` × 3 | 2,200 | [アイテムマスターリスト](Item-Master-List.md) |
| `ring_luck` | `magic_crystal` × 8 | 2,800 | [アイテムマスターリスト](Item-Master-List.md) |
| `sword_magic` | `sword_steel` × 1, `magic_stone` × 2 | 5,000 | [アイテムマスターリスト](Item-Master-List.md) |
| `bow_elven` | `composite_bow` × 1, `magic_stone` × 1 | 4,000 | [アイテムマスターリスト](Item-Master-List.md) |
| `armor_magic` | `magic_crystal` × 10, `magic_stone` × 1 | 6,000 | [アイテムマスターリスト](Item-Master-List.md) |
| `pendant_speed` | `magic_crystal` × 15, `magic_stone` × 2 | 8,000 | [アイテムマスターリスト](Item-Master-List.md) |

### 3.4 消耗品 (Consumables)
| 生成アイテム | 必要材料 | 必要ゴールド | 備考 |
| :--- | :--- | :--- | :--- |
| `scroll_identify` | `wood` × 2, `magic_crystal` × 1 | 300 | 鑑定の巻物。 |
| `scroll_uncurse` | `wood` × 2, `magic_crystal` × 1 | 500 | 解呪の巻物。 |
| `scroll_light` | `wood` × 2, `magic_crystal` × 2 | 500 | 明かりの巻物。 |
| `scroll_teleport` | `wood` × 2, `magic_crystal` × 1 | 150 | 高飛びの巻物。 |
| `scroll_confusion` | `wood` × 2, `magic_crystal` × 2 | 350 | 混乱の巻物。 |
| `potion_hp_large` | `potion_hp_small` × 2, `magic_crystal` × 1 | 1,000 | 回復の薬。 |
| `potion_stamina` | `ration` × 1, `magic_crystal` × 1 | 400 | スタミナの薬。 |
| `potion_antidote` | `apple` × 2, `magic_crystal` × 1 | 300 | 毒消し草。 |
| `potion_eye_drops` | `apple` × 2, `magic_crystal` × 1 | 300 | 目薬。 |
| `potion_blindness` | `rotten_food` × 2, `magic_crystal` × 1 | 300 | 目潰しの薬。 |
| `potion_clarity` | `apple` × 2, `magic_crystal` × 1 | 400 | 気付け薬。 |
| `potion_speed` | `large_meat` × 1, `magic_crystal` × 2 | 1,000 | 加速の薬。 |

### 3.5 釣り具・料理 (Fishing Gear & Cooking)
釣り道具、キャスト時に消費する様々なエサ、および釣り上げた魚を用いた調理用の各種レシピです。

| 生成アイテム | 必要材料 | 必要ゴールド | 備考 |
| :--- | :--- | :--- | :--- |
| `rod_wood` | `wood` × 5, `junk_weed` × 2 | 200 | 木製釣り竿。海藻を釣り糸として利用。 |
| `rod_iron` | `rod_wood` × 1, `iron` × 3, `magic_crystal_shard` × 2 | 800 | 鉄製釣り竿。頑丈で深場にも耐える。 |
| `rod_magic` | `rod_iron` × 1, `magic_crystal` × 2, `magic_stone` × 1 | 2,000 | 魔力釣り竿。魚影察知が極めて早い最上級竿。 |
| `bait_glowing` | `bait_worm` × 1, `magic_crystal_shard` × 1 | 50 | 光る虫。暗闇でのヒット率 **+15%**。 |
| `bait_lava_worm` | `bait_worm` × 1, `fire_stone` × 1 | 100 | 溶岩虫。溶岩バイオーム専用エサ。 |
| `bait_lure` | `iron` × 1, `magic_crystal_shard` × 1 | 300 | 合成擬似餌。紛失しない限り再利用可能。 |
| `cooked_cave_salmon` | `fish_cave_salmon` × 1, `torch` × 1 | 100 | 焼き洞窟鮭。満腹度回復、HP微回復。 |
| `cooked_slime_fish` | `fish_slime` × 1, `torch` × 1 | 50 | スライム蒲焼き。満腹度回復、毒解除。 |
| `cooked_frozen_cod` | `fish_frozen_cod` × 1, `iron` × 1, `torch` × 1 | 300 | 氷結タラのホイル焼き。満腹度大幅回復、鈍足解除、再生バフ。 |
| `cooked_magma_eel` | `fish_magma_eel` × 1, `demon_blood` × 1, `torch` × 1 | 600 | マグマウナギの蒲焼き。最大満腹度上昇、加速バフ。 |

## 4. アイテムの解体 (Item Dismantling)
不要になったアイテムを解体し、一部の材料を回収することができます。

- **回収ルール**:
    - アイテムの作成（合成）に使用された資材の **50%**（端数切り捨て）を回収できます。
    - 解体には費用として、そのアイテムの基本価格の **10%** のゴールドが必要です。
    - **サーキュレーションへの影響**: サーキュレーション制限（流通上限）があるアイテムを解体した場合、世界内の現在の流通カウントから **1 つ減算** されます。
- **解体可能なアイテム**:
    - 合成によって作成された装備品、特殊アイテム、消耗品（巻物、薬）、および合成資材（`magic_crystal`, `torch`, `statue` 等）。
    - 釣りで入手した「空き缶 (`can_empty`)」（解体により `iron` × 1 を獲得可能、解体費用 1G）。
- **解体不可能なアイテム**:
    - 純粋な採取・ドロップ資材（`wood`, `stone`, `iron`, `magic_stone`, `demon_blood`）。
    - 呪われている装備品。
    - クリア報酬やイベント限定アイテムの一部。

## 5. 価格とバランス
合成に必要なゴールドおよび資材の合計価値は、原則として **[アイテムマスターリスト](Item-Master-List.md)** の「基本価格」よりも高めに設定されています。これは、ショップでの流通に頼らず、確実かつ即座にアイテムを入手できるためのコスト（利便性）を反映したものです。

## 6. 特殊資材の扱い
[管理者データモデル](../implementation/Admin-Data-Models.md) に基づき、以下の特殊資材は特定の強力なアイテムや施設の合成に使用されます。

- **`magic_stone` (魔力石)**: 高度な魔法的効果を持つアイテムの核。
- **`demon_blood` (魔族の血)**: 生体的な強化や変異を促す薬の材料。

## 7. 相互参照
- [建築システム](Construction-System.md)
- [管理者データモデル](../implementation/Admin-Data-Models.md)
- [PKシステム](PK-System.md)
- [アイテムマスターリスト](Item-Master-List.md)
- [宝箱・鍵システム](Chest-Key-System.md)
