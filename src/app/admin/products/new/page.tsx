"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image"; // ✅ Next.js image component

export default function NewProductPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [form, setForm] = useState({
		name: "",
		price: "",
		image: "",
		overlayImage: "",
		stock: "",
	});
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");

	// File upload handler
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
			if (res2.ok && data2?.url) {
				setField(data2.url);
			} else {
				throw new Error(data2?.error || data?.error || "Upload failed");
			}
		} catch (err: any) {
			console.error("Upload error:", err);
			setError(err?.message || "Upload failed");
			alert(err?.message || "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	// Submit handler
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: form.name.trim(),
					price: parseFloat(form.price) || 0,
					image: form.image || undefined,
					overlayImage: form.overlayImage || undefined,
					stock: parseInt(form.stock) || 0,
				}),
			});

			if (res.ok) {
				router.push("/admin/products");
			} else {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.error || "Failed to create product");
			}
		} catch (err: any) {
			console.error("Submit error:", err);
			setError(err?.message || "Something went wrong");
			alert(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="max-w-xl mx-auto px-6 py-12">
			<h1 className="text-2xl font-bold mb-6">New Product</h1>
			{status === "loading" && (
				<p className="text-sm text-gray-500">Checking permissions…</p>
			)}
			{status !== "loading" && (!session || (session.user as any)?.role !== "admin") && (
				<div className="mb-6 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
					Unauthorized. Please sign in as an admin to create products.
				</div>
			)}
			<form onSubmit={submit} className="space-y-4">
				{error && (
					<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
				)}

				{/* Product Name */}
				<div>
					<label className="block text-sm font-medium mb-1">Name</label>
					<input
						className="w-full border rounded-lg px-3 py-2"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
				</div>

				{/* Price */}
				<div>
					<label className="block text-sm font-medium mb-1">Price</label>
					<input
						type="number"
						step="0.01"
						className="w-full border rounded-lg px-3 py-2"
						value={form.price}
						onChange={(e) => setForm({ ...form, price: e.target.value })}
						required
					/>
				</div>

				{/* Image */}
				<div>
					<label className="block text-sm font-medium mb-1">Image URL</label>
					<div className="flex gap-2 items-start">
						<input
							className="w-full border rounded-lg px-3 py-2"
							value={form.image}
							onChange={(e) => setForm({ ...form, image: e.target.value })}
						/>
						<label className="px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
							{uploading ? "Uploading..." : "Upload"}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								disabled={uploading}
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f)
										uploadFile(f, (url) =>
											setForm((s) => ({ ...s, image: url }))
										);
								}}
							/>
						</label>
					</div>
					{form.image && (
						<Image
							src={form.image}
							alt="preview"
							width={96}
							height={96}
							className="mt-2 h-24 w-24 object-cover rounded"
						/>
					)}
				</div>

				{/* Overlay Image */}
				<div>
					<label className="block text-sm font-medium mb-1">Overlay Image URL (PNG)</label>
					<div className="flex gap-2 items-start">
						<input
							className="w-full border rounded-lg px-3 py-2"
							value={form.overlayImage}
							onChange={(e) =>
								setForm({ ...form, overlayImage: e.target.value })
							}
						/>
						<label className="px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
							{uploading ? "Uploading..." : "Upload"}
							<input
								type="file"
								accept="image/png"
								className="hidden"
								disabled={uploading}
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f)
										uploadFile(f, (url) =>
											setForm((s) => ({ ...s, overlayImage: url }))
										);
								}}
							/>
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

				{/* Stock */}
				<div>
					<label className="block text-sm font-medium mb-1">Stock</label>
					<input
						type="number"
						className="w-full border rounded-lg px-3 py-2"
						value={form.stock}
						onChange={(e) => setForm({ ...form, stock: e.target.value })}
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={loading || uploading}
					className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50"
				>
					{loading ? "Creating..." : "Create"}
				</button>
			</form>
		</section>
	);
}
