import express from 'express';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: 'approved' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Failed to fetch your products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email phone');
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch {
    res.status(404).json({ message: 'Product not found.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const {
      title, category, price, description, brand, model,
      wattage, condition, quantity, images, location,
    } = req.body;

    if (!title || !category || price == null) {
      return res.status(400).json({ message: 'Title, category, and price are required.' });
    }

    const product = await Product.create({
      title,
      category,
      price,
      description: description || '',
      brand: brand || '',
      model: model || '',
      wattage: wattage || null,
      condition: condition || 'new',
      quantity: quantity || 1,
      images: images || [],
      location: location || '',
      seller: req.userId,
      status: 'pending',
    });

    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own products.' });
    }

    const {
      title, category, price, description, brand, model,
      wattage, condition, quantity, images, location,
    } = req.body;

    if (title !== undefined) product.title = title;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (model !== undefined) product.model = model;
    if (wattage !== undefined) product.wattage = wattage;
    if (condition !== undefined) product.condition = condition;
    if (quantity !== undefined) product.quantity = quantity;
    if (images !== undefined) product.images = images;
    if (location !== undefined) product.location = location;

    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.seller.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own products.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

export default router;
