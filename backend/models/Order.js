// import mongoose from 'mongoose';

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  address: { type: String, required: true }, // Added field
  items: [{ 
    productId: String, 
    name: String,
    quantity: Number, 
    price: Number 
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order',orderSchema);