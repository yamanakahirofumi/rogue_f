# RogueF Documentation

このディレクトリには RogueF プロジェクトの仕様、設計、および開発ガイドラインに関するドキュメントが格納されています。

## 1. ドキュメント構成

### 1.1 機能・仕様 ([features/](features/))
ゲームの機能や仕様に関する核となる情報を記述しています。
- **[ゲーム機能概要](features/Game-Features.md)**: プロジェクト概要、基本操作、ゲームサイクル。
- **[アクションシステム](features/Action-System.md)**: 移動、攻撃、アイテム使用などの行動コストとスタミナ・満腹度消費。
- **[オーディオ・BGMシステム](features/Audio-System.md)**: 音量設定、エリアや状況に応じた動的なBGM切り替え、SEの空間減衰と同時再生制限。
- **[属性システム](features/Attribute-System.md)**: 属性の相性、ダメージ倍率、および環境効果への耐性。
- **[バイオーム・環境システム](features/Biome-System.md)**: 各バイオーム特有の地形生成率、出現モンスターやドロップ率、ステータス等に対する環境補正。
- **[拠点システム](features/Base-System.md)**: プレイヤーと管理者の活動のハブとなる安全地帯の役割と施設。
- **[機能仕様書](features/Functional-Specification.md)**: システム構成、二つのダンジョン形式、管理者メリット、世界間連携。
- **[ダンジョン生成システム](features/Dungeon-Generation-System.md)**: ランダムダンジョンの生成ロジック、部屋・通路の配置ルール。
- **[戦闘システム](features/Combat-System.md)**: リアルタイム制バトル、ダメージ計算、モンスターAI。
- **[モンスターシステム](features/Monster-System.md)**: モンスターの獲得、繁殖、運用。
- **[モンスター遠征システム](features/Monster-Expedition-System.md)**: モンスターを遠征に派遣し、経験値やゴールド、建築資材、アイテムを獲得。
- **[モンスター繁殖システム](features/Monster-Breeding-System.md)**: 卵の生成、遺伝、孵化。
- **[モンスター特性リスト](features/Monster-Trait-List.md)**: 特性の種類、効果、レアリティ。
- **[活力システム](features/Vigor-System.md)**: モンスターの活動リソース（活力）の消費と回復。
- **[モンスターマスターリスト](features/Monster-Master-List.md)**: 全モンスターの詳細仕様、ステータス、AIパターン。
- **[トラップマスターリスト](features/Trap-Master-List.md)**: 全トラップのコスト、容量、難易度。
- **[施設マスターリスト](features/Facility-Master-List.md)**: 全施設のコスト、容量、効果。
- **[地形マスターリスト](features/Terrain-Master-List.md)**: 各地形の環境効果、属性耐性の影響。
- **[セーブ・ロードシステム](features/Save-Load-System.md)**: プレイ状況の保存、中断・再開、および永続化。
- **[PKシステム](features/PK-System.md)**: プレイヤーキル、モンスターとしての参戦。
- **[経験値・レベルアップシステム](features/Leveling-System.md)**: プレイヤーの成長要素、経験値計算式、ステータス成長。
- **[ランキングシステム](features/Ranking-System.md)**: 各役割における実績の競い合い、シーズン制と報酬、および通知。
- **[エモート・スタンプマスターリスト](features/Emote-Stamp-Master-List.md)**: プレイヤー間の簡易意思疎通ツールの仕様と一覧。
- **[ドロップ品・出現システム](features/Loot-and-Spawn-System.md)**: アイテムやゴールドの出現、モンスターのドロップロジック、サーキュレーション制限の適用。
- **[自然回復システム](features/Natural-Recovery-System.md)**: HP、スタミナの自然回復、状態による回復量補正。
- **[満腹度システム](features/Hunger-System.md)**: 満腹度の減少、飢餓による影響、食料アイテム。
- **[インベントリシステム](features/Inventory-System.md)**: アイテムの所持、使用、識別、およびリソース管理。
- **[ショップシステム](features/Shop-System.md)**: 管理者によるショップ運営、動的な価格決定、アイテムの売買。
- **[合成システム](features/Synthesis-System.md)**: 資材の組み合わせによるアイテム生成、レシピ管理。
- **[派閥システム](features/Faction-System.md)**: エンティティ間の敵対・友好関係、ターゲット優先度。
- **[視界システム](features/Visibility-System.md)**: プレイヤーの視界半径、視線遮蔽、および照明効果。
- **[管理者介入システム](features/Admin-Intervention-System.md)**: 管理者によるリアルタイム介入（召喚、特殊効果）の詳細。
- **[アイテムマスターリスト](features/Item-Master-List.md)**: 全アイテムの詳細仕様、効果、価格、流通上限。
- **[建築システム](features/Construction-System.md)**: 管理者によるダンジョン地形の構築、施設の設置、および資材管理。
- **[装備システム](features/Equipment-System.md)**: 装備の装着、ステータス補正、および呪いによる固定。
- **[アイテム識別システム](features/Item-Identification-System.md)**: アイテムの鑑定、呪い・祝福の状態管理。
- **[状態異常システム](features/Status-Effect-System.md)**: バフ・デバフの種類、効果、および管理方法。
- **[トラップシステム](features/Trap-System.md)**: トラップの種類、ダメージ計算、発見・解除メカニズム、および管理者による配置。
- **[倉庫システム](features/Warehouse-System.md)**: モンスター、アイテム、および資材の保管と管理。
- **[管理者システム](features/Admin-System.md)**: ダンジョン構築、モンスター・トラップ配置、ショップ経営、世界設定の管理。
- **[システム要件](features/System-Requirements.md)**: 動作環境、技術構成、制約事項。
- **[UI・UX設計](features/UI-UX-Design.md)**: 画面遷移、コンポーネント階層、デザイン方針。
- **[開発ロードマップ](features/Development-Roadmap.md)**: 開発状況、既知のバグ、今後の課題。
- **[TODOリスト](TODO-Details.md)**: 面白さを向上させるための機能アイデアと技術的課題。

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
