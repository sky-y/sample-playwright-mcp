import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

test.describe('認証・TODOアプリ E2Eテスト', () => {
  test('ログイン成功: ユーザ名 test / パスワード mypassword', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('test');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('mypassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByRole('heading', { name: 'TODOアプリ' })).toBeVisible();
  });

  test('ログイン失敗: パスワード誤り', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('test');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('bar');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByText('ユーザー名またはパスワードが正しくありません')).toBeVisible();
  });

  test('ログイン失敗: ユーザ名誤り', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('foo');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('mypassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByText('ユーザー名またはパスワードが正しくありません')).toBeVisible();
  });

  test('ログアウト', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('test');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('mypassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
  });

  test('タスク作成・編集・完了・未完了戻し・削除', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('test');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('mypassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    // タスク作成
    await page.getByRole('textbox', { name: '新しいタスクを入力してください' }).fill('テストタスク1');
    await page.getByRole('button', { name: '追加' }).click();
    await expect(page.getByText('テストタスク1')).toBeVisible();
    // タスク編集
    await page.getByRole('button', { name: '編集' }).click();
    await page.getByRole('textbox').nth(1).fill('テストタスク1（編集済み）');
    await page.getByRole('button', { name: '保存' }).click();
    await expect(page.getByText('テストタスク1（編集済み）')).toBeVisible();
    // 完了
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('checkbox')).toBeChecked();
    // 未完了に戻す
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    // 削除
    await page.getByRole('button', { name: '削除' }).click();
    await expect(page.getByText('タスクがありません。新しいタスクを追加してください。')).toBeVisible();
  });

  test('新規登録ボタンの表示', async ({ page }) => {
  await page.goto(`${baseUrl}/login`);
  // 新規登録ボタンが存在することを確認（現状未実装なので必ず失敗する）
  const registerBtn = await page.getByRole('button', { name: '新規登録' }).isVisible().catch(() => false);
  expect(registerBtn).toBeTruthy();
  });
});
