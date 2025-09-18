"use client";

import Image from "next/image";

export type Product = {
  id: string;
  name: string;
  image: string;
  type?: string;
};

type Props = {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  selectedProductId?: string;
};

export default function ProductSelector({ products, onSelectProduct, selectedProductId }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Products</h2>
      <div className="space-y-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className={`w-full flex items-center gap-3 p-2 rounded ${selectedProductId === p.id ? "bg-purple-50 border border-purple-200" : "bg-white"}`}
          >
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" unoptimized />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{p.type}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
