"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  Camera as CameraIcon,
  Download,
  ShoppingCart,
  Heart,
  Search,
  Loader2,
  Eye,
  Zap,
  RefreshCw,
  Check,
  Star,
  Filter,
  X,
  ShoppingBag,
  ArrowRight,
  Upload,
} from "lucide-react";
import { useImageCapture } from "@/hooks/use-image-capture";
import toast, { Toaster } from "react-hot-toast";
import { Camera, CameraRef } from "./Camera";
import { useCartContext } from "@/contexts/CartContext";
import { OnboardingModal } from "./ui/onboarding-modal";
import type { Product } from "@/data/products";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";

// ✅ Enhanced product interface with virtual try-on support
interface VirtualTryOnProduct {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: "men" | "women" | "sunglasses";
  overlayImage?: string;
  virtualTryOn?: boolean;
  specifications?: Record<string, string>;
  style?: string;
  color?: string;
  frameShape?: string;
  material?: string;
  rating?: number;
  reviewCount?: number;
}

export const VirtualTryOn = () => {
  // Product and UI states
  const [products, setProducts] = useState<VirtualTryOnProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VirtualTryOnProduct | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Camera and capture states
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [mode, setMode] = useState<"live" | "photo">("live");
  
  // Loading and error states
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);

  const cameraRef = useRef<CameraRef>(null);
  const { downloadImage } = useImageCapture();
  const cart = useCartContext();

  // Update cart count when cart changes
  useEffect(() => {
    setCartCount(cart.count);
  }, [cart.count]);

  // ✅ Toast wrapper
  const showToast = useCallback(
    (props: { title: string; description?: string; variant?: "destructive" }) => {
      if (props.variant === "destructive") {
        toast.error(`${props.title}${props.description ? ` — ${props.description}` : ""}`);
      } else {
        toast.success(`${props.title}${props.description ? ` — ${props.description}` : ""}`);
      }
    },
    []
  );

  // 🔄 Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch("/api/products?limit=50&virtualTryOn=true");
      const data = await response.json();
      
      if (data.products) {
        const virtualTryOnProducts = data.products.map((product: any) => ({
          ...product,
          id: product._id || product.id,
          virtualTryOn: true,
          overlayImage: product.overlayImage || product.image,
          style: product.style || "classic",
          color: product.color || "black",
        }));
        
        setProducts(virtualTryOnProducts);
        if (virtualTryOnProducts.length > 0 && !selectedProduct) {
          setSelectedProduct(virtualTryOnProducts[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showToast({ 
        title: "Failed to load products", 
        description: "Using demo products instead", 
        variant: "destructive" 
      });
      
      // Fallback to demo data
      const demoProducts: VirtualTryOnProduct[] = [
        {
          _id: "demo-1",
          id: "demo-1",
          name: "Classic Aviator",
          price: 129.99,
          description: "Timeless aviator frames with UV protection",
          image: "/assets/frame1.jpg",
          overlayImage: "/frames/glasses.png",
          category: "sunglasses",
          style: "aviator",
          color: "gold",
          virtualTryOn: true,
          rating: 4.8,
          reviewCount: 152,
          specifications: { "Frame Material": "Metal", "Lens Type": "UV Protection" }
        },
        {
          _id: "demo-2",
          id: "demo-2",
          name: "Elegant Round",
          price: 99.99,
          description: "Vintage-inspired round frames perfect for women",
          image: "/assets/female.jpg",
          overlayImage: "/frames/glasses2.png",
          category: "women",
          style: "round",
          color: "black",
          virtualTryOn: true,
          rating: 4.6,
          reviewCount: 89,
          specifications: { "Frame Material": "Acetate", "Lens Type": "Clear" }
        },
        {
          _id: "demo-3",
          id: "demo-3",
          name: "Minimal Black",
          price: 149.99,
          description: "Professional minimal frames designed for men",
          image: "/assets/homeMen.jpg",
          overlayImage: "/frames/glasses.png",
          category: "men",
          style: "rectangular",
          color: "black",
          virtualTryOn: true,
          rating: 4.9,
          reviewCount: 234,
          specifications: { "Frame Material": "Titanium", "Lens Type": "Blue Light" }
        },
        {
          _id: "demo-4",
          id: "demo-4",
          name: "Cat Eye Classic",
          price: 109.99,
          description: "Sophisticated cat eye frames for elegant style",
          image: "/assets/female.jpg",
          overlayImage: "/frames/glasses2.png",
          category: "women",
          style: "cat-eye",
          color: "tortoiseshell",
          virtualTryOn: true,
          rating: 4.7,
          reviewCount: 176,
          specifications: { "Frame Material": "Acetate", "Lens Type": "Anti-Glare" }
        },
        {
          _id: "demo-5",
          id: "demo-5",
          name: "Sport Shield",
          price: 119.99,
          description: "Durable wrap-around sunglasses with polarized lenses",
          image: "/assets/slideHome.jpg",
          overlayImage: "/frames/glasses.png",
          category: "sunglasses",
          style: "sport",
          color: "black",
          virtualTryOn: true,
          rating: 4.5,
          reviewCount: 98,
          specifications: { "Frame Material": "Polymer", "Lens Type": "Polarized UV" }
        },
      ];
      
      setProducts(demoProducts);
      setSelectedProduct(demoProducts[0]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedProduct, showToast]);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🧭 Onboarding Modal
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) setShowOnboarding(true);
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  }, []);

  // ✅ Dynamic product filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const catMatch = category === "all" || product.category === category;
      
      // Search filter
      const searchMatch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return catMatch && searchMatch;
    });
  }, [products, category, searchTerm]);

  // Available categories
  const availableCategories = ["men", "women", "sunglasses"];

  // 📸 Capture snapshot
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current?.captureImage) {
      showToast({ title: "Camera not ready", description: "Please ensure your camera is active.", variant: "destructive" });
      return;
    }

    try {
      setIsCapturing(true);
      const image = await cameraRef.current.captureImage();
      setCapturedImage(image);
      showToast({ title: "Image captured", description: "Preview ready!" });
    } catch {
      showToast({ title: "Capture failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsCapturing(false);
    }
  }, [showToast]);

  // 💾 Save snapshot
  const handleSave = useCallback(() => {
    if (!capturedImage) {
      showToast({ title: "No image", description: "Capture or upload an image first.", variant: "destructive" });
      return;
    }
    downloadImage(capturedImage, `tryon-${Date.now()}.png`);
    showToast({ title: "Image saved", description: "Downloaded successfully!" });
  }, [capturedImage, downloadImage, showToast]);

  // 🛒 Add to cart
  const handleAddToCart = useCallback(
    async (product: VirtualTryOnProduct) => {
      if (!product?.id) {
        showToast({ title: "Error", description: "Invalid product.", variant: "destructive" });
        return;
      }

      try {
        setIsAddingToCart(product.id);
        await cart.addToCart(product, 1);
        showToast({ 
          title: "Added to cart", 
          description: `${product.name} ($${product.price}) added successfully.` 
        });
      } catch (err) {
        console.error("Add to cart error:", err);
        showToast({ 
          title: "Error", 
          description: err instanceof Error ? err.message : "Failed to add item to cart.", 
          variant: "destructive" 
        });
      } finally {
        setIsAddingToCart(null);
      }
    },
    [cart, showToast]
  );

  // ❤️ Toggle favorite
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showToast({ title: "Removed from favorites" });
      } else {
        newFavorites.add(productId);
        showToast({ title: "Added to favorites" });
      }
      return newFavorites;
    });
  }, [showToast]);

  // 🔄 Select product for try-on
  const handleSelectProduct = useCallback((product: VirtualTryOnProduct) => {
    setSelectedProduct(product);
    showToast({ 
      title: "Product selected", 
      description: `Now trying on ${product.name}` 
    });
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: 'white',
          color: '#374151',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb'
        }
      }} />

      {/* 🎓 Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
        />
      )}

      {/* 🧠 Enhanced Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">LensVision</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Virtual Try-On</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={mode === "live" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("live")}
                >
                  <CameraIcon className="w-4 h-4 mr-1" /> Live
                </Button>
                <Button
                  variant={mode === "photo" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("photo")}
                >
                  <Upload className="w-4 h-4 mr-1" /> Photo
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/cart" className="relative">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🎥 Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Try-On Camera Area */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Try-On Header */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Live Virtual Try-On</h2>
                    <p className="text-sm text-gray-600">Real-time AI face detection and glasses overlay</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProduct && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Eye className="w-3 h-3 mr-1" />
                        Trying: {selectedProduct.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Camera Area */}
              <div className="relative">
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-video bg-black rounded-b-2xl overflow-hidden">
                  {mode === "live" ? (
                    <>
                      <Camera 
                        ref={cameraRef} 
                        selectedGlasses={selectedProduct?.id || ""}
                        onError={() => setMode("photo")}
                      />

                      {/* Camera Controls Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                        <div className="flex items-center justify-center gap-4">
                          <Button 
                            onClick={handleCapture} 
                            disabled={isCapturing}
                            size="lg"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            {isCapturing ? (
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                              <CameraIcon className="w-5 h-5 mr-2" />
                            )}
                            {isCapturing ? "Capturing..." : "Capture Photo"}
                          </Button>
                          
                          {capturedImage && (
                            <Button 
                              onClick={handleSave} 
                              variant="outline"
                              size="lg"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Save
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={isCapturing ? "destructive" : "outline"}
                          className="bg-black/20 text-white border-white/20"
                        >
                          {isCapturing ? "Capturing..." : "Live"}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    // Photo Mode
                    <ImageUpload 
                      selectedGlasses={selectedProduct?.id || "aviator"}
                      onBack={() => setMode("live")}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="mt-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Current Selection</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={selectedProduct.image || selectedProduct.overlayImage} 
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                            <p className="text-lg font-bold text-purple-600">${selectedProduct.price}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleFavorite(selectedProduct.id)}
                            className={`p-2 ${favorites.has(selectedProduct.id) ? "text-red-500" : "text-gray-400"}`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.has(selectedProduct.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                        
                        {selectedProduct.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({selectedProduct.reviewCount} reviews)</span>
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-600 mb-4">{selectedProduct.description}</p>
                        
                        {selectedProduct.specifications && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                              <Badge key={key} className="bg-gray-100 text-gray-700 text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => handleAddToCart(selectedProduct)}
                          disabled={isAddingToCart === selectedProduct.id}
                          size="lg"
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          {isAddingToCart === selectedProduct.id ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-5 h-5 mr-2" />
                          )}
                          Add to Cart - ${selectedProduct.price}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="mt-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Captured Photo</h3>
                  </div>
                  <div className="p-6">
                    <img src={capturedImage} alt="Preview" className="rounded-xl border w-full h-auto shadow-sm" />
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                      <Button onClick={handleSave} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Selection Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Your Perfect Frames</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search glasses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={category === "all" ? "default" : "outline"} 
                    onClick={() => setCategory("all")}
                    className="justify-start h-12"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    All
                  </Button>
                  {availableCategories.map((cat) => (
                    <Button 
                      key={cat} 
                      variant={category === cat ? "default" : "outline"} 
                      onClick={() => setCategory(cat)}
                      className="justify-start h-12"
                    >
                      {cat === "men" && <span className="w-4 h-4 mr-2">👨</span>}
                      {cat === "women" && <span className="w-4 h-4 mr-2">👩</span>}
                      {cat === "sunglasses" && <span className="w-4 h-4 mr-2">🕶️</span>}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>


              {/* Product List */}
              <div className="bg-white rounded-2xl shadow-lg">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Available Frames</h2>
                    <Badge className="bg-purple-100 text-purple-700">
                      {filteredProducts.length} styles
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
                        <p className="text-gray-600">Loading amazing frames...</p>
                      </div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No frames found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or category</p>
                      <Button 
                        onClick={() => {
                          setCategory("all");
                          setSearchTerm("");
                        }}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Show All Frames
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            selectedProduct?.id === product.id 
                              ? "border-purple-300 bg-purple-50 shadow-sm" 
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => handleSelectProduct(product)}
                        >
                          {/* Selection Indicator */}
                          {selectedProduct?.id === product.id && (
                            <div className="absolute top-2 left-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="w-20 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                              <img 
                                src={product.image || product.overlayImage || "/frames/glasses.png"} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(product.id);
                                  }}
                                  className={`p-1 ${favorites.has(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                                >
                                  <Heart className={`w-4 h-4 ${favorites.has(product.id) ? "fill-current" : ""}`} />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-lg font-bold text-purple-600">${product.price}</p>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-gray-100 text-gray-700 text-xs py-1">
                                  {product.category}
                                </Badge>
                                {product.style && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs py-1">
                                    {product.style}
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                size="sm"
                                disabled={isAddingToCart === product.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
                              >
                                {isAddingToCart === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                )}
                                {isAddingToCart === product.id ? "Adding..." : "Add to Cart"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-4">
                  <Link href="/shop" className="block">
                    <Button variant="outline" className="w-full justify-between h-12">
                      <span>Browse Full Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/cart" className="block">
                    <Button className="w-full justify-between h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <span>View Cart ({cartCount})</span>
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
