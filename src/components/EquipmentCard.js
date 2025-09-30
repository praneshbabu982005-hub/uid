import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const EquipmentCard = ({ equipment, viewMode, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-yellow-100 text-yellow-800';
      case 'Refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <div className="flex items-center space-x-6">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-24 h-24 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop';
            }}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{equipment.name}</h3>
                <p className="text-gray-600 mb-2">{equipment.brand} {equipment.model}</p>
                <p className="text-gray-700 mb-3 line-clamp-2">{equipment.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(equipment.price)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(equipment.condition)}`}>
                    {equipment.condition}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(equipment.stock)}`}>
                    Stock: {equipment.stock}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {equipment.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(equipment)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(equipment._id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop';
          }}
        />
        {equipment.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(equipment.condition)}`}>
            {equipment.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{equipment.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{equipment.brand} {equipment.model}</p>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {equipment.category}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{equipment.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">{formatPrice(equipment.price)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(equipment.stock)}`}>
            Stock: {equipment.stock}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(equipment)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(equipment._id)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;

