import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, oldest, rating-high, rating-low, helpful
    const ratingFilter = searchParams.get('rating'); // Filter by specific rating
    const verified = searchParams.get('verified') === 'true'; // Only verified reviews
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { productId };
    if (ratingFilter) {
      query.rating = parseInt(ratingFilter);
    }
    if (verified) {
      query.verified = true;
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'rating-high':
        sort = { rating: -1, createdAt: -1 };
        break;
      case 'rating-low':
        sort = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sort = { helpful: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Get reviews with pagination
    const skip = (page - 1) * limit;
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalReviews = await Review.countDocuments(query);
    
    // Get rating statistics using aggregation
    const ratingStats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate overall stats
    const totalRatings = ratingStats.reduce((sum: number, item: any) => sum + item.count, 0);
    const weightedSum = ratingStats.reduce((sum: number, item: any) => sum + (item._id * item.count), 0);
    const averageRating = totalRatings > 0 ? weightedSum / totalRatings : 0;
    
    const formattedStats = {
      totalReviews: totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown: {
        5: ratingStats.find((r: any) => r._id === 5)?.count || 0,
        4: ratingStats.find((r: any) => r._id === 4)?.count || 0,
        3: ratingStats.find((r: any) => r._id === 3)?.count || 0,
        2: ratingStats.find((r: any) => r._id === 2)?.count || 0,
        1: ratingStats.find((r: any) => r._id === 1)?.count || 0,
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total: totalReviews,
          pages: Math.ceil(totalReviews / limit)
        },
        stats: formattedStats
      }
    });

  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      productId,
      rating,
      title,
      comment,
      pros = [],
      cons = [],
      recommended = true,
      images = []
    } = body;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userEmail: session.user.email
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Check if this is a verified purchase (simplified - in real app check orders)
    const verified = false; // TODO: Check if user purchased this product

    // Create review
    const review = new Review({
      productId,
      userId: (session.user as any).id,
      userName: session.user.name || session.user.email?.split('@')[0] || 'Anonymous',
      userEmail: session.user.email!,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      pros: pros.filter((p: string) => p.trim()),
      cons: cons.filter((c: string) => c.trim()),
      recommended,
      images: images.filter((img: string) => img.trim()),
      verified,
      helpful: 0
    });

    await review.save();

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review submitted successfully"
    });

  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    const action = searchParams.get('action'); // 'helpful' or 'unhelpful'

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (action === 'helpful') {
      review.helpful = (review.helpful || 0) + 1;
      await review.save();
      
      return NextResponse.json({
        success: true,
        data: { helpful: review.helpful },
        message: "Thank you for your feedback"
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Review PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}