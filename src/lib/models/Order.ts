import mongoose, { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
}

export interface IOrder {
  customerName: string;
  customerEmail: string;
  shippingAddress?: string;
  items: IOrderItem[];
  subtotal: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    shippingAddress: { type: String },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "shipped", "cancelled"], default: "pending", index: true },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;



