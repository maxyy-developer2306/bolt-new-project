import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { auth, generateToken } from '../middleware/auth.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      location: location || '',
      role: 'user',
    });

    const userObj = user.toObject();
    delete userObj.password;

    const token = generateToken(user);
    res.status(201).json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    const token = generateToken(user);
    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, description, profileImage } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (description !== undefined) user.description = description;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    const updated = user.toObject();
    delete updated.password;
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

export default router;
