import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      ) : null}
      <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
      <p style={{ color: '#666' }}>${product.price}</p>
      <Link href={`/products/${product._id}`}>View</Link>
    </div>
  );
}


