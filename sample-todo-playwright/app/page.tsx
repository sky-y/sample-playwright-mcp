'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      }
    } catch (error) {
      console.error('TODOの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data.todo]);
        setNewTodoText('');
      }
    } catch (error) {
      console.error('TODOの追加に失敗しました:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('TODOの削除に失敗しました:', error);
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditSave = async (id: string) => {
    if (!editingText.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, text: editingText }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? data.todo : todo)));
        setEditingId(null);
        setEditingText('');
      }
    } catch (error) {
      console.error('TODOの更新に失敗しました:', error);
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? data.todo : todo)));
      }
    } catch (error) {
      console.error('TODOの更新に失敗しました:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">TODOアプリ</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleAddTodo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="新しいタスクを入力してください"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  追加
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {todos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  タスクがありません。新しいタスクを追加してください。
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) =>
                        handleToggleCompleted(todo.id, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />

                    {editingId === todo.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditSave(todo.id);
                            } else if (e.key === 'Escape') {
                              handleEditCancel();
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(todo.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 ${
                            todo.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => handleEditStart(todo)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}