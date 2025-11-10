# 要件定義書：ガチャ自販機サイト

## 1. 概要

### 1.1. プロジェクトの背景
大学のキャンパス内に設置された、特定の自動販売機に存在する「二人専用ランダムドリンクボタン」機能（以下、ガチャ）を対象とする。このガチャは、自販機内で最も安い飲料の2倍の価格で、ランダムなドリンクが2本排出される仕様となっており、利用者が金銭的に損をすることはない。

### 1.2. プロジェクトの目的
このガチャ体験をより楽しく、コミュニティで共有できるものにするため、結果の投稿・集計を行うWebサイトを開発する。利用者はガチャの結果を記録し、他の利用者の結果を閲覧し、統計情報を楽しむことができる。これにより、ガチャ体験に新たな価値を付与し、利用者間のコミュニケーションを誘発する。

---

## 2. 機能要件

### 2.1. 機能一覧
- **F-01**: ガチャ結果投稿機能
- **F-02**: 投稿タイムライン表示機能
- **F-03**: 統計情報表示機能
- **F-04**: 個人累計お得額表示機能

### 2.2. 機能詳細
- **F-01: ガチャ結果投稿機能**
    - ユーザーは、ガチャで排出されたドリンク2本の名前を入力する。
    - 任意で、結果の写真をアップロードできる。
    - 投稿日時はシステムが自動的に記録する。

- **F-02: 投稿タイムライン表示機能**
    - すべてのユーザーの投稿を時系列（新しい順）で表示する。
    - 各投稿には、そのガチャで得した金額（お得度）を表示する。（例：「+30円お得！」）

- **F-03: 統計情報表示機能**
    - 以下の統計情報を表示する。
        1.  **ドリンク別排出率ランキング**: これまで排出された全ドリンクの品目別ランキング。
        2.  **お得度ランキング**: 最も得した金額が大きかった投稿の組み合わせランキング。
        3.  **サイト全体の累計お得額**: 全ユーザーの総利益額。

- **F-04: 個人累計お得額表示機能**
    - サイト訪問者個人の、これまでの累計お得額を表示する。
    - この記録は、ユーザー登録を不要とし、ブラウザのローカルストレージ等に保存する。

---

## 3. データ要件

### 3.1. 主要データモデル
- **投稿 (Post)**
    - `ID`: 一意の識別子
    - `drink_1_name`: ドリンク1の名前 (string)
    - `drink_2_name`: ドリンク2の名前 (string)
    - `photo_url`: 写真のURL (string, nullable)
    - `created_at`: 投稿日時 (timestamp)
    - `profit`: お得度（円） (integer)
- **ドリンクマスター (DrinkMaster)**
    - `ID`: 一意の識別子
    - `name`: ドリンク名 (string)
    - `price`: 通常価格（円） (integer)

### 3.2. データフロー
1.  **投稿時**:
    1.  ユーザーが投稿フォームにドリンク名2つを入力し、送信する。
    2.  サーバーは受信したドリンク名2つを元に、`ドリンクマスター`からそれぞれの価格を取得する。
    3.  `（価格1 + 価格2） - ガチャ価格` の計算式で `profit` を算出する。
    4.  `投稿`データとして、各種情報と共にデータベースに保存する。
2.  **表示時**:
    1.  クライアント（ブラウザ）がサーバーに`投稿`データを要求する。
    2.  サーバーはデータベースから`投稿`データを取得し、クライアントに送信する。
    3.  クライアントは受信したデータを元に、タイムラインや各種統計を描画する。

---

## 4. 画面要件

### 4.1. 画面一覧
- **A-01**: メイン画面 (SPA)
- **A-02**: 投稿フォーム (モーダル/オーバーレイ)

### 4.2. 画面構成・遷移
本サイトは単一のページ（シングルページアプリケーション）で構成される。

- **全体構成**:
    - `ヘッダー`: サイトタイトルを常時表示。
    - `メインコンテンツ`: タブ切り替えで表示内容が変化する。
    - `投稿ボタン`: フローティングアクションボタン（FAB）として画面右下などに常時表示。
