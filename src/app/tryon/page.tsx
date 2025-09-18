"use client";

import { useState } from "react";
import VirtualTryOn from "@/components/VirtualTryOn";
import ImageUploader from "@/components/ImageUploader";
import ProductSelector, { Product } from "@/components/ProductSelector";

const products: Product[] = [
  { id: "glasses1", name: "Classic Frames", image: "/frames/glasses.png", type: "glasses" },
  { id: "glasses2", name: "Modern Frames", image: "/frames/glasses2.png", type: "glasses" },
  { id: "glasses3", name: "Sunglasses", image: "/frames/glasses.png", type: "glasses" },
];

export default function TryOnPage() {
  const [useCamera, setUseCamera] = useState(true);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [verticalOffset, setVerticalOffset] = useState(0);

  const handleSelectProduct = (p: Product) => setSelectedProduct(p);

  const handleImageUpload = (imageDataUrl: string) => {
    setUserImage(imageDataUrl);
    setUseCamera(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Try-On</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProductSelector
            products={products}
            onSelectProduct={handleSelectProduct}
            selectedProductId={selectedProduct.id}
          />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Adjust Fit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4">
            <VirtualTryOn
              productImage={selectedProduct.image}
              useCamera={useCamera}
              userImageSrc={userImage}
              scaleFactor={scaleFactor}
              verticalOffset={verticalOffset}
              productType={selectedProduct.type as "glasses" | "hat" | "earrings"}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => { setUseCamera(true); setUserImage(null); }}
                className={`px-4 py-2 rounded-md ${useCamera ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                Use Camera
              </button>

              <button
                onClick={() => setUseCamera(false)}
                className={`px-4 py-2 rounded-md ${!useCamera ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                Use Uploaded Image
              </button>

              {!useCamera && <ImageUploader onImageUpload={handleImageUpload} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
