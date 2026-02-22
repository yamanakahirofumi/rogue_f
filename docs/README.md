# RogueF Documentation

このディレクトリには RogueF プロジェクトの仕様、設計、および開発ガイドラインに関するドキュメントが格納されています。

## ドキュメント構成

### 1. 基本ドキュメント
- **[specification.md](specification.md)**:
  プロジェクトの全体像、システム構成、画面構成、ゲームメカニクス、データモデルなどの基本仕様を記述しています。
- **[development.md](development.md)**:
  現在の開発状況、既知のバグ、今後の課題など、開発運用面に関する情報を記述しています。

### 2. 技術ガイドライン ([tech/](tech/))
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

## メンテナンス方針

- 新機能の追加や仕様の変更があった場合は、速やかに `specification.md` や関連する技術ドキュメントを更新してください。
- 開発上の課題やバグを発見した場合は、`development.md` または TODO リストに追記してください。
- ドキュメント作成の際は **[仕様書の書き方ルール](tech/Specification-Rule.md)** に従ってください。
