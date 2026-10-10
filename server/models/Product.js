import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Solar Panels', 'Inverters', 'Batteries', 'Charge Controllers', 'Accessories', 'Other'],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    wattage: { type: Number, default: null },
    condition: { type: String, enum: ['new', 'used'], default: 'new' },
    quantity: { type: Number, default: 1, min: 0 },
    images: [{ type: String }],
    location: { type: String, default: '' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', brand: 'text', model: 'text' });

export default mongoose.model('Product', productSchema);
