"use client";
import React from "react";

type Product = {
  id: string;
  name: string;
  modelUrl: string;
  thumbnail: string;
};

interface Props {
  products: Product[];
  onSelect: (url: string) => void;
}

export default function ProductSelector({ products, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect(p.modelUrl)}
          className="cursor-pointer border rounded-lg shadow hover:scale-105 transition"
        >
          <img
            src={p.thumbnail}
            alt={p.name}
            className="w-full h-24 object-contain p-2"
          />
          <p className="text-center text-sm font-medium py-2">{p.name}</p>
        </div>
      ))}
    </div>
  );
}
