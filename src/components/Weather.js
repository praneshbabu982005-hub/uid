import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { FaCloud, FaSun, FaCloudRain, FaSnowflake, FaWind, FaTint, FaEye, FaTimes } from 'react-icons/fa';

const Weather = () => {
  const { weather, loading, error, isVisible, closeWeather } = useWeather();

  if (!isVisible) return null;

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return <FaSun className="text-yellow-500" size={40} />;
      case 'Clouds':
        return <FaCloud className="text-gray-500" size={40} />;
      case 'Rain':
      case 'Drizzle':
        return <FaCloudRain className="text-blue-500" size={40} />;
      case 'Snow':
        return <FaSnowflake className="text-blue-200" size={40} />;
      case 'Thunderstorm':
        return <FaCloudRain className="text-purple-500" size={40} />;
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <FaCloud className="text-gray-400" size={40} />;
      default:
        return <FaCloud className="text-gray-500" size={40} />;
    }
  };

  const formatTemperature = (temp) => {
    return Math.round(temp); // Temperature is already in Celsius from API
  };

  return (
    <div className="fixed left-4 top-20 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Today's Weather</h3>
        <button
          onClick={closeWeather}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading weather...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {weather && !loading && (
        <div className="space-y-4">
          {/* Main weather info */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-1">
              {formatTemperature(weather.main.temp)}°C
            </h4>
            <p className="text-gray-600 capitalize">
              {weather.weather[0].description}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {weather.name}
            </p>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <FaTint className="text-blue-500 mr-2" size={14} />
                <span className="text-gray-600">Humidity</span>
              </div>
              <p className="font-semibold text-gray-800">
                {weather.main.humidity}%
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <FaWind className="text-gray-500 mr-2" size={14} />
                <span className="text-gray-600">Wind</span>
              </div>
              <p className="font-semibold text-gray-800">
                {weather.wind.speed} m/s
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <FaEye className="text-gray-500 mr-2" size={14} />
                <span className="text-gray-600">Feels like</span>
              </div>
              <p className="font-semibold text-gray-800">
                {formatTemperature(weather.main.feels_like)}°C
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <FaCloud className="text-gray-500 mr-2" size={14} />
                <span className="text-gray-600">Condition</span>
              </div>
              <p className="font-semibold text-gray-800 capitalize">
                {weather.weather[0].main}
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
