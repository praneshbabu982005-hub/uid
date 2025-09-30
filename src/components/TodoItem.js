import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useTodos } from '../contexts/TodoContext';

const TodoItem = ({ todo }) => {
  const { toggleTodo, deleteTodo, editTodo, editingId, setEditingId } = useTodos();
  const [editText, setEditText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setIsEditing(editingId === todo.id);
  }, [editingId, todo.id]);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      editTodo(todo.id, editText);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditingId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
      todo.completed ? 'bg-gray-50' : 'bg-white'
    }`}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && <FaCheck size={10} />}
      </button>

      {/* Todo Content */}
      <div className="flex-1 mx-3">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span
            className={`block ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
              title="Save"
            >
              <FaCheck size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
              title="Cancel"
            >
              <FaTimes size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
              title="Delete"
            >
              <FaTrash size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
