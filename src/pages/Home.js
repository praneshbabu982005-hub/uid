import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { FaHeadphones, FaMicrophone, FaMusic } from 'react-icons/fa';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 6);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to DJ Departmental Store</h1>
          <p>Your one-stop shop for professional DJ equipment and accessories</p>
          <div className="flex justify-center space-x-4">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Join Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-3">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadphones size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Equipment</h3>
              <p className="text-gray-600">Top-quality DJ gear from leading brands</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMicrophone size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">24/7 customer support and technical assistance</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMusic size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure shipping worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800">
              View All Products →
            </Link>
          </div>
          <div className="grid grid-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-4">
            {['Controllers', 'Turntables', 'Mixers', 'Speakers', 'Microphones', 'Headphones', 'Drum Machines'].map(category => (
              <Link 
                key={category} 
                to={`/products?category=${category}`}
                className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{category}</h3>
                <p className="text-gray-600 text-sm">Browse {category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 