import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { DealerProvider } from './contexts/DealerContext';
import Navbar from './components/Navbar';
import Weather from './components/Weather';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import DealerRegistration from './pages/DealerRegistration';
import Calculator from './pages/Calculator';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WeatherProvider>
            <DealerProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Weather />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dealer-registration" element={<DealerRegistration />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </Router>
            </DealerProvider>
          </WeatherProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App; 