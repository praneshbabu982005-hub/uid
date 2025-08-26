import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { FaUsers, FaBox, FaPlus, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

const Admin = () => {
  const { currentUser, getAllUsers } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, getCategories } = useProducts();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: ''
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const categories = getCategories();

  useEffect(() => {
    if (activeTab === 'users') {
      setUsersLoading(true);
      Promise.resolve(getAllUsers()).then(data => {
        setUsers(data || []);
      }).finally(() => setUsersLoading(false));
    }
  }, [activeTab, getAllUsers]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, newProduct);
      setEditingProduct(null);
    } else {
      addProduct(newProduct);
    }

    setProductForm({
      name: '',
      price: '',
      category: '',
      description: '',
      stock: '',
      image: ''
    });
    setShowAddProduct(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      image: product.image
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const Dashboard = () => (
    <div className="grid grid-4 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaUsers size={24} className="mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-green-500 text-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaBox size={24} className="mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaChartBar size={24} className="mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Categories</h3>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaBox size={24} className="mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Low Stock</h3>
            <p className="text-2xl font-bold">
              {products.filter(p => p.stock < 10).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="admin-section">
      <div className="flex items-center justify-between mb-4">
        <h3>Registered Users</h3>
        <span className="text-sm text-gray-600">{users.length} total</span>
      </div>
      {usersLoading ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-600">No users found.</div>
      ) : (
        <div className="user-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProductsTab = () => (
    <div className="admin-section">
      <div className="flex justify-between items-center mb-4">
        <h3>Product Management</h3>
        <button
          onClick={() => setShowAddProduct(true)}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>
      
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-category">
                {product.category} - ${product.price} - Stock: {product.stock}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="btn btn-secondary text-sm"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="btn btn-danger text-sm"
              >
                <FaTrash className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Products
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'products' && <ProductsTab />}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  required
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      price: '',
                      category: '',
                      description: '',
                      stock: '',
                      image: ''
                    });
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 