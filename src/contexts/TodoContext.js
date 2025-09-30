import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  editingId: null
};

// Action types
const TODO_ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  SET_FILTER: 'SET_FILTER',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  SET_EDITING_ID: 'SET_EDITING_ID',
  LOAD_TODOS: 'LOAD_TODOS'
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case TODO_ACTIONS.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now().toString(),
          text: action.payload.text,
          completed: false,
          createdAt: new Date().toISOString()
        }]
      };

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case TODO_ACTIONS.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
        editingId: null
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    case TODO_ACTIONS.SET_EDITING_ID:
      return {
        ...state,
        editingId: action.payload.id
      };

    case TODO_ACTIONS.LOAD_TODOS:
      return {
        ...state,
        todos: action.payload.todos
      };

    default:
      return state;
  }
};

// Create context
const TodoContext = createContext();

// Custom hook to use todo context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      dispatch({
        type: TODO_ACTIONS.LOAD_TODOS,
        payload: { todos: JSON.parse(savedTodos) }
      });
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  // Action creators
  const addTodo = (text) => {
    if (text.trim()) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO,
        payload: { text: text.trim() }
      });
    }
  };

  const toggleTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.TOGGLE_TODO,
      payload: { id }
    });
  };

  const deleteTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO,
      payload: { id }
    });
  };

  const editTodo = (id, text) => {
    if (text.trim()) {
      dispatch({
        type: TODO_ACTIONS.EDIT_TODO,
        payload: { id, text: text.trim() }
      });
    }
  };

  const setFilter = (filter) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filter }
    });
  };

  const clearCompleted = () => {
    dispatch({
      type: TODO_ACTIONS.CLEAR_COMPLETED
    });
  };

  const setEditingId = (id) => {
    dispatch({
      type: TODO_ACTIONS.SET_EDITING_ID,
      payload: { id }
    });
  };

  // Filter todos based on current filter
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Calculate stats
  const stats = {
    total: state.todos.length,
    active: state.todos.filter(todo => !todo.completed).length,
    completed: state.todos.filter(todo => todo.completed).length
  };

  const value = {
    ...state,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
    setEditingId
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
