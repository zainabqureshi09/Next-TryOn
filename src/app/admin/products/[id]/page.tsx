"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Save, Eye, Image as ImageIcon, Box, Glasses, Ruler
} from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const isNewProduct = productId === "new";

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    price: 0,
    sku: "",
    description: "",
    category: "",
    stock: 0,
    isActive: true,
    images: [] as string[],
    tryOnEnabled: false,
    tryOnModel: "",
    tryOnSettings: {
      frameWidth: 0,
      frameHeight: 0,
      bridgeWidth: 0,
      templeLength: 0,
      frameColor: "#000000",
      lensColor: "transparent",
    },
  });

  const categories = ["men", "women", "sunglasses"];

  // Load product if editing
  useEffect(() => {
    if (!isNewProduct) {
      setIsLoading(true);
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            ...data,
            tryOnSettings: data.tryOnSettings || prev.tryOnSettings,
          }));
        })
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setIsLoading(false));
    }
  }, [productId, isNewProduct]);

  // Generic input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name.startsWith("tryOnSettings.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        tryOnSettings: {
          ...prev.tryOnSettings,
          [key]: type === "number" ? Number(value) : value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    }
  };

  // Images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newImages = [...form.images];
      Array.from(e.target.files).forEach((file) => {
        const fakeUrl = URL.createObjectURL(file);
        newImages.push(fakeUrl);
      });
      setForm((prev) => ({ ...prev, images: newImages }));
    }
  };

  // 3D model
  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fakeModelUrl = URL.createObjectURL(e.target.files[0]);
      setForm((prev) => ({
        ...prev,
        tryOnModel: fakeModelUrl,
        tryOnEnabled: true,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const method = isNewProduct ? "POST" : "PUT";
      const url = isNewProduct ? "/api/products" : `/api/products/${productId}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        const error = await res.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/products" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isNewProduct ? "Add New Product" : `Edit Product: ${form.name}`}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/shop/${productId}`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center hover:bg-gray-300"
            disabled={isNewProduct}
          >
            <Eye className="w-4 h-4 mr-2" /> Preview
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg flex items-center hover:bg-purple-800"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="tryon">Virtual Try-On</TabsTrigger>
        </TabsList>

        {/* DETAILS */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border p-2 rounded"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full border p-2 rounded"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {form.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRY-ON */}
        <TabsContent value="tryon">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Try-On</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} />
              {form.tryOnModel && (
                <p className="text-sm text-gray-600">3D Model uploaded: {form.tryOnModel}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(form.tryOnSettings).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium">{key}</label>
                    <input
                      type={typeof val === "number" ? "number" : "text"}
                      name={`tryOnSettings.${key}`}
                      value={val as any}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
