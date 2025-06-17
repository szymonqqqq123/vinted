const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/socialmanager');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  platform: String,
  content: String,
  scheduledFor: Date,
});
const Post = mongoose.model('Post', PostSchema);

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hash, name });
    res.json({ id: user._id });
  } catch (e) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

app.get('/api/posts', authMiddleware, async (req, res) => {
  const posts = await Post.find({ userId: req.user.id });
  res.json(posts);
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  const { platform, content, scheduledFor } = req.body;
  const post = await Post.create({ userId: req.user.id, platform, content, scheduledFor });
  res.json(post);
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  await Post.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Deleted' });
});

app.get('/api/stats', authMiddleware, async (req, res) => {
  // Placeholder stats
  res.json({ posts: await Post.countDocuments({ userId: req.user.id }) });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
