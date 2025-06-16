// Backend uses Node.js, Express, and MongoDB.
// To run: 
// npm init -y
// npm install express mongoose cors bcryptjs jsonwebtoken
// node server.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'; 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
  createdBy: String,
});

const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGO_URI, options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// JWT authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Routes

// User registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Logged in', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get items for authenticated user
app.get('/items', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user.username });
    res.json({ items });
  } catch (err) {
    console.error('Fetch items error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new item
app.post('/items', authMiddleware, async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    if (!name || !quantity) {
      return res.status(400).json({ error: 'Name and quantity required' });
    }

    const item = new Item({
      name,
      quantity,
      description,
      createdBy: req.user.username,
    });
    await item.save();

    res.json({ item });
  } catch (err) {
    console.error('Add item error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});