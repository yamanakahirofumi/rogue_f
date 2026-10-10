# RogueF Documentation

このディレクトリには RogueF プロジェクトの仕様、設計、および開発ガイドラインに関するドキュメントが格納されています。

## 1. ドキュメント構成

### 1.1 機能・仕様 ([features/](features/))
ゲームの機能や仕様に関する核となる情報を記述しています。機能ドメインごとに分類されています。

#### ① 核となるコンセプト・全般 (Core & System Overview)
- **[ゲーム機能概要](features/Game-Features.md)**: プロジェクト概要、基本操作、ゲームサイクル。
- **[機能仕様書](features/Functional-Specification.md)**: システム構成、二つのダンジョン形式、管理者メリット、世界間連携。
- **[システム要件](features/System-Requirements.md)**: 動作環境、技術構成、制約事項。
- **[拠点システム](features/Base-System.md)**: プレイヤーと管理者の活動のハブとなる安全地帯の役割と主要施設。
- **[UI・UX設計](features/UI-UX-Design.md)**: 画面遷移、コンポーネント階層、デザイン方針、および各種拡張機能のUI詳細。
- **[開発ロードマップ](features/Development-Roadmap.md)**: 開発状況、既知のバグ、実装優先順位、完了履歴。
- **[TODOリスト](TODO-Details.md)**: 面白さを向上させるための機能アイデアと技術的課題。

#### ② プレイヤー行動・ステータス・進行システム (Player & Progression)
- **[アクションシステム](features/Action-System.md)**: 移動、攻撃、アイテム使用などの行動コストとスタミナ・満腹度消費。
- **[経験値・レベルアップシステム](features/Leveling-System.md)**: プレイヤーの成長要素、経験値計算式、ステータス成長。
- **[自然回復システム](features/Natural-Recovery-System.md)**: HP、スタミナの自然回復、状態による回復量補正。
- **[満腹度システム](features/Hunger-System.md)**: 満腹度の減少、飢餓による影響、食料アイテム。
- **[インベントリシステム](features/Inventory-System.md)**: アイテムの所持、使用、整理・スタック統合、識別およびリソース管理。
- **[装備システム](features/Equipment-System.md)**: 装備の装着、ステータス補正、および呪いによる固定。
- **[アイテム識別システム](features/Item-Identification-System.md)**: アイテムの鑑定、呪い・祝福の状態管理。
- **[クエストシステム](features/Quest-System.md)**: 探索者、ダンジョン管理者、PKerそれぞれの目標、進行状況管理および報酬マスターリスト。
- **[称号・実績システム](features/Title-System.md)**: 称号および実績の解除条件、装備時バフ効果、表示とNPC会話への影響。
- **[セーブ・ロードシステム](features/Save-Load-System.md)**: プレイ状況の保存、中断・再開、および永続化データ構造。

#### ③ ダンジョン生成・環境・ギミック (Dungeon & Environment)
- **[ダンジョン生成システム](features/Dungeon-Generation-System.md)**: ランダムダンジョンの生成ロジック、部屋・通路・特殊エリアの配置ルール。
- **[バイオーム・環境システム](features/Biome-System.md)**: 各バイオーム特有の地形生成率、出現モンスターやドロップ率、ステータス補正。
- **[昼夜・天候システム](features/Time-Weather-System.md)**: ゲーム内の時間帯（昼夜）や天候の変化、および各種環境効果、釣りや戦闘への動的影響。
- **[視界システム](features/Visibility-System.md)**: プレイヤーの視界半径、視線遮蔽、および照明効果。
- **[宝箱・鍵システム](features/Chest-Key-System.md)**: 宝箱の種類、各種鍵、開錠・破壊リスクおよびミミックへの対処メカニズム。
- **[トラップシステム](features/Trap-System.md)**: トラップの種類、ダメージ計算、発見・解除・解体メカニズム。
- **[トラップマスターリスト](features/Trap-Master-List.md)**: 全トラップのコスト、容量、難易度、属性。
- **[地形マスターリスト](features/Terrain-Master-List.md)**: 各地形の環境効果、属性耐性の影響、建設・解体コスト。

#### ④ 戦闘・属性・状態異常・派閥 (Combat & Status)
- **[戦闘システム](features/Combat-System.md)**: リアルタイム制バトル、ダメージ計算式、命中・回避・クリティカル判定、投擲、モンスターAI。
- **[属性システム](features/Attribute-System.md)**: 属性の相性、ダメージ倍率、および環境効果への耐性。
- **[状態異常システム](features/Status-Effect-System.md)**: バフ・デバフの種類（`CHILLED`, `OVERHEATED` 等）、効果、および管理方法。
- **[派閥システム](features/Faction-System.md)**: エンティティ間の敵対・友好関係、ターゲット優先度。
- **[PKシステム](features/PK-System.md)**: プレイヤーキル、憑依/野良モンスターとしての参戦、マッチメイキング、清算処理。

#### ⑤ モンスター・育成・図鑑・遠征 (Monster & Companion)
- **[モンスターシステム](features/Monster-System.md)**: モンスターの獲得、捕獲、配置、撤去回収。
- **[モンスターマスターリスト](features/Monster-Master-List.md)**: 全モンスターの詳細仕様、ステータス、AIパターン、特殊行動。
- **[モンスター特性リスト](features/Monster-Trait-List.md)**: 特性の種類、効果、カテゴリ、レアリティ。
- **[モンスター繁殖システム](features/Monster-Breeding-System.md)**: 卵の生成、遺伝、孵化計算式、即時孵化促進。
- **[モンスター遠征システム](features/Monster-Expedition-System.md)**: モンスターを遠征に派遣し、経験値やゴールド、建築資材、アイテムを獲得。
- **[モンスター図鑑システム](features/Monster-Bestiary-System.md)**: 遭遇・討伐・捕獲・繁殖データの記録・研究、段階的情報開示および各種ボーナス。
- **[活力システム](features/Vigor-System.md)**: モンスターの活動リソース（活力）の消費と回復。

