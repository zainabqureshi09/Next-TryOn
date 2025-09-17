import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  price: z.number().nonnegative(),
  sku: z.string().optional(),
  frame: z.string().optional(),
  image: z.string().url().optional(),
  overlayImage: z.string().url().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
  image: z.string().url().nullable().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const checkoutSchema = z.object({
  customerEmail: z.string().email().optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      _id: z.string().optional(),
      name: z.string().min(1),
      price: z.number().nonnegative(),
      qty: z.number().int().positive(),
      image: z.string().url().nullable().optional(),
    })
  ).min(1),
});

export const uploadSchema = z.object({
  dataUrl: z.string().startsWith("data:").min(10),
});

export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;










