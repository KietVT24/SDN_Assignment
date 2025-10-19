// components/product/ProductForm.js
"use client";
import { useState } from "react";

export default function ProductForm({ initial = {}, onSuccess }) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [price, setPrice] = useState(initial.price || "");
  const [imageUrl, setImageUrl] = useState(initial.image || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));
      if (file) formData.append("image", file);
      else formData.append("image", imageUrl);

      const method = initial._id ? "PUT" : "POST";
      const url = initial._id ? `/api/products/${initial._id}` : "/api/products";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Lỗi server");
      onSuccess?.(data.data || data.product || data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 rounded border bg-white/5" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 rounded border bg-white/5" />
      <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 rounded border bg-white/5" />
      <input type="url" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 rounded border bg-white/5" />
      <div>
        <label className="block text-sm mb-2">Or upload image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">
          {loading ? "Saving..." : initial._id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