- **画面遷移**:
    1.  サイトにアクセスすると、**A-01: メイン画面**が表示される。デフォルトのタブは「タイムライン」。
    2.  メイン画面上部の `[タイムライン]` `[統計]` タブをタップすることで、ページ遷移なくコンテンツの表示が切り替わる。
    3.  `投稿ボタン`をタップすると、**A-02: 投稿フォーム**がモーダルウィンドウ（または画面下からのスライドアップ）として表示される。
    4.  投稿フォームで「投稿」または「キャンセル」をタップすると、フォームが閉じてメイン画面に戻る。

---

## 5. 非機能要件

### 5.1. ユーザビリティ (UI/UX)
- **デザイン**: ミニマリスト的で、不要な装飾を排したシンプルなデザインとする。
- **操作性**: ITリテラシーに依らず、誰でも直感的に操作・投稿ができること。
- **プラットフォーム**: スマートフォンでの閲覧・操作に最適化されたモバイルファースト設計とする。

### 5.2. パフォーマンス
- ページ読み込み、タブ切り替え、統計計算などの各種操作に対し、ユーザーがストレスを感じない高速なレスポンスを維持すること。

---

## 6. 技術要件

### 6.1. 技術スタック
- **フロントエンド**: Next.js 16, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Radix UI
- **バックエンド/データベース**: Firebase
  - **認証**: Firebase Authentication (不要の場合は省略可)
  - **データベース**: Firestore
  - **ストレージ**: Firebase Storage (写真アップロード用)

### 6.2. 開発環境
- **パッケージマネージャー**: npm
- **リンター**: ESLint
- **フォーマッター**: Prettier (必要に応じて)
- **バージョン管理**: Git/GitHub

---

## 7. Firestoreスキーマ定義

### 7.1. コレクション構造

#### 7.1.1. `posts` コレクション
ガチャの結果投稿を管理するコレクション。

| フィールド名 | 型 | 説明 | 必須 | インデックス |
|---|---|---|---|---|
| `id` | string | ドキュメントID（自動生成） | ○ | - |
| `drink_1_name` | string | ドリンク1の名前 | ○ | ○ |
| `drink_2_name` | string | ドリンク2の名前 | ○ | ○ |
| `photo_url` | string | 投稿写真のURL | × | - |
| `profit` | number | お得度（円） | ○ | ○ |
| `created_at` | timestamp | 投稿日時 | ○ | ○ |
| `updated_at` | timestamp | 更新日時 | ○ | - |

**複合インデックス**: 
- `created_at` (降順) + `profit` (降順) - タイムラインの取得用

#### 7.1.2. `drink_master` コレクション
販売されているドリンク情報を管理するマスターデータ。

| フィールド名 | 型 | 説明 | 必須 | インデックス |
|---|---|---|---|---|
| `id` | string | ドキュメントID（自動生成） | ○ | - |
| `name` | string | ドリンク名（一意） | ○ | ○ |
| `price` | number | 通常価格（円） | ○ | - |
| `created_at` | timestamp | 登録日時 | ○ | - |

#### 7.1.3. `gacha_config` コレクション
ガチャ機の設定情報（ガチャ価格など）を管理する。

| フィールド名 | 型 | 説明 | 必須 |
|---|---|---|---|
| `id` | string | ドキュメントID（"config" 固定） | ○ |
| `gacha_price` | number | ガチャの価格（円） | ○ |
| `updated_at` | timestamp | 更新日時 | ○ |

### 7.2. セキュリティルール（Firestore Rules）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // posts コレクションは誰でも読み取り可能、追加のみ可能
    match /posts/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['drink_1_name', 'drink_2_name', 'profit', 'created_at']);
      allow update, delete: if false;
    }

    // drink_master コレクションは誰でも読み取り可能
    match /drink_master/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // gacha_config コレクションは誰でも読み取り可能
    match /gacha_config/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 7.3. ドキュメント例

#### posts コレクション内のドキュメント例
```json
{
  "drink_1_name": "コカ・コーラ",
  "drink_2_name": "オレンジジュース",
  "photo_url": "https://storage.googleapis.com/...",
  "profit": 45,
  "created_at": "2025-11-09T15:30:00Z",
  "updated_at": "2025-11-09T15:30:00Z"
}
```

#### drink_master コレクション内のドキュメント例
```json
{
  "name": "コカ・コーラ",
  "price": 150,
  "created_at": "2025-11-01T00:00:00Z"
}
```

