import mongoose, { Schema, models, model } from "mongoose";

export interface IReview {
  productId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  verified: boolean; // Verified purchase
  helpful: number; // Number of helpful votes
  images?: string[]; // Review images
  pros?: string[];
  cons?: string[];
  recommended: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { 
      type: String, 
      required: true, 
      index: true 
    },
    userId: { 
      type: String, 
      index: true 
    },
    userName: { 
      type: String, 
      required: true,
      maxlength: 100
    },
    userEmail: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    title: { 
      type: String, 
      required: true,
      maxlength: 200
    },
    comment: { 
      type: String, 
      required: true,
      maxlength: 2000
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    helpful: { 
      type: Number, 
      default: 0 
    },
    images: [{ 
      type: String 
    }],
    pros: [{ 
      type: String,
      maxlength: 100
    }],
    cons: [{ 
      type: String,
      maxlength: 100
    }],
    recommended: { 
      type: Boolean, 
      default: true 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ helpful: -1 });
ReviewSchema.index({ verified: 1, rating: -1 });

// Virtual for review age
ReviewSchema.virtual('reviewAge').get(function() {
  if (!this.createdAt) return '';
  
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Static method to calculate product rating stats
ReviewSchema.statics.getProductRatingStats = async function(productId: string) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  stats[0].ratingDistribution.forEach((rating: number) => {
    distribution[rating as keyof typeof distribution]++;
  });

  return {
    totalReviews: stats[0].totalReviews,
    averageRating: Math.round(stats[0].averageRating * 10) / 10,
    ratingDistribution: distribution
  };
};

// Instance method to check if user found review helpful
ReviewSchema.methods.isHelpful = function(userId: string) {
  // This would require a separate HelpfulVotes collection in a real app
  return false;
};

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;