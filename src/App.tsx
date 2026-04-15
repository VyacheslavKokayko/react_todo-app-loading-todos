import React, { useEffect, useMemo, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { TodoItem } from './components/todoItem';
import { TodoFilter } from './components/todoFilter';
import { ErrorMessage } from './components/erorrMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    setTimeout(() => {
      const createdTodo = {
        ...newTodo,
        id: Date.now(),
      };

      setTodos(prev => [...prev, createdTodo]);
      setTempTodo(null);
      setTitle('');
    }, 500);
  };

  const deleteTodo = (id: number) => {
    setProcessings(prev => [...prev, id]);

    setTimeout(() => {
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setProcessings(prev => prev.filter(p => p !== id));
    }, 500);
  };

  const clearCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => deleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  isProcessed={processings.includes(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={tempTodo} isProcessed />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            todos={todos}
            activeTodosCount={activeTodosCount}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
