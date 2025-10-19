"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductGrid from "@/app/shop/components/ProductGrid";
import type { Product } from "@/data/products";
import ProductFilters from "@/components/ProductFilters";
import { Filter, ChevronRight, ArrowRight } from "lucide-react";

type Props = { params: { slug: string } };

type SortOption = "newest" | "price-low" | "price-high" | "rating";

const slugToTitle: Record<string, string> = {
  men: "Men",
  women: "Women",
  sunglasses: "Sunglasses",
};

// Default price range constants
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export default function CatalogSlugPage({ params }: Props) {
  const title = slugToTitle[params.slug] || params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Filters state
  const [filters, setFilters] = useState({
    categories: [params.slug],
    brands: [] as string[],
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE] as [number, number],
    colors: [] as string[],
    materials: [] as string[],
    sizes: [] as string[],
    rating: 0,
    inStock: false,
    onSale: false,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Build query string from filters - memoized to prevent unnecessary recalculations
  const buildQuery = useCallback((pageNum: number) => {
    const paramsObj: Record<string, string> = {
      category: params.slug,
      limit: "24",
      page: String(pageNum),
    };
    
    // Price
    if (filters.priceRange[0] > DEFAULT_MIN_PRICE) paramsObj.priceMin = String(filters.priceRange[0]);
    if (filters.priceRange[1] < DEFAULT_MAX_PRICE) paramsObj.priceMax = String(filters.priceRange[1]);
    
    // Colors
    if (filters.colors.length) paramsObj.colors = filters.colors.join(",");
    
    // Brands -> style
    if (filters.brands.length) paramsObj.brands = filters.brands.join(",");
    
    // Materials -> frame
    if (filters.materials.length) paramsObj.materials = filters.materials.join(",");
    
    // Rating
    if (filters.rating > 0) paramsObj.rating = String(filters.rating);
    
    // Flags
    if (filters.inStock) paramsObj.inStock = "true";
    if (filters.onSale) paramsObj.onSale = "true";
    
    // Sort
    if (sortBy === "price-low") { 
      paramsObj.sort = "price"; 
      paramsObj.order = "asc"; 
    } else if (sortBy === "price-high") { 
      paramsObj.sort = "price"; 
      paramsObj.order = "desc"; 
    } else if (sortBy === "rating") {
      paramsObj.sort = "rating";
      paramsObj.order = "desc";
    } else { 
      paramsObj.sort = "createdAt"; 
      paramsObj.order = "desc"; 
    }

    const qs = new URLSearchParams(paramsObj).toString();
    return `/api/products?${qs}`;
  }, [params.slug, filters, sortBy]);

  // Map API response to Product type
  const mapProducts = useCallback((products: any[]): Product[] => {
    return products.map((p) => ({
      _id: p._id || p.id,
      id: p._id || p.id,
      name: p.name || "Untitled",
      price: p.variations?.[0]?.price ?? p.price ?? 0,
      description: p.description || "",
      image: p.variations?.[0]?.image || p.images?.[0] || p.image || "/assets/slideHome.jpg",
      category: (p.category?.toLowerCase?.() || params.slug) as any,
      rating: p.rating || 0,
      inStock: p.inStock ?? true,
      onSale: p.onSale ?? false,
    }));
  }, [params.slug]);

  // Fetch products for this category + filters/sort
  useEffect(() => {
    let ignore = false;
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resp = await fetch(buildQuery(1));
        
        if (!resp.ok) {
          throw new Error(`Failed to fetch: ${resp.status}`);
        }
        
        const data = await resp.json();
        
        if (!ignore) {
          const mappedProducts = mapProducts(data.products || []);
          setProducts(mappedProducts);
          setTotalPages(data.pagination?.pages || 1);
          setPage(1);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading products:", err);
          setError(err instanceof Error ? err.message : "Failed to load products. Please try again later.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    
    loadProducts();
    
    return () => { 
      ignore = true; 
    };
  }, [buildQuery, mapProducts]);

  // Load more products
  const loadMoreProducts = async () => {
    if (loadingMore || page >= totalPages) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const resp = await fetch(buildQuery(nextPage));
      
      if (!resp.ok) {
        throw new Error(`Failed to fetch: ${resp.status}`);
      }
      
      const data = await resp.json();
      const mappedProducts = mapProducts(data.products || []);
      
      setProducts(prev => [...prev, ...mappedProducts]);
      setPage(nextPage);
      setTotalPages(data.pagination?.pages || nextPage);
    } catch (err) {
      console.error("Error loading more products:", err);
      setError(err instanceof Error ? err.message : "Failed to load more products.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Clear filters function
  const clearFilters = useCallback(() => {
    setFilters({
      categories: [params.slug],
      brands: [],
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
      colors: [],
      materials: [],
      sizes: [],
      rating: 0,
      inStock: false,
      onSale: false,
    });
  }, [params.slug]);

  // Derived data: apply simple filters client-side
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price filter
      const inPriceRange = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];
      
      // Rating filter
      const meetsRating = filters.rating === 0 || (product.rating || 0) >= filters.rating;
      
      // In stock filter
      const meetsStock = !filters.inStock || product.inStock;
      
      // On sale filter  
      const meetsSale = !filters.onSale || product.isOnSale;
      
      return inPriceRange && meetsRating && meetsStock && meetsSale;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    
    switch (sortBy) {
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      case "rating":
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        // "newest" - keep original order (assumed to be newest first from API)
        return items;
    }
  }, [filteredProducts, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.materials.length > 0) count += filters.materials.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.rating > 0) count += 1;
    if (filters.inStock) count += 1;
    if (filters.onSale) count += 1;
    if (filters.priceRange[0] > DEFAULT_MIN_PRICE || filters.priceRange[1] < DEFAULT_MAX_PRICE) count += 1;
    
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen">
      {/* Hero banner with breadcrumb */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff3, transparent 30%), radial-gradient(circle at 80% 30%, #fff3, transparent 30%)" }} />
        <div className="max-w-7xl mx-auto px-6 py-12 text-white">
          <nav className="text-sm mb-4 opacity-90" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><Link href="/catalog" className="hover:underline">Catalog</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li aria-current="page" className="font-medium">{title}</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title} Collection</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Discover premium eyewear curated for {title.toLowerCase()} — crafted for comfort, durability, and style.</p>
          <div className="mt-4">
            <Link href={`/shop?category=${params.slug}`} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2 rounded-lg transition">
              Browse All in Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
              <Filter className="w-4 h-4 mr-2" /> 
              Filters 
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-purple-600 text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              isOpen={true}
              onToggle={() => setShowFilters(false)}
            />
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground">Loading {title}...</div>
              </Card>
            ) : error ? (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground mb-2">{error}</div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </Card>
            ) : sortedProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground mb-2">No products found</div>
                <Link href={`/shop?category=${params.slug}`}>
                  <Button>Browse Shop</Button>
                </Link>
              </Card>
            ) : (
              <>
                <ProductGrid products={sortedProducts} />
                {page < totalPages && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-2xl p-4 overflow-y-auto">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              isOpen={true}
              onToggle={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
