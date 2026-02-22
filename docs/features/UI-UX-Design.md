# UI-UX-Design

## 1. 画面構成とルーティング
アプリケーションは以下のルートで構成されています。

- `/user/create`: **ユーザー作成画面**
  - 新規プレイヤーの作成を行います。
- `/play`: **プレイ画面**
  - ダンジョン探索のメイン画面です。
- `/admin`: **管理画面**
  - 世界設定、アイテム設定、メニュー管理などを行います。
  - `/admin/menu`: 管理メニューを表示します。
  - `/admin/menu/menu`: 世界設定（`WorldComponent`）を表示します（子ルート）。

## 2. コンポーネント階層
主なコンポーネントの階層構造は以下の通りです。

- `AppComponent`
  - `CreateUserComponent` (ユーザー作成)
  - `DungeonComponent` (プレイ画面)
    - `MessageComponent` (メッセージ表示)
    - `StatusBarComponent` (ステータス表示)
  - `AdminModule` (遅延読み込み)
    - `MenuComponent` (管理メニュー)
      - `WorldComponent` (世界設定、子ルートとして表示)

## 3. 基本デザイン
- **背景色**: 黒 (`background: black`)
- **文字色**: 白 (`color: white`)
- **フォント**: `"Courier New"`, `"Noto Sans Mono CJK"`, monospace (ローグライクらしいレトロな雰囲気を演出)
- **操作フィードバック**:
  - ゲーム内メッセージ（`MessageComponent`）によるイベントログ出力。
  - ステータスバー（`StatusBarComponent`）によるリアルタイムな状態表示。
