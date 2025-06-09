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

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("🔥 Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

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

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
}));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  res.json({ status: 'ok' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  req.session.user = { username: user.username };
  res.json({ message: 'Logged in', user: req.session.user });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.post('/items', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  const { name, quantity, description } = req.body;
  const item = await Item.create({ name, quantity, description, createdBy: req.session.user.username });
  res.json({ item });
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json({ items });
});

app.get('/', (req, res) => {
  res.send('Hello World! 🌍✨');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

