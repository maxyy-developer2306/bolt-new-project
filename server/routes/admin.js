import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const users = await User.countDocuments({ role: 'user' });
    const products = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const activeSellers = await Product.distinct('seller').then((s) => s.length);

    res.json({ users, products, pendingProducts, activeSellers });
  } catch {
    res.status(500).json({ message: 'Failed to fetch statistics.' });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot suspend an admin account.' });
    }
    user.status = 'suspended';
    await user.save();
    res.json({ message: 'User suspended.', user: { ...user.toObject(), password: undefined } });
  } catch {
    res.status(500).json({ message: 'Failed to suspend user.' });
  }
});

router.put('/users/:id/reactivate', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.status = 'active';
    await user.save();
    res.json({ message: 'User reactivated.', user: { ...user.toObject(), password: undefined } });
  } catch {
    res.status(500).json({ message: 'Failed to reactivate user.' });
  }
});

router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

router.put('/products/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    product.status = status;
    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Failed to update product status.' });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed.' });
  } catch {
    res.status(500).json({ message: 'Failed to remove product.' });
  }
});

export default router;
