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
  stock?: number;
  isActive?: boolean;
  images?: string[];
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
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

const Product = (models.Product as mongoose.Model<IProduct>) || model<IProduct>("Product", ProductSchema);

export default Product;
