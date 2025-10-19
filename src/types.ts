export type ProductAttribute = {
  name: string; // e.g., "Color", "Size", "Material"
  value: string; // e.g., "Red", "Large", "Acetate"
};

export type ProductVariation = {
  _id?: string;
  id?: string;
  sku?: string; // Unique identifier for this variation
  price: number;
  stock: number;
  image?: string | null; // Variation-specific image
  attributes: ProductAttribute[]; // e.g., [{ name: "Color", value: "Red" }]
  isActive?: boolean;
};

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number;
  description?: string;
  category?: string;
  brand?: string;
  images?: string[]; // Main product images
  image?: string; // Primary image
  overlayImage?: string | null; // transparent PNG for try-on
  variations?: ProductVariation[]; // Array of product variations
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  freeShipping?: boolean;
  discount?: number;
  colors?: string[];
  sizes?: string[];
  virtualTryOn?: boolean;
  specifications?: Record<string, string>;
  style?: string;
  color?: string;
  frameShape?: string;
  material?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Category = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type User = {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  image?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
};

export type CartItem = {
  productId: string; // ID of the main product
  variationId: string; // ID of the selected variation
  name: string; // Product name
  price: number; // Price of the selected variation
  qty: number;
  image?: string | null; // Image of the selected variation
  attributes: ProductAttribute[]; // Attributes of the selected variation
};

export type OrderItem = {
  productId: string;
  variationId: string; // ID of the purchased variation
  name: string;
  price: number;
  qty: number;
  image?: string | null;
  attributes: ProductAttribute[]; // Attributes of the purchased variation
};

export type Order = {
  _id?: string;
  id?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: string;
  items: OrderItem[];
  subtotal: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserSession = {
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
    role?: 'user' | 'admin';
  };
  expires: string;
};
