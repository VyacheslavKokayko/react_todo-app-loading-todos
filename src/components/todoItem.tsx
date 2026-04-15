/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: () => void;
  isProcessed?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed = false,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${
        isProcessed ? 'is-loading' : ''
      }`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={todo.completed}
          readOnly
          data-cy="TodoStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
      )}

      <div
        className={`loader ${isProcessed ? 'is-active' : ''}`}
        data-cy="TodoLoader"
      />
    </div>
  );
};