#### gacha_config コレクション内のドキュメント例
```json
{
  "gacha_price": 300,
  "updated_at": "2025-11-01T00:00:00Z"
}
```

---

## 8. Firestore 関数仕様

### 8.1. 投稿関連関数

#### 8.1.1. `createPost(drink1Name: string, drink2Name: string, photoUrl?: string): Promise<string>`
- **説明**: ガチャ結果を投稿する
- **引数**:
  - `drink1Name`: ドリンク1の名前
  - `drink2Name`: ドリンク2の名前
  - `photoUrl`: (オプション) 写真URL
- **戻り値**: 作成されたドキュメントID
- **処理フロー**:
  1. `drink_master` から各ドリンクの価格を取得
  2. `gacha_config` からガチャ価格を取得
  3. `profit = (price1 + price2) - gacha_price` を計算
  4. `posts` に新規ドキュメントを作成
- **エラーハンドリング**: ドリンク名が見つからない場合、既知のドリンクのみで計算

#### 8.1.2. `getPosts(limit: number = 20, startAfter?: DocumentSnapshot): Promise<Post[]>`
- **説明**: タイムライン表示用の投稿一覧を取得（新順）
- **引数**:
  - `limit`: 取得件数
  - `startAfter`: (オプション) ページング用スナップショット
- **戻り値**: Post[]（id, drink_1_name, drink_2_name, photo_url, profit, created_at を含む）
- **クエリ条件**: `created_at` 降順でソート

#### 8.1.3. `getPostById(postId: string): Promise<Post | null>`
- **説明**: 特定の投稿を取得
- **引数**: `postId` - 投稿ID
- **戻り値**: Post オブジェクト、見つからない場合は null

### 8.2. ドリンク関連関数

#### 8.2.1. `getDrinkMaster(): Promise<DrinkMaster[]>`
- **説明**: 全ドリンクマスターデータを取得
- **引数**: なし
- **戻り値**: DrinkMaster[]（id, name, price を含む）

#### 8.2.2. `getDrinkByName(name: string): Promise<DrinkMaster | null>`
- **説明**: ドリンク名からマスターデータを検索
- **引数**: `name` - ドリンク名
- **戻り値**: DrinkMaster、見つからない場合は null

#### 8.2.3. `addDrinkMaster(name: string, price: number): Promise<string>`
- **説明**: 新しいドリンクをマスターに追加（管理画面用）
- **引数**:
  - `name`: ドリンク名
  - `price`: 価格（円）
- **戻り値**: 作成されたドキュメントID

### 8.3. 統計関連関数

#### 8.3.1. `getDrinkRanking(limit: number = 10): Promise<DrinkRankingItem[]>`
- **説明**: ドリンク別排出率ランキングを取得
- **戻り値**: `{ name: string, count: number, percentage: number }[]`
- **処理**: posts から飲料名を集計し、出現回数でランキング化

#### 8.3.2. `getProfitRanking(limit: number = 10): Promise<Post[]>`
- **説明**: お得度ランキング（最も得した投稿組み合わせ）を取得
- **戻り値**: Post[]（profit 降順）

#### 8.3.3. `getTotalProfit(): Promise<number>`
- **説明**: サイト全体の累計お得額を取得
- **戻り値**: 合計額（円）
- **処理**: posts の profit フィールドの合計

#### 8.3.4. `getDrinkCombinationRanking(limit: number = 10): Promise<CombinationRankingItem[]>`
- **説明**: ドリンク組み合わせランキングを取得
- **戻り値**: `{ drink1: string, drink2: string, count: number, totalProfit: number }[]`

### 8.4. 型定義

```typescript
interface Post {
  id: string;
  drink_1_name: string;
  drink_2_name: string;
  photo_url?: string;
  profit: number;
  created_at: Date;
  updated_at: Date;
}

interface DrinkMaster {
  id: string;
  name: string;
  price: number;
  created_at: Date;
}

interface GachaConfig {
  id: string;
  gacha_price: number;
  updated_at: Date;
}

interface DrinkRankingItem {
  name: string;
  count: number;
  percentage: number;
}

interface CombinationRankingItem {
  drink1: string;
  drink2: string;
  count: number;
  totalProfit: number;
}
```