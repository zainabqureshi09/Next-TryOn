"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  style: string;
  color: string;
  image: string;
  overlayImage: string;
  virtualTryOn: boolean;
  isActive: boolean;
  specifications: {
    frameWidth: string;
    lensWidth: string;
    bridgeWidth: string;
    templeLength: string;
    material: string;
  };
}

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "men",
    style: "",
    color: "",
    image: "",
    overlayImage: "/frames/glasses.png",
    virtualTryOn: true,
    isActive: true,
    specifications: {
      frameWidth: "",
      lensWidth: "",
      bridgeWidth: "",
      templeLength: "",
      material: ""
    }
  });

  // Redirect if not admin
  if (session && (session.user as any)?.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("specifications.")) {
      const specField = name.replace("specifications.", "");
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Product created successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        setMessage(data.error || "Failed to create product");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("An error occurred while creating the product");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/products" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">
            Add New Product
          </h1>
        </div>
      </div>
      
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
        {/* Basic Product Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name *</label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Classic Aviator Sunglasses"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Price ($) *</label>
              <Input 
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock Quantity *</label>
              <Input 
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">Category *</label>
              <select 
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="sunglasses">Sunglasses</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="style" className="text-sm font-medium text-gray-700">Style</label>
              <Input 
                id="style"
                name="style"
                value={formData.style}
                onChange={handleChange}
                placeholder="e.g., Aviator, Round, Rectangle"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium text-gray-700">Color</label>
              <Input 
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Black, Gold, Silver"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description *</label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description..."
              rows={4}
              required
              className="w-full"
            />
          </div>
        </div>
        
        {/* Images */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-700">Product Image URL</label>
              <Input 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="w-full"
              />
              <p className="text-xs text-gray-500">Main product image for display</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="overlayImage" className="text-sm font-medium text-gray-700">Virtual Try-On Overlay</label>
              <Input 
                id="overlayImage"
                name="overlayImage"
                value={formData.overlayImage}
                onChange={handleChange}
                placeholder="/frames/glasses.png"
                className="w-full"
              />
              <p className="text-xs text-gray-500">3D overlay image for virtual try-on</p>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="specifications.frameWidth" className="text-sm font-medium text-gray-700">Frame Width (mm)</label>
              <Input 
                id="specifications.frameWidth"
                name="specifications.frameWidth"
                value={formData.specifications.frameWidth}
                onChange={handleChange}
                placeholder="140"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="specifications.lensWidth" className="text-sm font-medium text-gray-700">Lens Width (mm)</label>
              <Input 
                id="specifications.lensWidth"
                name="specifications.lensWidth"
                value={formData.specifications.lensWidth}
                onChange={handleChange}
                placeholder="52"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="specifications.bridgeWidth" className="text-sm font-medium text-gray-700">Bridge Width (mm)</label>
              <Input 
                id="specifications.bridgeWidth"
                name="specifications.bridgeWidth"
                value={formData.specifications.bridgeWidth}
                onChange={handleChange}
                placeholder="18"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="specifications.templeLength" className="text-sm font-medium text-gray-700">Temple Length (mm)</label>
              <Input 
                id="specifications.templeLength"
                name="specifications.templeLength"
                value={formData.specifications.templeLength}
                onChange={handleChange}
                placeholder="145"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="specifications.material" className="text-sm font-medium text-gray-700">Material</label>
              <Input 
                id="specifications.material"
                name="specifications.material"
                value={formData.specifications.material}
                onChange={handleChange}
                placeholder="e.g., Titanium, Acetate, Metal"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input 
                id="virtualTryOn"
                name="virtualTryOn"
                type="checkbox"
                checked={formData.virtualTryOn}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="virtualTryOn" className="text-sm font-medium text-gray-700">
                Enable Virtual Try-On
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input 
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Product is Active (visible to customers)
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Link href="/admin/products">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
