"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  GitCompare,
  Zap,
  Truck,
  Shield,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCartContext } from "@/contexts/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    _id?: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    category: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
    isNew?: boolean;
    isOnSale?: boolean;
    freeShipping?: boolean;
    discount?: number;
    colors?: string[];
    sizes?: string[];
  };
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  onQuickView?: (product: any) => void;
  onCompare?: (product: any) => void;
  showCompare?: boolean;
  layout?: "grid" | "list";
}

export default function ProductCard({
  product,
  onAddToWishlist,
  isInWishlist = false,
  onQuickView,
  onCompare,
  showCompare = false,
  layout = "grid"
}: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCartContext();

  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addToCart(product);
      // Small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      // Error is handled by the cart context
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCompare?.(product);
  };

  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link href={`/product/${product.id}`}>
          <div className="flex">
            {/* Product Image */}
            <div className="relative w-full sm:w-64 aspect-[4/3] flex-shrink-0">
              <Image
                src={product.image || "/placeholder-glasses.png"}
                alt={`${product.name} - ${product.brand || 'LensVision'} eyewear`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                )}
                {product.isOnSale && discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                  isInWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-card/80 text-foreground hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Product Info */}
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {product.brand && (
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="font-semibold text-lg text-foreground hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating.toFixed(1)} ({product.reviewCount || 0})
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.freeShipping && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Truck className="w-3 h-3" />
                    Free Shipping
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Shield className="w-3 h-3" />
                  Warranty Included
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <Zap className="w-3 h-3" />
                  Virtual Try-On
                </div>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.colors.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                {onQuickView && (
                  <Button variant="outline" size="icon" onClick={handleQuickView}>
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                
                {showCompare && onCompare && (
                  <Button variant="outline" size="icon" onClick={handleCompare}>
                    <GitCompare className="w-4 h-4" />
                    Compare
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    );
  }

  // Grid layout (default)
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder-glasses.png"}
            alt={`${product.name} - ${product.brand || 'LensVision'} eyewear`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          
          {imageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white text-xs shadow-sm">NEW</Badge>
            )}
            {product.isOnSale && discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white text-xs shadow-sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-card/90 text-foreground hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-3 bottom-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                aria-label={`Add ${product.name} to cart`}
                className="flex-1 bg-purple-600 hover:bg-purple-700 shadow-lg focus:ring-2 focus:ring-purple-400 disabled:opacity-50 transition-all duration-200"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </Button>
              
              {onQuickView && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleQuickView}
                  aria-label={`Quick view ${product.name}`}
                  className="bg-card shadow-lg focus:ring-2 focus:ring-purple-400"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Stock indicator */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          
          <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {product.freeShipping && (
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Free Ship
              </div>
            )}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Try-On
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}