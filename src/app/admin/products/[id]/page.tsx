"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Next.js Image import

export default function EditProductPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({ name: "", price: "", image: "", overlayImage: "", stock: "" });

	const uploadFile = async (file: File, setField: (url: string) => void) => {
		setError("");
		const toDataUrl = () =>
			new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(String(reader.result || ""));
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		try {
			setUploading(true);
			const dataUrl = await toDataUrl();
			const res = await fetch("/api/upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ dataUrl }),
			});
			let data: any = undefined;
			if (res.ok) {
				data = await res.json();
				if (data?.url) {
					setField(data.url);
					return;
				}
			}
			const fd = new FormData();
			fd.append("file", file);
			const res2 = await fetch("/api/upload", { method: "POST", body: fd });
			const data2 = await res2.json().catch(() => ({}));
			if (res2.ok && data2?.url) setField(data2.url);
			else throw new Error(data2?.error || data?.error || "Upload failed");
		} catch (err: any) {
			console.error("Upload error:", err);
			setError(err?.message || "Upload failed");
			alert(err?.message || "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`/api/products/${params.id}`);
			if (!res.ok) return router.push("/admin/products");
			const p = await res.json();
			setForm({
				name: p.name || "",
				price: String(p.price ?? ""),
				image: p.image || "",
				overlayImage: p.overlayImage || "",
				stock: String(p.stock ?? ""),
			});
			setLoading(false);
		};
		load();
	}, [params.id, router]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		const res = await fetch(`/api/products/${params.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: form.name,
				price: parseFloat(form.price || "0"),
				image: form.image || undefined,
				overlayImage: form.overlayImage || undefined,
				stock: parseInt(form.stock || "0"),
			}),
		});
		setSaving(false);
		if (res.ok) router.push("/admin/products");
		else {
			const err = await res.json().catch(() => ({}));
			setError(err?.error || "Failed to update product");
			alert(err?.error || "Failed to update product");
		}
	};

	const del = async () => {
		if (!confirm("Delete this product?")) return;
		const res = await fetch(`/api/products/${params.id}`, { method: "DELETE" });
		if (res.ok) router.push("/admin/products");
		else alert("Failed to delete product");
	};

	if (loading) return <section className="max-w-xl mx-auto px-6 py-12">Loading...</section>;

	return (
		<section className="max-w-xl mx-auto px-6 py-12">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Edit Product</h1>
				<button onClick={del} className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg">Delete</button>
			</div>
			<form onSubmit={submit} className="space-y-4">
				{error && (
					<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
				)}
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
					<div className="flex gap-2 items-start">
						<input className="w-full border rounded-lg px-3 py-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
						<label className="px-3 py-2 border rounded-lg cursor-pointer">
							{uploading ? "Uploading..." : "Upload"}
							<input type="file" accept="image/*" className="hidden" onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) uploadFile(f, (url) => setForm((s) => ({ ...s, image: url })));
							}} />
						</label>
					</div>
					{form.image && (
						<Image
							src={form.image}
							alt="preview"
							width={96} // ✅ must set
							height={96}
							className="mt-2 h-24 w-24 object-cover rounded"
						/>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Overlay Image URL (PNG)</label>
					<div className="flex gap-2 items-start">
						<input className="w-full border rounded-lg px-3 py-2" value={form.overlayImage} onChange={(e) => setForm({ ...form, overlayImage: e.target.value })} />
						<label className="px-3 py-2 border rounded-lg cursor-pointer">
							{uploading ? "Uploading..." : "Upload"}
							<input type="file" accept="image/png" className="hidden" onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) uploadFile(f, (url) => setForm((s) => ({ ...s, overlayImage: url })));
							}} />
						</label>
					</div>
					{form.overlayImage && (
						<Image
							src={form.overlayImage}
							alt="overlay preview"
							width={96}
							height={96}
							className="mt-2 h-24 w-24 object-contain bg-white rounded"
						/>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Stock</label>
					<input type="number" className="w-full border rounded-lg px-3 py-2" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
				</div>
				<button disabled={saving} className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50">
					{saving ? "Saving..." : "Save Changes"}
				</button>
			</form>
		</section>
	);
}
