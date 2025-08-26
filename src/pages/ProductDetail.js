import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaArrowLeft, FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { addToCart, getCartItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const product = getProductById(id);
  const cartItem = getCartItem(product?.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSuccessMessage('Product added to cart successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Products
      </Link>

      {successMessage && (
        <div className="success mb-6">
          {successMessage}
        </div>
      )}

      <div className="grid grid-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={16} />
              ))}
            </div>
            <span className="ml-2 text-gray-600">(4.8/5)</span>
          </div>

          <p className="text-3xl font-bold text-blue-600 mb-4">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <span className="font-semibold w-24">Category:</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold w-24">Stock:</span>
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-24">SKU:</span>
              <span className="text-gray-600">DJ-{product.id.toString().padStart(3, '0')}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-none focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn btn-primary flex items-center justify-center"
                disabled={cartItem && cartItem.quantity >= product.stock}
              >
                <FaShoppingCart className="mr-2" />
                {cartItem ? `Update Cart (${cartItem.quantity})` : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-600 font-semibold mb-2">This product is currently out of stock</p>
              <button className="btn btn-secondary" disabled>
                Out of Stock
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Features */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Product Features</h2>
        <div className="grid grid-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Professional grade quality</li>
              <li>• Durable construction</li>
              <li>• Easy to use interface</li>
              <li>• Compatible with major DJ software</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Brand: {product.category}</li>
              <li>• Weight: Varies by model</li>
              <li>• Warranty: 1 year</li>
              <li>• Support: 24/7 technical support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 