// src/lib/models/Cart.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import dbConnect from "@/lib/mongodb";

// -----------------
// Cart Item
// -----------------
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  frame?: string;
  color?: string;
  style?: string;
  lensType?: string; // e.g. polarized, blue-light
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String },
    frame: { type: String },
    color: { type: String },
    style: { type: String },
    lensType: { type: String },
  },
  { _id: false }
);

// -----------------
// Cart Document
// -----------------
export interface CartDocument extends Document {
  userId?: string; // logged-in users
  sessionId?: string; // guest carts
  items: CartItem[];
  discountCode?: string;
  discountAmount?: number;
  taxRate?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  subtotal: number;
  total: number;
}

// -----------------
// Cart Schema
// -----------------
const CartSchema = new Schema<CartDocument>(
  {
    userId: { type: String, index: true },
    sessionId: { type: String, index: true }, // for guests
    items: { type: [CartItemSchema], default: [] },
    discountCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.1 }, // 10% default tax
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
  },
  { timestamps: true }
);

// -----------------
// Virtual fields
// -----------------
CartSchema.virtual("subtotal").get(function (this: CartDocument) {
  return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
});

CartSchema.virtual("total").get(function (this: CartDocument) {
  const subtotal = this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = this.discountAmount || 0;
  const taxed = (subtotal - discount) * (1 + (this.taxRate || 0));
  return Math.max(0, Math.round(taxed * 100) / 100); // round to cents
});

// -----------------
// Middleware
// -----------------
CartSchema.pre("save", function (next) {
  if (this.items.length === 0 && !this.isNew) {
    // Optional: auto-delete empty cart
    this.deleteOne().catch(console.error);
  }
  next();
});

// -----------------
// Model export
// -----------------
const Cart: Model<CartDocument> =
  mongoose.models.Cart || mongoose.model<CartDocument>("Cart", CartSchema);

export default Cart;
