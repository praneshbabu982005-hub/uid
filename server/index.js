const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(cors());
app.use(express.json());

// In-memory data (replace with DB in production)
const users = [
  { id: '1', name: 'Admin User', email: 'praneshbabutj.23it@kongu.edu', passwordHash: bcrypt.hashSync('123456', 10), role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', passwordHash: bcrypt.hashSync('password123', 10), role: 'user' }
];

const products = [
  { id: 'p1', name: 'Pioneer DJ DDJ-400 Controller', price: 299.99, category: 'Controllers', description: 'Professional 2-channel DJ controller with Rekordbox integration', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop', stock: 15 },
  { id: 'p2', name: 'Technics SL-1200MK7 Turntable', price: 999.99, category: 'Turntables', description: 'Classic direct drive turntable with high-torque motor', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', stock: 8 },
  { id: 'p3', name: 'Shure SM7B Microphone', price: 399.99, category: 'Microphones', description: 'Dynamic microphone with excellent sound quality for vocals', image: 'https://images.unsplash.com/photo-1589003077984-894e1322bea9?w=400&h=300&fit=crop', stock: 12 }
];

const orders = [];

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// Auth
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'User already exists' });
  const user = { id: uuidv4(), name, email, role: 'user', passwordHash: bcrypt.hashSync(password, 10) };
  users.push(user);
  const token = createToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password || '', user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = createToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Profile
app.get('/api/me', authMiddleware, (req, res) => {
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...data } = me;
  res.json(data);
});

app.put('/api/me', authMiddleware, (req, res) => {
  const meIndex = users.findIndex(u => u.id === req.user.id);
  if (meIndex === -1) return res.status(404).json({ error: 'Not found' });
  const { name, email, password } = req.body || {};
  if (email) {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== req.user.id);
    if (exists) return res.status(409).json({ error: 'Email already in use' });
  }
  if (name) users[meIndex].name = name;
  if (email) users[meIndex].email = email;
  if (password) users[meIndex].passwordHash = bcrypt.hashSync(password, 10);
  const updated = users[meIndex];
  const token = createToken(updated);
  const { passwordHash, ...data } = updated;
  res.json({ user: data, token });
});

app.get('/api/users', authMiddleware, adminOnly, (req, res) => {
  res.json(users.map(({ passwordHash, ...u }) => u));
});

// Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find(pr => pr.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/api/products', authMiddleware, adminOnly, (req, res) => {
  const { name, price, category, description, image, stock } = req.body || {};
  if (!name || price == null) return res.status(400).json({ error: 'Missing name/price' });
  const product = { id: uuidv4(), name, price: Number(price), category, description, image, stock: Number(stock || 0) };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = { ...products[idx], ...req.body, price: Number(req.body.price ?? products[idx].price), stock: Number(req.body.stock ?? products[idx].stock) };
  res.json(products[idx]);
});

app.delete('/api/products/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [deleted] = products.splice(idx, 1);
  res.json(deleted);
});

// Orders
app.post('/api/orders', authMiddleware, (req, res) => {
  const { items, total } = req.body || {};
  if (!Array.isArray(items) || typeof total !== 'number') return res.status(400).json({ error: 'Invalid order' });
  const order = { id: uuidv4(), userId: req.user.id, items, total, createdAt: new Date().toISOString() };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', authMiddleware, adminOnly, (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});