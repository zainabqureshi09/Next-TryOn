"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const slugToTitle: Record<string, string> = {
  men: "Men",
  women: "Women",
  sunglasses: "Sunglasses",
};

export default function CatalogSlugPage({ params }: Props) {
  const title = slugToTitle[params.slug] || params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Filters state (aligns with ProductFilters)
  const [filters, setFilters] = useState({
    categories: [params.slug],
    brands: [],
    priceRange: [0, 1000] as [number, number],
    colors: [],
    materials: [],
    sizes: [],
    rating: 0,
    inStock: false,
    onSale: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Build query string from filters
  const buildQuery = (pageNum: number) => {
    const paramsObj: Record<string, string> = {
      category: params.slug,
      limit: "24",
      page: String(pageNum),
    };
    // Price
    if (filters.priceRange[0] > 0) paramsObj.priceMin = String(filters.priceRange[0]);
    if (filters.priceRange[1] < 1000) paramsObj.priceMax = String(filters.priceRange[1]);
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
    if (sortBy === "price-low") { paramsObj.sort = "price"; paramsObj.order = "asc"; }
    else if (sortBy === "price-high") { paramsObj.sort = "price"; paramsObj.order = "desc"; }
    else { paramsObj.sort = "createdAt"; paramsObj.order = "desc"; }

    const qs = new URLSearchParams(paramsObj).toString();
    return `/api/products?${qs}`;
  };

  // Fetch products for this category + filters/sort
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1);
        const resp = await fetch(buildQuery(1));
        const data = await resp.json();
        const mapped: Product[] = (data.products || []).map((p: any) => ({
          _id: p._id || p.id,
          id: p._id || p.id,
          name: p.name || "Untitled",
          price: p.variations?.[0]?.price ?? p.price ?? 0,
          description: p.description || "",
          image: p.variations?.[0]?.image || p.images?.[0] || p.image || "/assets/slideHome.jpg",
          category: (p.category?.toLowerCase?.() || params.slug) as any,
        }));
        if (!ignore) {
          setProducts(mapped);
          setTotalPages(data.pagination?.pages || 1);
          setPage(1);
        }
      } catch (e) {
        if (!ignore) setError("Failed to load products. Please try again later.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [params.slug, filters, sortBy]);

  // Derived data: apply simple filters client-side
  const filteredProducts = useMemo(() => {
    let items = [...products];
    // Price
    items = items.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    // Rating (not present in simple type, skip for now)
    // In-stock and On-sale flags would need real fields; skipping client filter for now
    return items;
  }, [products, filters]);

  // Sort
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // newest fallback: keep server order or reverse
        break;
    }
    return items;
  }, [filteredProducts, sortBy]);

  const activeFiltersCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.brands.length +
      filters.colors.length +
      filters.materials.length +
      filters.sizes.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)
    );
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
              <Filter className="w-4 h-4 mr-2" /> Filters {activeFiltersCount > 0 ? <Badge className="ml-2 bg-purple-600 text-white">{activeFiltersCount}</Badge> : null}
            </Button>
            <span className="text-sm text-muted-foreground hidden lg:inline">{sortedProducts.length} items</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <ProductFilters
              filters={filters as any}
              onFiltersChange={setFilters as any}
              onClearFilters={() => setFilters({ ...filters, brands: [], colors: [], materials: [], sizes: [], rating: 0, inStock: false, onSale: false, priceRange: [0, 1000] })}
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
                <Button variant="outline" onClick={() => location.reload()}>Retry</Button>
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
                      onClick={async () => {
                        const next = page + 1;
                        const resp = await fetch(buildQuery(next));
                        const data = await resp.json();
                        const mapped: Product[] = (data.products || []).map((p: any) => ({
                          _id: p._id || p.id,
                          id: p._id || p.id,
                          name: p.name || "Untitled",
                          price: p.variations?.[0]?.price ?? p.price ?? 0,
                          description: p.description || "",
                          image: p.variations?.[0]?.image || p.images?.[0] || p.image || "/assets/slideHome.jpg",
                          category: (p.category?.toLowerCase?.() || params.slug) as any,
                        }));
                        setProducts(prev => [...prev, ...mapped]);
                        setPage(next);
                        setTotalPages(data.pagination?.pages || next);
                      }}
                    >
                      Load more
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
              filters={filters as any}
              onFiltersChange={setFilters as any}
              onClearFilters={() => setFilters({ ...filters, brands: [], colors: [], materials: [], sizes: [], rating: 0, inStock: false, onSale: false, priceRange: [0, 1000] })}
              isOpen={true}
              onToggle={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
