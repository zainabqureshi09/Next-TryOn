"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const p = await res.json();
        setForm({
          name: p?.name || "",
          addressLine1: p?.addressLine1 || "",
          addressLine2: p?.addressLine2 || "",
          city: p?.city || "",
          state: p?.state || "",
          postalCode: p?.postalCode || "",
          country: p?.country || "",
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) alert("Profile saved");
    else alert("Failed to save profile");
  };

  if (loading) return <section className="max-w-3xl mx-auto px-6 py-12">Loading...</section>;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address Line 1</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <button disabled={saving} className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}







