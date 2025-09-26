import { useState } from 'react';

export default function ProductForm({ initial = null, onSaved, method = 'POST', action = '/api/products' }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price?.toString() || '',
    imageUrl: initial?.image || '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('price', String(Number(form.price)));
        fd.append('image', file);
        res = await fetch(action, { method, body: fd });
      } else {
        res = await fetch(action, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, description: form.description, price: Number(form.price), image: form.imageUrl }),
        });
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed');
      setMessage('Saved successfully');
      if (onSaved) onSaved(json.data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      {message ? <p>{message}</p> : null}
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
      <div style={{ display: 'grid', gap: 8 }}>
        <input type="url" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <span>OR</span>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}


