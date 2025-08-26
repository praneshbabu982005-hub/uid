import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (e) {
        const sampleProducts = [
          {
            id: 1,
            name: 'Pioneer DJ DDJ-400 Controller',
            price: 299.99,
            category: 'Controllers',
            description: 'Professional 2-channel DJ controller with Rekordbox integration',
            image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
            stock: 15
          },
          {
            id: 2,
            name: 'Technics SL-1200MK7 Turntable',
            price: 999.99,
            category: 'Turntables',
            description: 'Classic direct drive turntable with high-torque motor',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            stock: 8
          },
          {
            id: 3,
            name: 'Shure SM7B Microphone',
            price: 399.99,
            category: 'Microphones',
            description: 'Dynamic microphone with excellent sound quality for vocals',
            image: 'https://images.unsplash.com/photo-1589003077984-894e1322bea9?w=400&h=300&fit=crop',
            stock: 12
          }
        ];
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const normalizeIdEquals = (a, b) => String(a) === String(b);

  const getProductById = (id) => {
    return products.find(product => normalizeIdEquals(product.id, id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const addProduct = async (product) => {
    try {
      const { data } = await api.post('/products', product);
      setProducts(prev => [...prev, data]);
    } catch (e) {
      const newProduct = {
        ...product,
        id: products.length + 1
      };
      setProducts([...products, newProduct]);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const { data } = await api.put(`/products/${id}`, updatedProduct);
      setProducts(products.map(product => 
        normalizeIdEquals(product.id, id) ? { ...product, ...data } : product
      ));
    } catch (e) {
      setProducts(products.map(product => 
        normalizeIdEquals(product.id, id) ? { ...product, ...updatedProduct } : product
      ));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(product => !normalizeIdEquals(product.id, id)));
    } catch (e) {
      setProducts(products.filter(product => !normalizeIdEquals(product.id, id)));
    }
  };

  const getCategories = () => {
    return [...new Set(products.map(product => product.category))];
  };

  const value = {
    products,
    loading,
    getProductById,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 