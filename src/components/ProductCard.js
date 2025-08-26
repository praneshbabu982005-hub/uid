import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaEye } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart, getCartItem } = useCart();
  const cartItem = getCartItem(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Stock: {product.stock}
          </span>
          <div className="flex space-x-2">
            <Link 
              to={`/products/${product.id}`}
              className="btn btn-secondary"
            >
              <FaEye size={14} />
              <span className="ml-1">View</span>
            </Link>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={product.stock === 0}
            >
              <FaShoppingCart size={14} />
              <span className="ml-1">
                {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 