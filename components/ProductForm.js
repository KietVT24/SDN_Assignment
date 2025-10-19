"use client";

import { useState } from "react";

/**
 * ProductForm
 *
 * Props:
 * - initial: product object for edit (optional). If provided, component will default to PUT and action will append /{initial._id} unless `forceAction` provided.
 * - onSaved: callback(result) when saved
 * - method: default HTTP method for create (default 'POST')
 * - action: base API url (default '/api/products')
 * - forceAction: if you want to override auto-append behavior when editing (optional)
 */
export default function ProductForm({
  initial = null,
  onSaved,
  method = "POST",
  action = "/api/products",
  forceAction = undefined,
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price != null ? String(initial.price) : "",
    imageUrl: initial?.image || "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // If editing (initial present), use PUT and append id to action unless forceAction is provided
  const finalMethod = initial ? "PUT" : method;
  const finalAction = initial ? `${action.replace(/\/$/, "")}/${initial._id}` : (forceAction || action);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let res;
      // prefer FormData when a file was chosen
      if (file) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", String(Number(form.price || 0)));
        fd.append("image", file);
        // you can still include imageUrl as fallback (server will pick file over URL)
        if (form.imageUrl) fd.append("imageUrl", form.imageUrl);

        res = await fetch(finalAction, {
          method: finalMethod,
          body: fd,
        });
      } else {
        // send JSON; server expects number for price
        const payload = {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.imageUrl || "",
        };

        res = await fetch(finalAction, {
          method: finalMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json().catch(() => ({ success: res.ok, data: null }));
      if (!res.ok || json.success === false) {
        // try to show server-provided error
        const errMsg = json?.error || json?.message || `Request failed (${res.status})`;
        throw new Error(errMsg);
      }

      setMessage("Saved successfully");
      // Call onSaved with returned data when available, else raw json
      if (onSaved) onSaved(json.data ?? json);
    } catch (err) {
      setMessage(err?.message || "Error while saving");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md" aria-live="polite">
      {message ? (
        <div className={`rounded px-3 py-2 ${message.includes("success") ? "bg-green-800/40" : "bg-red-800/40"}`}>
          <p className="text-sm">{message}</p>
        </div>
      ) : null}

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full px-3 py-2 rounded border bg-white/5"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        className="w-full px-3 py-2 rounded border bg-white/5"
      />

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
        className="w-full px-3 py-2 rounded border bg-white/5"
      />

      <div className="grid gap-2">
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full px-3 py-2 rounded border bg-white/5"
        />
        <div className="text-center text-sm text-muted-foreground">OR</div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        {file ? <div className="text-xs text-muted-foreground">Selected file: {file.name}</div> : null}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : initial ? "Update product" : "Create product"}
        </button>
      </div>
    </form>
  );
}




// import { useState } from 'react';

// export default function ProductForm({ initial = null, onSaved, method = 'POST', action = '/api/products' }) {
//   const [form, setForm] = useState({
//     name: initial?.name || '',
//     description: initial?.description || '',
//     price: initial?.price?.toString() || '',
//     imageUrl: initial?.image || '',
//   });
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       let res;
//       if (file) {
//         const fd = new FormData();
//         fd.append('name', form.name);
//         fd.append('description', form.description);
//         fd.append('price', String(Number(form.price)));
//         fd.append('image', file);
//         res = await fetch(action, { method, body: fd });
//       } else {
//         res = await fetch(action, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: form.name, description: form.description, price: Number(form.price), image: form.imageUrl }),
//         });
//       }
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error || 'Failed');
//       setMessage('Saved successfully');
//       if (onSaved) onSaved(json.data);
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
//       {message ? <p>{message}</p> : null}
//       <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
//       <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
//       <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
//       <div style={{ display: 'grid', gap: 8 }}>
//         <input type="url" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
//         <span>OR</span>
//         <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
//       </div>
//       <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
//     </form>
//   );
// }