#### ⑥ 建築・施設・経済・アイテム・アクティビティ (Economy, Facilities & Activities)
- **[建築システム](features/Construction-System.md)**: 管理者によるダンジョン地形の構築、施設の設置・解体、および資材管理。
- **[施設マスターリスト](features/Facility-Master-List.md)**: 全8種施設のコスト、容量、効果。
- **[倉庫システム](features/Warehouse-System.md)**: モンスター、アイテム、資材の保管、預入・引出、容量拡張。
- **[ショップシステム](features/Shop-System.md)**: 管理者およびシステムショップ運営、動的価格決定、陳列・鑑定・閉鎖。
- **[合成システム](features/Synthesis-System.md)**: 資材の組み合わせによるアイテム生成、レシピ管理、解体処理。
- **[アイテムマスターリスト](features/Item-Master-List.md)**: 全アイテムの詳細仕様、効果、価格、流通上限。
- **[ドロップ品・出現システム](features/Loot-and-Spawn-System.md)**: アイテムやゴールドの出現、モンスターのドロップロジック、サーキュレーション制限の適用。
- **[祭壇システム](features/Altar-System.md)**: 四大神を祀る祭壇（altar）を巡る、探索・防衛バフ、奉納、冒涜と神罰。
- **[彫像システム](features/Statue-System.md)**: 配置した彫像への特殊効果設定、範囲内エンティティへのバフ・デバフ付与。
- **[釣りシステム](features/Fishing-System.md)**: 釣竿・エサを用いた釣りメカニズム、バイオーム別釣獲物、管理者設置釣り堀。
- **[メール・プレゼントシステム](features/Mail-System.md)**: お知らせ・シーズン報酬・溢れ戦利品の受信、有効期限、倉庫自動転送。

#### ⑦ マルチプレイ・通信・運営・システム統合 (Multiplayer, Admin & Media)
- **[管理者システム](features/Admin-System.md)**: ダンジョン構築、モンスター・トラップ配置、ショップ経営、信頼ネットワーク管理。
- **[管理者介入システム](features/Admin-Intervention-System.md)**: 管理者によるリアルタイム介入（召喚、環境効果発生）の詳細。
- **[ランキングシステム](features/Ranking-System.md)**: 各役割における実績の競い合い、シーズン制と報酬、および通知。
- **[リプレイ・観戦システム](features/Replay-Spectator-System.md)**: リアルタイム観戦（SSE配信・声援送受信）、ティック単位差分ログリプレイ、共有機能。
- **[エモート・スタンプマスターリスト](features/Emote-Stamp-Master-List.md)**: 簡易意思疎通ツールの仕様と一覧。
- **[ゲームバランス調整システム](features/Game-Balance-System.md)**: ライブチューニングパラメータ、テレメトリ自動収集、手触り調整基準。
- **[オーディオ・BGMシステム](features/Audio-System.md)**: 音量設定、状況に応じた動的BGM切り替え、SEマスターリスト、空間減衰。
- **[ストーリー・世界観システム](features/Story-Lore-System.md)**: 背景設定、NPCとの動的会話、ジャーナル画面、世界観記録・NPC会話マスター。

### 1.2 実装詳細 ([implementation/](implementation/))
特定の機能を実現するための詳細なデータ構造やアルゴリズムを記述しています。
- **[実装詳細](implementation/Implementation-Details.md)**: クラス設計、APIリファレンス、データモデル。
- **[管理者データモデル](implementation/Admin-Data-Models.md)**: ダンジョン、階層、ショップ、および倉庫の管理用データ構造。
- **[イベントログ詳細仕様](implementation/Event-Log-Schemas.md)**: 各種イベントログの具体的なデータ構造。
- **[最適化戦略](implementation/Optimization-Strategy.md)**: パフォーマンス向上のための手法。

### 1.3 技術ガイドライン ([tech/](tech/))
開発における共通ルールと技術的な方針を定義しています。
- **[技術スタック](tech/Tech-Stack.md)**: 使用している言語、フレームワーク、ツールのバージョン。
- **[アーキテクチャ設計](tech/Architecture.md)**: ディレクトリ構造とコンポーネントの責務。
- **[コーディング規約](tech/Coding-Convention.md)**: TypeScript/Angular の記述基準。
- **[テストルール](tech/Test-Rule.md)**: テストの書き方とカバレッジ目標。
- **[品質方針](tech/Quality-Policy.md)**: フェーズ別の品質目標と判断基準。
- **[CI/CD 設定](tech/CI-Setting.md)**: GitHub Actions による自動化プロセス。
- **[ロギング方針](tech/Logging-Policy.md)**: ログレベルと出力形式。
- **[エラーハンドリング方針](tech/Error-Handling-Policy.md)**: 例外処理とユーザーフィードバック。
- **[配布方法](tech/Distribution-Method.md)**: ビルドとデプロイの手順。
- **[仕様書の書き方ルール](tech/Specification-Rule.md)**: ドキュメント作成の標準。
- **[TODOリストの書き方ルール](tech/TODO-Rule.md)**: 課題管理の記述形式。

## 2. メンテナンス方針

- 新機能の追加や仕様の変更があった場合は、関連するドキュメントを更新してください。
- 開発上の課題やバグを発見した場合は、`Development-Roadmap.md` または TODO リストに追記してください。
- ドキュメント作成の際は **[仕様書の書き方ルール](tech/Specification-Rule.md)** に従ってください。
