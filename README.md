# Playwright MCP向けのサンプルアプリ

## ディレクトリ構造

- sample-todo-playwright：サンプルTODOアプリ＋Playwright
- sample-todo：sample-todoのアプリのみ（Playwright未導入）

## サンプルアプリ仕様

Next.js製のシンプルなTODOアプリです。

## 機能

- 1行で記述されるタスクの作成・編集・削除操作が可能
- ログイン機能
  - 新規登録機能はなし
  - ユーザ名 `test` / パスワード `mypassword` のユーザのみログイン可能
  - ログイン不可の場合はエラーメッセージを出力する
- ログアウト機能

## 技術仕様

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## 起動方法

```bash
cd sample-todo
npm run dev
```

## ライセンス

Public Domain