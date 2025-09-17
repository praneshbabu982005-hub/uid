import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useDealer } from '../contexts/DealerContext';
import { FaUsers, FaBox, FaPlus, FaEdit, FaTrash, FaChartBar, FaHandshake, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const Admin = () => {
  const { currentUser, getAllUsers } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, getCategories } = useProducts();
  const { dealers, approveDealer, rejectDealer, getDealerStats } = useDealer();
  
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
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showDealerModal, setShowDealerModal] = useState(false);

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

  const handleApproveDealer = async (dealerId) => {
    if (window.confirm('Are you sure you want to approve this dealer?')) {
      await approveDealer(dealerId);
    }
  };

  const handleRejectDealer = async (dealerId) => {
    if (window.confirm('Are you sure you want to reject this dealer?')) {
      await rejectDealer(dealerId);
    }
  };

  const handleViewDealer = (dealer) => {
    setSelectedDealer(dealer);
    setShowDealerModal(true);
  };

  const Dashboard = () => {
    const dealerStats = getDealerStats();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <FaHandshake size={24} className="mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Total Dealers</h3>
              <p className="text-2xl font-bold">{dealerStats.total}</p>
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
        
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaHandshake size={24} className="mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Pending Dealers</h3>
              <p className="text-2xl font-bold">{dealerStats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-500 text-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaCheck size={24} className="mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Approved Dealers</h3>
              <p className="text-2xl font-bold">{dealerStats.approved}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const DealersTab = () => (
    <div className="admin-section">
      <div className="flex items-center justify-between mb-4">
        <h3>Dealer Applications</h3>
        <span className="text-sm text-gray-600">{dealers.length} total</span>
      </div>
      
      {dealers.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          <FaHandshake size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No dealer applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dealers.map(dealer => (
            <div key={dealer.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {dealer.firstName} {dealer.lastName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dealer.status === 'approved' ? 'bg-green-100 text-green-800' :
                      dealer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {dealer.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Business:</strong> {dealer.businessName}</p>
                      <p><strong>Email:</strong> {dealer.email}</p>
                      <p><strong>Phone:</strong> {dealer.phone}</p>
                    </div>
                    <div>
                      <p><strong>Location:</strong> {dealer.city}, {dealer.district}, {dealer.state}</p>
                      <p><strong>Business Type:</strong> {dealer.businessType || 'Not specified'}</p>
                      <p><strong>Registered:</strong> {new Date(dealer.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleViewDealer(dealer)}
                    className="btn btn-secondary text-sm flex items-center"
                  >
                    <FaEye className="mr-1" />
                    View Details
                  </button>
                  
                  {dealer.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveDealer(dealer.id)}
                        className="btn bg-green-600 text-white text-sm flex items-center hover:bg-green-700"
                      >
                        <FaCheck className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDealer(dealer.id)}
                        className="btn bg-red-600 text-white text-sm flex items-center hover:bg-red-700"
                      >
                        <FaTimes className="mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
        <button
          onClick={() => setActiveTab('dealers')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'dealers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Dealers
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'dealers' && <DealersTab />}

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

      {/* Dealer Details Modal */}
      {showDealerModal && selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Dealer Details - {selectedDealer.firstName} {selectedDealer.lastName}
              </h2>
              <button
                onClick={() => {
                  setShowDealerModal(false);
                  setSelectedDealer(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedDealer.firstName} {selectedDealer.lastName}</p>
                  <p><strong>Email:</strong> {selectedDealer.email}</p>
                  <p><strong>Phone:</strong> {selectedDealer.phone}</p>
                  {selectedDealer.alternatePhone && (
                    <p><strong>Alternate Phone:</strong> {selectedDealer.alternatePhone}</p>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Business Name:</strong> {selectedDealer.businessName}</p>
                  <p><strong>Business Type:</strong> {selectedDealer.businessType || 'Not specified'}</p>
                  {selectedDealer.businessRegistrationNumber && (
                    <p><strong>Registration Number:</strong> {selectedDealer.businessRegistrationNumber}</p>
                  )}
                  {selectedDealer.gstNumber && (
                    <p><strong>GST Number:</strong> {selectedDealer.gstNumber}</p>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {selectedDealer.address}</p>
                  <p><strong>City:</strong> {selectedDealer.city}</p>
                  <p><strong>District:</strong> {selectedDealer.district}</p>
                  <p><strong>State:</strong> {selectedDealer.state}</p>
                  <p><strong>Pincode:</strong> {selectedDealer.pincode}</p>
                  {selectedDealer.landmark && (
                    <p><strong>Landmark:</strong> {selectedDealer.landmark}</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Experience:</strong> {selectedDealer.experience || 'Not specified'}</p>
                  <p><strong>Specialization:</strong> {selectedDealer.specialization || 'Not specified'}</p>
                  {selectedDealer.website && (
                    <p><strong>Website:</strong> <a href={selectedDealer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedDealer.website}</a></p>
                  )}
                  {selectedDealer.socialMedia && (
                    <p><strong>Social Media:</strong> {selectedDealer.socialMedia}</p>
                  )}
                  <p><strong>Registration Date:</strong> {new Date(selectedDealer.registrationDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDealer.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedDealer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedDealer.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedDealer.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Additional Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedDealer.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedDealer.status === 'pending' && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    handleRejectDealer(selectedDealer.id);
                    setShowDealerModal(false);
                    setSelectedDealer(null);
                  }}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  <FaTimes className="mr-2" />
                  Reject Application
                </button>
                <button
                  onClick={() => {
                    handleApproveDealer(selectedDealer.id);
                    setShowDealerModal(false);
                    setSelectedDealer(null);
                  }}
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  <FaCheck className="mr-2" />
                  Approve Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 