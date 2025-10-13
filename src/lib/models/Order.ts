import mongoose, { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
  sku?: string;
}

export interface IOrder {
  userId?: string;
  customerEmail: string;
  customerName?: string;
  shippingAddress?: {
    name?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    name?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "completed";
  paymentMethod: "stripe" | "paypal" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  
  // Stripe payment details
  stripeSessionId?: string;
  
  // PayPal payment details
  paypalOrderId?: string;
  paypalCaptureId?: string;
  
  // General payment details
  paymentDetails?: {
    paypalOrderId?: string;
    captureId?: string;
    amount?: any;
    payerInfo?: any;
    capturedAt?: Date;
  };
  
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: Date;
}

const AddressSchema = new Schema({
  name: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String },
  sku: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, index: true },
    customerEmail: { type: String, required: true, index: true },
    customerName: { type: String },
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, default: 0, min: 0 },
    shipping: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "completed"], 
      default: "pending", 
      index: true 
    },
    paymentMethod: { 
      type: String, 
      enum: ["stripe", "paypal", "cod"], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed", "refunded"], 
      default: "pending" 
    },
    
    // Stripe payment details
    stripeSessionId: { type: String, index: true },
    
    // PayPal payment details
    paypalOrderId: { type: String, index: true },
    paypalCaptureId: { type: String },
    
    // General payment details
    paymentDetails: {
      paypalOrderId: { type: String },
      captureId: { type: String },
      amount: { type: Schema.Types.Mixed },
      payerInfo: { type: Schema.Types.Mixed },
      capturedAt: { type: Date },
    },
    
    trackingNumber: { type: String },
    notes: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

// Generate order number based on timestamp and random string
OrderSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    (this as any)._id = `ORD-${timestamp}-${randomStr}`;
  }
  next();
});

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;



