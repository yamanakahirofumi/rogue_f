# RogueF Documentation

このディレクトリには RogueF プロジェクトの仕様、設計、および開発ガイドラインに関するドキュメントが格納されています。

## 1. ドキュメント構成

### 1.1 機能・仕様 ([features/](features/))
ゲームの機能や仕様に関する核となる情報を記述しています。
- **[ゲーム機能概要](features/Game-Features.md)**: プロジェクト概要、基本操作、ゲームサイクル。
- **[機能仕様書](features/Functional-Specification.md)**: システム構成、二つのダンジョン形式、管理者メリット、世界間連携。
- **[戦闘システム](features/Combat-System.md)**: リアルタイム制バトル、ダメージ計算、モンスターAI。
- **[モンスターシステム](features/Monster-System.md)**: モンスターの獲得、繁殖、運用。
- **[モンスター繁殖システム](features/Monster-Breeding-System.md)**: 卵の生成、遺伝、孵化。
- **[PKシステム](features/PK-System.md)**: プレイヤーキル、モンスターとしての参戦。
- **[経験値・レベルアップシステム](features/Leveling-System.md)**: プレイヤーの成長要素、経験値計算式、ステータス成長。
- **[満腹度システム](features/Hunger-System.md)**: 満腹度の減少、飢餓による影響、食料アイテム。
- **[インベントリシステム](features/Inventory-System.md)**: アイテムの所持、使用、識別、およびリソース管理。
- **[ショップシステム](features/Shop-System.md)**: 管理者によるショップ運営、動的な価格決定、アイテムの売買。
- **[建築システム](features/Construction-System.md)**: 管理者によるダンジョン地形の構築、施設の設置、および資材管理。
- **[装備システム](features/Equipment-System.md)**: 装備の装着、ステータス補正、および呪いによる固定。
- **[アイテム識別システム](features/Item-Identification-System.md)**: アイテムの鑑定、呪い・祝福の状態管理。
- **[状態異常システム](features/Status-Effect-System.md)**: バフ・デバフの種類、効果、および管理方法。
- **[トラップシステム](features/Trap-System.md)**: トラップの種類、発見・解除メカニズム、および管理者による配置。
- **[倉庫システム](features/Warehouse-System.md)**: モンスター、アイテム、および資材の保管と管理。
- **[管理者システム](features/Admin-System.md)**: ダンジョン構築、モンスター・トラップ配置、ショップ経営、世界設定の管理。
- **[システム要件](features/System-Requirements.md)**: 動作環境、技術構成、制約事項。
- **[UI・UX設計](features/UI-UX-Design.md)**: 画面遷移、コンポーネント階層、デザイン方針。
- **[開発ロードマップ](features/Development-Roadmap.md)**: 開発状況、既知のバグ、今後の課題。
- **[TODOリスト](TODO-Details.md)**: 面白さを向上させるための機能アイデアと技術的課題。

### 1.2 実装詳細 ([implementation/](implementation/))
特定の機能を実現するための詳細なデータ構造やアルゴリズムを記述しています。
- **[実装詳細](implementation/Implementation-Details.md)**: クラス設計、APIリファレンス、データモデル。
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
