import { NextRequest, NextResponse } from 'next/server';

const VALID_USERNAME = 'test';
const VALID_PASSWORD = 'mypassword';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const response = NextResponse.json({ success: true });

      response.cookies.set('auth-token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'ユーザー名またはパスワードが正しくありません' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}