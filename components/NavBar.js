import Link from 'next/link';

export default function NavBar({ withSearch = false, defaultQuery = '' }) {
  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee' }}>
      <Link href="/">Home</Link>
      <Link href="/products/create">Create Product</Link>
      {withSearch ? (
        <form method="get" action="/" style={{ marginLeft: 'auto' }}>
          <input name="q" placeholder="Search by name" defaultValue={defaultQuery} />
          <button type="submit">Search</button>
        </form>
      ) : null}
    </nav>
  );
}


