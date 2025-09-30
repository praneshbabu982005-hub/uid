import React, { useState } from 'react';
import { FaPlus, FaFilter, FaTrash } from 'react-icons/fa';
import { useTodos } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const {
    filteredTodos,
    stats,
    addTodo,
    setFilter,
    clearCompleted,
    filter
  } = useTodos();

  const [newTodo, setNewTodo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    if (stats.completed > 0) {
      if (window.confirm(`Are you sure you want to delete ${stats.completed} completed todo(s)?`)) {
        clearCompleted();
      }
    }
  };

  return (
    <div className="relative">
      {/* Todo Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span className="font-medium">Todo List</span>
        <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
          {stats.total}
        </span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Todo Panel */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">My Tasks</h3>
            
            {/* Add Todo Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add Todo"
              >
                <FaPlus size={14} />
              </button>
            </form>

            {/* Stats and Filters */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4 text-gray-600">
                <span>{stats.total} total</span>
                <span>{stats.active} active</span>
                <span>{stats.completed} done</span>
              </div>
              
              {stats.completed > 0 && (
                <button
                  onClick={handleClearCompleted}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                  title="Clear completed"
                >
                  <FaTrash size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaFilter size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {filter === 'all' && 'No tasks yet. Add one above!'}
                  {filter === 'active' && 'No active tasks.'}
                  {filter === 'completed' && 'No completed tasks.'}
                </p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </div>

          {/* Footer */}
          {stats.total > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                {stats.active} of {stats.total} tasks remaining
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
