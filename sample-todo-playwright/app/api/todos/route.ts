import { NextRequest, NextResponse } from 'next/server';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const todos: Todo[] = [];
let nextId = 1;

function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth-token');
  return authToken?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ todos });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'テキストは必須です' },
        { status: 400 }
      );
    }

    const newTodo: Todo = {
      id: nextId.toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };

    nextId++;
    todos.push(newTodo);

    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'TODOの作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, text, completed } = await request.json();

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'TODOが見つかりません' },
        { status: 404 }
      );
    }

    if (text !== undefined) {
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { error: 'テキストは必須です' },
          { status: 400 }
        );
      }
      todos[todoIndex].text = text.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = completed;
    }

    return NextResponse.json({ todo: todos[todoIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'TODOの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'TODOのIDが必要です' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'TODOが見つかりません' },
        { status: 404 }
      );
    }

    todos.splice(todoIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'TODOの削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}