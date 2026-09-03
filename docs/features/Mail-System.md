# Mail-System

## 1. 概要
郵便・プレゼントシステム（Mail & Present System）は、拠点（Base Area）に設置された「郵便受け（Mailbox）」を通じて、各種ゲーム内報酬、運営からの通知、ダンジョン攻略時にインベントリから溢れた超過アイテム、およびサーバー間連携（トラストネットワーク）経由のギフトを受信・獲得するための仕組みです。

## 2. メールの分類と配信条件

メールは目的と送信元に応じて以下の 4 つのカテゴリに分類されます。

| カテゴリ ID | カテゴリ名 | 発生条件・用途 | 添付アイテムの例 |
| :--- | :--- | :--- | :--- |
| `system` | システム・運営通知 | メンテナンスお詫び、イベント告知、プロモーションプレゼント。 | ゴールド、消費アイテム、資材 |
| `ranking` | ランキング報酬 | [ランキングシステム](Ranking-System.md) におけるシーズン終了時の最終順位に応じた報酬。 | 限定称号、高級装備、モンスターの卵、資材 |
| `dungeon_overflow` | ダンジョン超過転送 | ダンジョンクリア時にインベントリが満杯で受け取れなかった報酬アイテムの安全保護。 | ダンジョンクリア報酬アイテム・ゴールド |
| `gift` | プレイヤー/クロスワールドギフト | 他サーバー（トラストネットワーク）や拠点内のNPC/システムからの贈答品。 | アイテム、資材 |

## 3. メールのライフサイクルと保存ルール

### 3.1 メールの状態 (Status)
メールは以下の状態を持ちます。
1. **未読 (`isRead: false`)**: プレイヤーがまだ詳細を確認していない状態。HUD や拠点アイコンに未読通知バッジ（点灯）が表示されます。
2. **既読 (`isRead: true`, `isClaimed: false`)**: メールの本文を確認済みで、添付アイテムが未受取の状態。
3. **受取済み (`isRead: true`, `isClaimed: true`)**: 添付アイテムを受け取り完了した状態。添付がない通知メールは本文確認時点で受取済みとなります。

### 3.2 保管上限と自動削除
- **最大保管件数**: プレイヤーの郵便受けには**最大 50 件**までメールを保管できます。
- **上限到達時の挙動**: 50 件に達している状態で新たなメールを受信した場合、**「受取済み」かつ「最も古いメール」**から自動的に削除されます。未受取の添付品があるメールは保護されます。
- **保護対象外の超過**: 未受取メールのみで 50 件に達した場合、最も古い未受取メールの添付品が**自動的に拠点倉庫へ転送**された上で古いメールから順に整理されます。

### 3.3 有効期限 (Expiration)
- **標準有効期限**: メールの送信（生成）から **30 日間** です。
- **期限切れの挙動**: 有効期限を過ぎたメールは、添付品の受取有無に関わらずサーバーの定期バッチ処理により自動削除されます。
- **無期限メール**: 一部の重要なお知らせや特定の成果報酬メールには、有効期限を設定しない (`expiresAt: undefined`) 運用も可能です。

## 4. 添付アイテムの受取ロジック (Claiming Rules)

### 4.1 個別受取と一括受取
- **個別受取**: プレイヤーがメール詳細画面で「受け取る」ボタンを押下した際、添付されているゴールド、経験値、アイテム、資材がプレイヤーの所持リソースへ反映されます。
- **一括受取**: 「一括受取」ボタンを押下することで、受取可能な全てのメールの添付品をワンタップでまとめて獲得できます。

### 4.2 インベントリ溢れ（倉庫転送）の安全保護
- **容量チェック**: 添付アイテムを受け取る際、プレイヤーのインベントリ空き枠数を検証します。
- **自動倉庫転送**: インベントリ容量を超過するアイテムが存在する場合、プレイヤーの**拠点倉庫（[倉庫システム](Warehouse-System.md)）のアイテム枠へ自動的に転送**されます。
- **倉庫も満杯の場合**: 万が一インベントリおよび拠点倉庫の両方が満杯でアイテムを受け取れない場合、受取処理は保留（失敗）され、「倉庫またはインベントリの空きを確保してください」というダイアログが表示されます。メールは削除されず未受取状態が維持されます。

## 5. データ構造とデータモデル

ゲームシステムおよび API 等で使用されるメール関連の基本データ構造の定義です。
TypeScript の型定義は `src/@types/player.d.ts` に配置されます。

```typescript
export interface MailMessage {
  id: string;                                                // メール固有ID
  recipientUserId: string;                                    // 受信者のユーザーID
  senderName: string;                                         // 送信者名 (例: 'システム運営', 'ランキング協会')
  title: string;                                              // 件名
  content: string;                                            // 本文
  category: 'system' | 'ranking' | 'dungeon_overflow' | 'gift'; // メール種別
  isRead: boolean;                                            // 既読フラグ
  isClaimed: boolean;                                         // 添付品受取済みフラグ
  createdAt: Date | string;                                   // 送信日時
  expiresAt?: Date | string;                                  // 有効期限
  attachments?: MailAttachment;                               // 添付報酬/アイテム
}

export interface MailAttachment {
  gold?: number;                                              // 獲得ゴールド
  exp?: number;                                               // 獲得経験値
  items?: InventoryItem[];                                    // 獲得アイテムのリスト
  materials?: { typeId: string; amount: number }[];           // 獲得資材のリスト
}

export interface MailClaimResult {
  success: boolean;                                           // 受取成否
  claimedAttachment?: MailAttachment;                         // 受け取った報酬
  transferredToWarehouse?: boolean;                           // インベントリ超過により倉庫へ転送されたか
  message: string;                                            // 結果メッセージ
}
```

## 6. API エンドポイント

詳細な REST API リファレンスは **[実装詳細](../implementation/Implementation-Details.md#22-プレイヤー情報)** を参照してください。

- `GET /api/player/{userId}/mail`: 保管中のメール一覧を取得。
- `POST /api/player/{userId}/mail/{mailId}/claim`: 指定したメールの添付品を受け取り。
- `POST /api/player/{userId}/mail/claim-all`: 全ての未受取メールの添付品を一括受取。
- `DELETE /api/player/{userId}/mail/{mailId}`: 指定したメールを削除。
- `DELETE /api/player/{userId}/mail/clear-read`: 既読・受取済みのメールを一括削除。

## 7. UI・UX 仕様

詳細は **[UI・UX設計](UI-UX-Design.md)** を参照してください。

- **拠点 HUD 通知バッジ**: 未読または未受取の添付品が存在する場合、画面上部 HUD の郵便受けアイコンに赤い通知バッジ（件数数字付き）を表示します。
- **郵便受けモーダル**:
  - メールのタブ切替（「すべて」「未読」「未受取」）。
  - 各メール行には送信者、件名、残存日数（例：「あと 5 日」）、添付アイコンが表示されます。
  - 画面下部に「一括受取」および「既読削除」ボタンを配置。

## 8. 相互参照
- [拠点システム](Base-System.md)
- [ランキングシステム](Ranking-System.md)
- [機能仕様書](Functional-Specification.md)
- [倉庫システム](Warehouse-System.md)
- [インベントリシステム](Inventory-System.md)
- [実装詳細](../implementation/Implementation-Details.md)
- [UI・UX設計](UI-UX-Design.md)
