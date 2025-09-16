export type Product = {
  _id?: string;
  id?: string;
  name: string;
  title?: string;
  price: number;
  frame?: string;
  sku?: string;
  image?: string | null;       // main product image
  overlayImage?: string | null;// transparent PNG for try-on
  description?: string;
  category?: string;
  stock?: number;
  isActive?: boolean;
  images?: string[];
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

export type CartItem = Product & { qty: number };

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
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
