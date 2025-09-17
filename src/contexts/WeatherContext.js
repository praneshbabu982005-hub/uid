import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Free weather API - OpenWeatherMap (you'll need to get a free API key)
  const API_KEY = '38361f1f730df94b6db40ce38cd0e545'; // Replace with actual API key
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeather = async (city = 'Erode') => {
    setLoading(true);
    setError(null);
    
    try {
      // Use real OpenWeatherMap API
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeather = () => {
    setIsVisible(!isVisible);
    if (!weather && !isVisible) {
      fetchWeather();
    }
  };

  const closeWeather = () => {
    setIsVisible(false);
  };

  // Fetch weather on component mount
  useEffect(() => {
    // Uncomment this line if you want weather to load automatically
    // fetchWeather();
  }, []);

  const value = {
    weather,
    loading,
    error,
    isVisible,
    fetchWeather,
    toggleWeather,
    closeWeather
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
