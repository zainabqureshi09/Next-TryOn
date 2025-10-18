import { z } from "zod";

export const productAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
});

export const productVariationSchema = z.object({
  sku: z.string().min(1, "SKU is required for variations"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  attributes: z.array(productAttributeSchema).min(1, "At least one attribute is required for a variation"),
  isActive: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  overlayImage: z.string().url().optional().or(z.literal("")).or(z.null()),
  variations: z.array(productVariationSchema).min(1, "At least one variation is required"),
  isActive: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  variationId: z.string().min(1), // New: ID of the selected variation
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
  image: z.string().url().nullable().optional(),
  attributes: z.array(productAttributeSchema).optional(), // New: Attributes of the selected variation
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
      productId: z.string().optional(), // Changed from 'id' to 'productId'
      variationId: z.string().optional(), // New: variationId
      name: z.string().min(1),
      price: z.number().nonnegative(),
      qty: z.number().int().positive(),
      image: z.union([z.string(), z.literal(""), z.null()]).optional(),
      attributes: z.array(productAttributeSchema).optional(), // New: attributes
    })
  ).min(1),
});

export const uploadSchema = z.object({
  dataUrl: z.string().startsWith("data:").min(10),
});

export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;



































