# MongoDB CRUD Operations - Class Work Notes

## Table of Contents
1. [Introduction to MongoDB](#introduction-to-mongodb)
2. [MongoDB CRUD Operations](#mongodb-crud-operations)
3. [Mongoose ODM](#mongoose-odm)
4. [Practical Examples](#practical-examples)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

## Introduction to MongoDB

### What is MongoDB?
- **MongoDB** is a NoSQL document database
- Stores data in flexible, JSON-like documents called BSON (Binary JSON)
- Schema-less design allows for flexible data structures
- Horizontal scaling capabilities
- Rich query language with indexing support

### Key Features:
- **Document-based**: Data stored as documents (similar to JSON objects)
- **Flexible Schema**: No fixed structure required
- **High Performance**: Optimized for read/write operations
- **Scalability**: Easy horizontal scaling
- **Rich Queries**: Complex queries with aggregation pipeline

## MongoDB CRUD Operations

### CRUD Operations Overview
CRUD stands for:
- **C**reate - Insert new documents
- **R**ead - Query and retrieve documents
- **U**pdate - Modify existing documents
- **D**elete - Remove documents

### 1. CREATE Operations

#### Insert Single Document
```javascript
// Using insertOne()
const result = await collection.insertOne({
  name: "Laptop",
  category: "Electronics",
  price: 999.99,
  inStock: true
});
```

#### Insert Multiple Documents
```javascript
// Using insertMany()
const result = await collection.insertMany([
  { name: "Mouse", category: "Electronics", price: 25.99 },
  { name: "Keyboard", category: "Electronics", price: 75.99 }
]);
```

### 2. READ Operations

#### Find All Documents
```javascript
// Get all documents
const allDocs = await collection.find({}).toArray();
```

#### Find with Filter
```javascript
// Find documents matching criteria
const electronics = await collection.find({
  category: "Electronics"
}).toArray();
```

#### Find Single Document
```javascript
// Find one document
const laptop = await collection.findOne({
  name: "Laptop"
});
```

#### Advanced Queries
```javascript
// Complex queries with operators
const expensiveItems = await collection.find({
  price: { $gte: 100 },
  category: { $in: ["Electronics", "Computers"] }
}).sort({ price: -1 }).limit(10);
```

### 3. UPDATE Operations

#### Update Single Document
```javascript
// Update one document
const result = await collection.updateOne(
  { name: "Laptop" },
  { $set: { price: 899.99, updatedAt: new Date() } }
);
```

#### Update Multiple Documents
```javascript
// Update multiple documents
const result = await collection.updateMany(
  { category: "Electronics" },
  { $set: { lastUpdated: new Date() } }
);
```

#### Upsert Operation
```javascript
// Update or insert if not exists
const result = await collection.updateOne(
  { name: "New Product" },
  { 
    $set: { 
      name: "New Product",
      category: "Electronics",
      price: 199.99
    }
  },
  { upsert: true }
);
```

### 4. DELETE Operations

#### Delete Single Document
```javascript
// Delete one document
const result = await collection.deleteOne({
  name: "Old Product"
});
```

#### Delete Multiple Documents
```javascript
// Delete multiple documents
const result = await collection.deleteMany({
  category: "Discontinued"
});
```

## Mongoose ODM

### What is Mongoose?
- **Object Document Mapper (ODM)** for MongoDB and Node.js
- Provides schema-based solution for modeling application data
- Includes built-in type casting, validation, query building, and business logic hooks

### Schema Definition
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);
```

### CRUD Operations with Mongoose

#### CREATE
```javascript
// Create single document
const product = new Product({
  name: "Gaming Laptop",
  category: "Electronics",
  price: 1299.99,
  description: "High-performance gaming laptop",
  tags: ["gaming", "laptop", "high-performance"]
});

const savedProduct = await product.save();
```

#### READ
```javascript
// Find all products
const allProducts = await Product.find();

// Find with conditions
const electronics = await Product.find({ category: "Electronics" });

// Find single product
const product = await Product.findById(productId);

// Advanced query
const expensiveElectronics = await Product.find({
  category: "Electronics",
  price: { $gte: 500 }
}).sort({ price: -1 }).limit(10);
```

#### UPDATE
```javascript
// Update by ID
const updatedProduct = await Product.findByIdAndUpdate(
  productId,
  { price: 999.99, inStock: false },
  { new: true, runValidators: true }
);

// Update multiple documents
const result = await Product.updateMany(
  { category: "Electronics" },
  { $set: { lastUpdated: new Date() } }
);
```

#### DELETE
```javascript
// Delete by ID
const deletedProduct = await Product.findByIdAndDelete(productId);

// Delete multiple documents
const result = await Product.deleteMany({ inStock: false });
```

## Practical Examples

### Complete CRUD API Example

#### 1. Database Connection
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 2. Model Definition
```javascript
// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
      message: 'Category must be one of: Electronics, Clothing, Books, Home, Sports'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [String],
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
```

#### 3. Route Handlers
```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      inStock, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (category) query.category = category;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ 
      message: 'Product deleted successfully', 
      product 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET /api/products/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
```

## Error Handling

### Common MongoDB Errors

#### 1. Connection Errors
```javascript
// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

#### 2. Validation Errors
```javascript
// Handle validation errors
try {
  const product = new Product(invalidData);
  await product.save();
} catch (error) {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));
    return res.status(400).json({ errors });
  }
}
```

#### 3. Cast Errors
```javascript
// Handle invalid ObjectId
try {
  const product = await Product.findById(invalidId);
} catch (error) {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
}
```

## Best Practices

### 1. Schema Design
- Use appropriate data types
- Add validation rules
- Create indexes for frequently queried fields
- Use timestamps for audit trails

### 2. Query Optimization
- Use projection to limit returned fields
- Implement pagination for large datasets
- Use indexes effectively
- Avoid N+1 query problems

### 3. Error Handling
- Always wrap database operations in try-catch
- Provide meaningful error messages
- Log errors for debugging
- Handle different types of errors appropriately

### 4. Security
- Validate input data
- Use parameterized queries
- Implement proper authentication
- Sanitize user input

### 5. Performance
- Use connection pooling
- Implement caching where appropriate
- Monitor query performance
- Use aggregation pipeline for complex operations

## Summary

MongoDB CRUD operations are fundamental to building applications with MongoDB. Understanding how to:

1. **Create** documents with proper validation
2. **Read** data efficiently with queries and filtering
3. **Update** documents with atomic operations
4. **Delete** documents safely

Combined with Mongoose ODM, these operations provide a robust foundation for building scalable applications. Always remember to handle errors properly, optimize queries, and follow best practices for security and performance.
