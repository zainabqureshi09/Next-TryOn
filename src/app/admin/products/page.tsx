"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Filter, Download, Upload, Trash2, Eye, Edit, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to import products: ${res.status}`);
      }

      const result = await res.json();
      toast.success("Import Successful", {
        description: `${result.created} products created, ${result.updated} products updated.`,
      });
      fetchProducts();
    } catch (err) {
      console.error("Error importing products:", err);
      toast.error("Import Failed", {
        description: "Please check the file and try again.",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products`, { 
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data.products || data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Error", {
        description: "Failed to load products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);

      toast.success("Success", {
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error", {
        description: "Failed to delete product. Please try again.",
      });
    }
  }

  const categories = ["All", "Men", "Women", "Sunglasses"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Product Management</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg flex items-center hover:bg-purple-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
                    <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center hover:bg-gray-300 transition-colors disabled:opacity-50">
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-2"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </>
            )}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
                    <button 
            onClick={() => window.open('/api/products/export', '_blank')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value.toLowerCase())}
            >
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Try-On</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  {/* Product Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 mr-3 bg-gray-100 rounded-md overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {p.description?.substring(0, 50) || "No description"}
                          {p.description?.length > 50 ? "..." : ""}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">{p.category || "Uncategorized"}</td>

                  {/* Price */}
                  <td className="py-4 px-4">${Number(p.price).toFixed(2)}</td>

                  {/* Stock */}
                  <td className="py-4 px-4">
                    <div
                      className={`text-sm font-medium ${
                        (p.stock || 0) > 10
                          ? "text-green-600"
                          : (p.stock || 0) > 0
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {p.stock || 0} units
                    </div>
                  </td>

                  {/* Try-On */}
                  <td className="py-4 px-4">
                    {p.tryOnEnabled ? (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/edit/${p._id}`}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/shop/${p._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ProductsPage;
