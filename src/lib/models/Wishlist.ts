import mongoose, { Schema, models, model } from "mongoose";

export interface IWishlistItem {
  productId: string;
  addedAt: Date;
  notes?: string;
  priceWhenAdded: number;
  notifyOnPriceDrop?: boolean;
  notifyOnBack?: boolean;
}

export interface IWishlist {
  userId: string;
  userEmail: string;
  items: IWishlistItem[];
  isPublic: boolean;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { 
    type: String, 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
  notes: { 
    type: String, 
    maxlength: 500 
  },
  priceWhenAdded: { 
    type: Number, 
    required: true 
  },
  notifyOnPriceDrop: { 
    type: Boolean, 
    default: false 
  },
  notifyOnBack: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    userEmail: { 
      type: String, 
      required: true 
    },
    items: [WishlistItemSchema],
    isPublic: { 
      type: Boolean, 
      default: false 
    },
    name: { 
      type: String, 
      default: 'My Wishlist',
      maxlength: 100
    },
    description: { 
      type: String, 
      maxlength: 500 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure one wishlist per user
WishlistSchema.index({ userId: 1 }, { unique: true });

// Virtual for item count
WishlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Virtual for total value
WishlistSchema.virtual('totalValue').get(function() {
  return this.items.reduce((total, item) => total + item.priceWhenAdded, 0);
});

// Instance methods
WishlistSchema.methods.addItem = function(item: Omit<IWishlistItem, 'addedAt'>) {
  const existingItem = this.items.find((i: IWishlistItem) => i.productId === item.productId);
  
  if (existingItem) {
    // Update existing item
    existingItem.notes = item.notes || existingItem.notes;
    existingItem.priceWhenAdded = item.priceWhenAdded;
    existingItem.notifyOnPriceDrop = item.notifyOnPriceDrop;
    existingItem.notifyOnBack = item.notifyOnBack;
  } else {
    // Add new item
    this.items.push({
      ...item,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

WishlistSchema.methods.removeItem = function(productId: string) {
  this.items = this.items.filter((item: IWishlistItem) => item.productId !== productId);
  return this.save();
};

WishlistSchema.methods.hasItem = function(productId: string) {
  return this.items.some((item: IWishlistItem) => item.productId === productId);
};

WishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  return this.save();
};

// Static methods
WishlistSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ userId });
};

WishlistSchema.statics.getOrCreateWishlist = async function(userId: string, userEmail: string) {
  let wishlist = await this.findOne({ userId });
  
  if (!wishlist) {
    wishlist = new this({
      userId,
      userEmail,
      items: [],
      isPublic: false,
      name: 'My Wishlist'
    });
    await wishlist.save();
  }
  
  return wishlist;
};

const Wishlist = models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;