"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", price: "", image: "", overlayImage: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, setField: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: reader.result }),
      });
      setUploading(false);
      const data = await res.json();
      if (res.ok && data?.url) setField(data.url);
      else alert(data?.error || "Upload failed");
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price || "0"),
        image: form.image || undefined,
        overlayImage: form.overlayImage || undefined,
        stock: parseInt(form.stock || "0"),
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin/products");
    else alert("Failed to create product");
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">New Product</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <div className="flex gap-2">
            <input className="w-full border rounded-lg px-3 py-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <label className="px-3 py-2 border rounded-lg cursor-pointer">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, (url) => setForm((s) => ({ ...s, image: url })));
              }} />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Overlay Image URL (PNG)</label>
          <div className="flex gap-2">
            <input className="w-full border rounded-lg px-3 py-2" value={form.overlayImage} onChange={(e) => setForm({ ...form, overlayImage: e.target.value })} />
            <label className="px-3 py-2 border rounded-lg cursor-pointer">
              Upload
              <input type="file" accept="image/png" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, (url) => setForm((s) => ({ ...s, overlayImage: url })));
              }} />
            </label>
          </div>
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <button disabled={loading} className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50">
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </section>
  );
}
