"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  ChevronDown,
  ArrowUpDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for LensVision brand products
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "LensVision Classic Aviator",
    price: 129.99,
    originalPrice: 159.99,
    description: "Timeless aviator frames with UV protection and premium materials. Handcrafted by LensVision.",
    image: "/assets/frame1.jpg",
    category: "sunglasses",
    brand: "LensVision",
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    isNew: false,
    isOnSale: true,
    freeShipping: true,
    colors: ["#000000", "#8B4513", "#FFD700"],
    sizes: ["medium", "large"]
  },
  {
    id: "2",
    name: "LensVision Modern Rectangle",
    price: 89.99,
    description: "Sleek rectangular frames perfect for professional settings. Premium LensVision quality.",
    image: "/assets/homeMen.jpg",
    category: "men",
    brand: "LensVision",
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    isOnSale: false,
    freeShipping: true,
    colors: ["#000000", "#8B4513"],
    sizes: ["medium"]
  },
  {
    id: "3",
    name: "LensVision Elegant Cat Eye",
    price: 99.99,
    description: "Sophisticated cat eye frames with vintage charm. Exclusively designed by LensVision.",
    image: "/assets/female.jpg",
    category: "women",
    brand: "LensVision",
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    isNew: false,
    isOnSale: false,
    freeShipping: true,
    colors: ["#000000", "#FF0000", "#FFD700"],
    sizes: ["small", "medium"]
  },
  {
    id: "4",
    name: "LensVision Sport Pro",
    price: 149.99,
    description: "High-performance sports eyewear with advanced materials. Perfect for active lifestyles.",
    image: "/assets/frame1.jpg",
    category: "sport",
    brand: "LensVision",
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    isNew: true,
    isOnSale: false,
    freeShipping: true,
    colors: ["#000000", "#FF0000", "#0000FF"],
    sizes: ["medium", "large"]
  },
  {
    id: "5",
    name: "LensVision Vintage Round",
    price: 109.99,
    originalPrice: 139.99,
    description: "Vintage-inspired round frames with modern technology. A LensVision classic.",
    image: "/assets/slideHome.jpg",
    category: "vintage",
    brand: "LensVision",
    rating: 4.4,
    reviewCount: 76,
    inStock: true,
    isNew: false,
    isOnSale: true,
    freeShipping: true,
    colors: ["#8B4513", "#000000", "#FFD700"],
    sizes: ["small", "medium"]
  },
];

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  colors: string[];
  materials: string[];
  sizes: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
}

type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular";
type ViewMode = "grid" | "list";

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    colors: [],
    materials: [],
    sizes: [],
    rating: 0,
    inStock: false,
    onSale: false,
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && filters.brands.includes(product.brand.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => 
        product.rating && product.rating >= filters.rating
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters.onSale) {
      filtered = filtered.filter(product => product.isOnSale);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "newest":
      default:
        // Keep original order for newest
        break;
    }

    return filtered;
  }, [products, searchQuery, filters, sortBy]);

  // Handler functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      colors: [],
      materials: [],
      sizes: [],
      rating: 0,
      inStock: false,
      onSale: false,
    });
    setSearchQuery("");
  };

  const handleAddToWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCompare = (product: any) => {
    if (compareList.length >= 3) {
      alert("You can compare up to 3 products at once");
      return;
    }
    
    setCompareList(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.materials.length +
    filters.sizes.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search glasses, brands, styles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-purple-600 text-white text-xs px-1.5 py-0.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 hidden lg:block">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">
                  Eyewear Collection
                </h1>
                <span className="text-sm text-muted-foreground">
                  {filteredAndSortedProducts.length} products
                </span>
              </div>
            </div>

            {/* Active Filters */}
            {(activeFiltersCount > 0 || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-card rounded-lg border">
                <span className="text-sm font-medium text-foreground">Active filters:</span>
                
                {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                
                {filters.categories.length > 0 && (
                  <Badge variant="secondary">
                    Categories: {filters.categories.length}
                  </Badge>
                )}
                
                {filters.brands.length > 0 && (
                  <Badge variant="secondary">
                    Brands: {filters.brands.length}
                  </Badge>
                )}
                
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <Badge variant="secondary">
                    Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-purple-600 hover:text-purple-700 ml-2"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                  }`}
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                    onCompare={handleAddToCompare}
                    showCompare={true}
                    layout={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">Compare ({compareList.length}/3)</span>
              <div className="flex gap-2">
                {compareList.map((productId) => {
                  const product = products.find(p => p.id === productId);
                  return product ? (
                    <div key={productId} className="flex items-center gap-2 bg-muted px-3 py-1 rounded">
                      <span className="text-sm text-foreground">{product.name}</span>
                      <button
                        onClick={() => setCompareList(prev => prev.filter(id => id !== productId))}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCompareList([])}>
                Clear
              </Button>
              <Button disabled={compareList.length < 2}>
                Compare Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
