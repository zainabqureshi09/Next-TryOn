"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Verified,
  Edit3,
  X,
  Plus,
} from "lucide-react";

interface Review {
  _id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  pros?: string[];
  cons?: string[];
  recommended: boolean;
  createdAt: string;
  reviewAge?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

export default function ProductReviews({ productId, className = "" }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [sortBy, setSortBy] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    pros: [""],
    cons: [""],
    recommended: true,
  });

  // Fetch reviews
  const fetchReviews = async (page = 1, append = false) => {
    try {
      setLoading(!append);
      
      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: '10',
        sortBy,
        ...(ratingFilter && { rating: ratingFilter }),
        ...(verifiedOnly && { verified: 'true' }),
      });

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setReviews(prev => [...prev, ...data.data.reviews]);
        } else {
          setReviews(data.data.reviews);
        }
        setStats(data.data.stats);
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, ratingFilter, verifiedOnly]);

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...reviewForm,
          pros: reviewForm.pros.filter(p => p.trim()),
          cons: reviewForm.cons.filter(c => c.trim()),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowReviewForm(false);
        setReviewForm({
          rating: 5,
          title: "",
          comment: "",
          pros: [""],
          cons: [""],
          recommended: true,
        });
        fetchReviews(); // Refresh reviews
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Mark review as helpful
  const markHelpful = async (reviewId: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/reviews?reviewId=${reviewId}&action=helpful`, {
        method: 'PUT',
      });

      const data = await response.json();
      if (data.success) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpful: data.data.helpful }
            : review
        ));
      }
    } catch (error) {
      console.error("Failed to mark review helpful:", error);
    }
  };

  // Load more reviews
  const loadMore = () => {
    fetchReviews(currentPage + 1, true);
    setCurrentPage(prev => prev + 1);
  };

  // Rating stars component
  const RatingStars = ({ rating, size = "w-4 h-4", interactive = false, onRatingChange }: {
    rating: number;
    size?: string;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );

  // Rating breakdown component
  const RatingBreakdown = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <RatingStars rating={Math.round(stats.averageRating)} size="w-6 h-6" />
            <p className="text-gray-600 mt-2">
              Based on {stats.totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star] || 0;
              const percentage = stats.totalReviews > 0 
                ? Math.round((count / stats.totalReviews) * 100) 
                : 0;
              
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({stats.totalReviews})
        </h3>
        
        {session && (
          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Edit3 className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <Label>Rating *</Label>
                  <div className="mt-2">
                    <RatingStars 
                      rating={reviewForm.rating} 
                      size="w-8 h-8"
                      interactive
                      onRatingChange={(rating) => 
                        setReviewForm(prev => ({ ...prev, rating }))
                      }
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    required
                    maxLength={200}
                  />
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell others about your experience with this product"
                    required
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                {/* Pros */}
                <div>
                  <Label>What did you like? (Optional)</Label>
                  {reviewForm.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={pro}
                        onChange={(e) => {
                          const newPros = [...reviewForm.pros];
                          newPros[index] = e.target.value;
                          setReviewForm(prev => ({ ...prev, pros: newPros }));
                        }}
                        placeholder="e.g., Great quality"
                        maxLength={100}
                      />
                      {index === reviewForm.pros.length - 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setReviewForm(prev => ({ 
                            ...prev, 
                            pros: [...prev.pros, ""] 
                          }))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newPros = reviewForm.pros.filter((_, i) => i !== index);
                            setReviewForm(prev => ({ ...prev, pros: newPros }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cons */}
                <div>
                  <Label>What could be improved? (Optional)</Label>
                  {reviewForm.cons.map((con, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={con}
                        onChange={(e) => {
                          const newCons = [...reviewForm.cons];
                          newCons[index] = e.target.value;
                          setReviewForm(prev => ({ ...prev, cons: newCons }));
                        }}
                        placeholder="e.g., Could be more comfortable"
                        maxLength={100}
                      />
                      {index === reviewForm.cons.length - 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setReviewForm(prev => ({ 
                            ...prev, 
                            cons: [...prev.cons, ""] 
                          }))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newCons = reviewForm.cons.filter((_, i) => i !== index);
                            setReviewForm(prev => ({ ...prev, cons: newCons }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recommended"
                    checked={reviewForm.recommended}
                    onCheckedChange={(checked) => 
                      setReviewForm(prev => ({ ...prev, recommended: checked as boolean }))
                    }
                  />
                  <Label htmlFor="recommended">I would recommend this product</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Rating Breakdown */}
      <RatingBreakdown />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">Filter & Sort:</span>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified-only"
                checked={verifiedOnly}
                onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
              />
              <Label htmlFor="verified-only" className="text-sm">Verified purchases only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={review.rating} />
                        <span className="text-sm text-gray-500">{review.reviewAge || review.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {review.recommended && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Pros and Cons */}
                {(review.pros?.length || review.cons?.length) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">👍 Pros:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">👎 Cons:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(review._id)}
                      disabled={!session}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-12 h-12 rounded object-cover cursor-pointer hover:opacity-75"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && reviews.length > 0 && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
}