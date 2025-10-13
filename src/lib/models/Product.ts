import mongoose, { Schema, models, model } from "mongoose";

export interface IProduct {
  name: string;
  title?: string;
  price: number;
  sku?: string;
  frame?: string;
  image?: string | null;
  overlayImage?: string | null;
  description?: string;
  category?: string;
  style?: string;
  color?: string;
  stock?: number;
  isActive?: boolean;
  images?: string[];
  featured?: boolean;
  discount?: number;
  ratings?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  virtualTryOn?: boolean;
  slug?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, index: true, unique: false, sparse: true },
    frame: { type: String },
    image: { type: String },
    overlayImage: { type: String },
    description: { type: String },
    category: { type: String, index: true },
    style: { type: String, index: true },
    color: { type: String, index: true },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    discount: { type: Number, min: 0, max: 100 },
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    virtualTryOn: { type: Boolean, default: false },
    slug: { 
      type: String, 
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

ProductSchema.index({ name: "text", description: "text" });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
