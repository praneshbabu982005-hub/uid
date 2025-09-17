import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DealerContext = createContext();

// Initial state
const initialState = {
  dealers: [],
  currentDealer: null,
  loading: false,
  error: null,
  registrationStatus: null
};

// Action types
const DEALER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DEALERS: 'SET_DEALERS',
  ADD_DEALER: 'ADD_DEALER',
  UPDATE_DEALER: 'UPDATE_DEALER',
  DELETE_DEALER: 'DELETE_DEALER',
  SET_CURRENT_DEALER: 'SET_CURRENT_DEALER',
  SET_REGISTRATION_STATUS: 'SET_REGISTRATION_STATUS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_REGISTRATION_STATUS: 'CLEAR_REGISTRATION_STATUS'
};

// Reducer function
const dealerReducer = (state, action) => {
  switch (action.type) {
    case DEALER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case DEALER_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case DEALER_ACTIONS.SET_DEALERS:
      return {
        ...state,
        loading: false,
        dealers: action.payload,
        error: null
      };

    case DEALER_ACTIONS.ADD_DEALER:
      return {
        ...state,
        loading: false,
        dealers: [...state.dealers, action.payload],
        error: null,
        registrationStatus: 'success'
      };

    case DEALER_ACTIONS.UPDATE_DEALER:
      return {
        ...state,
        loading: false,
        dealers: state.dealers.map(dealer =>
          dealer.id === action.payload.id ? action.payload : dealer
        ),
        error: null
      };

    case DEALER_ACTIONS.DELETE_DEALER:
      return {
        ...state,
        loading: false,
        dealers: state.dealers.filter(dealer => dealer.id !== action.payload),
        error: null
      };

    case DEALER_ACTIONS.SET_CURRENT_DEALER:
      return {
        ...state,
        currentDealer: action.payload
      };

    case DEALER_ACTIONS.SET_REGISTRATION_STATUS:
      return {
        ...state,
        registrationStatus: action.payload
      };

    case DEALER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case DEALER_ACTIONS.CLEAR_REGISTRATION_STATUS:
      return {
        ...state,
        registrationStatus: null
      };

    default:
      return state;
  }
};

// Provider component
export const DealerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dealerReducer, initialState);

  // Load dealers from localStorage on component mount
  useEffect(() => {
    const savedDealers = localStorage.getItem('dealers');
    if (savedDealers) {
      try {
        const dealers = JSON.parse(savedDealers);
        dispatch({ type: DEALER_ACTIONS.SET_DEALERS, payload: dealers });
      } catch (error) {
        console.error('Error loading dealers from localStorage:', error);
      }
    }
  }, []);

  // Save dealers to localStorage whenever dealers state changes
  useEffect(() => {
    if (state.dealers.length > 0) {
      localStorage.setItem('dealers', JSON.stringify(state.dealers));
    }
  }, [state.dealers]);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: DEALER_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: DEALER_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: DEALER_ACTIONS.CLEAR_ERROR });
  };

  const setRegistrationStatus = (status) => {
    dispatch({ type: DEALER_ACTIONS.SET_REGISTRATION_STATUS, payload: status });
  };

  const clearRegistrationStatus = () => {
    dispatch({ type: DEALER_ACTIONS.CLEAR_REGISTRATION_STATUS });
  };

  // Register a new dealer
  const registerDealer = async (dealerData) => {
    try {
      setLoading(true);
      clearError();

      // Generate unique ID
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Create dealer object with additional metadata
      const newDealer = {
        id,
        ...dealerData,
        registrationDate: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        isActive: false
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: DEALER_ACTIONS.ADD_DEALER, payload: newDealer });
      
      return { success: true, dealer: newDealer };
    } catch (error) {
      setError(error.message || 'Failed to register dealer');
      return { success: false, error: error.message };
    }
  };

  // Get all dealers
  const getDealers = () => {
    return state.dealers;
  };

  // Get dealer by ID
  const getDealerById = (id) => {
    return state.dealers.find(dealer => dealer.id === id);
  };

  // Update dealer
  const updateDealer = async (id, updateData) => {
    try {
      setLoading(true);
      clearError();

      const existingDealer = getDealerById(id);
      if (!existingDealer) {
        throw new Error('Dealer not found');
      }

      const updatedDealer = {
        ...existingDealer,
        ...updateData,
        lastUpdated: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: DEALER_ACTIONS.UPDATE_DEALER, payload: updatedDealer });
      
      return { success: true, dealer: updatedDealer };
    } catch (error) {
      setError(error.message || 'Failed to update dealer');
      return { success: false, error: error.message };
    }
  };

  // Delete dealer
  const deleteDealer = async (id) => {
    try {
      setLoading(true);
      clearError();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: DEALER_ACTIONS.DELETE_DEALER, payload: id });
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to delete dealer');
      return { success: false, error: error.message };
    }
  };

  // Approve dealer
  const approveDealer = async (id) => {
    return updateDealer(id, { 
      status: 'approved', 
      isActive: true,
      approvedDate: new Date().toISOString()
    });
  };

  // Reject dealer
  const rejectDealer = async (id) => {
    return updateDealer(id, { 
      status: 'rejected',
      rejectedDate: new Date().toISOString()
    });
  };

  // Get dealers by status
  const getDealersByStatus = (status) => {
    return state.dealers.filter(dealer => dealer.status === status);
  };

  // Get dealers by district
  const getDealersByDistrict = (district) => {
    return state.dealers.filter(dealer => 
      dealer.district.toLowerCase().includes(district.toLowerCase())
    );
  };

  // Get dealers by business type
  const getDealersByBusinessType = (businessType) => {
    return state.dealers.filter(dealer => dealer.businessType === businessType);
  };

  // Search dealers
  const searchDealers = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return state.dealers.filter(dealer =>
      dealer.firstName.toLowerCase().includes(lowercaseQuery) ||
      dealer.lastName.toLowerCase().includes(lowercaseQuery) ||
      dealer.businessName.toLowerCase().includes(lowercaseQuery) ||
      dealer.district.toLowerCase().includes(lowercaseQuery) ||
      dealer.city.toLowerCase().includes(lowercaseQuery) ||
      dealer.specialization?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Get dealer statistics
  const getDealerStats = () => {
    const total = state.dealers.length;
    const pending = getDealersByStatus('pending').length;
    const approved = getDealersByStatus('approved').length;
    const rejected = getDealersByStatus('rejected').length;
    const active = state.dealers.filter(dealer => dealer.isActive).length;

    return {
      total,
      pending,
      approved,
      rejected,
      active
    };
  };

  const value = {
    // State
    dealers: state.dealers,
    currentDealer: state.currentDealer,
    loading: state.loading,
    error: state.error,
    registrationStatus: state.registrationStatus,

    // Actions
    registerDealer,
    getDealers,
    getDealerById,
    updateDealer,
    deleteDealer,
    approveDealer,
    rejectDealer,
    getDealersByStatus,
    getDealersByDistrict,
    getDealersByBusinessType,
    searchDealers,
    getDealerStats,
    setCurrentDealer: (dealer) => dispatch({ type: DEALER_ACTIONS.SET_CURRENT_DEALER, payload: dealer }),
    clearError,
    setRegistrationStatus,
    clearRegistrationStatus
  };

  return (
    <DealerContext.Provider value={value}>
      {children}
    </DealerContext.Provider>
  );
};

// Custom hook to use dealer context
export const useDealer = () => {
  const context = useContext(DealerContext);
  if (!context) {
    throw new Error('useDealer must be used within a DealerProvider');
  }
  return context;
};

export default DealerContext;
