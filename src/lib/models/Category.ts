import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: "text", description: "text" });

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
