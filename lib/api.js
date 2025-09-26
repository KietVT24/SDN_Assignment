//const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_URL ||
//   process.env.NEXT_PUBLIC_SITE_URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // client → dùng URL tương đối

  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // server Vercel

  return 'http://localhost:3000'; // server dev
};
const API_BASE_URL = getBaseUrl();

const buildUrl = (pathWithQuery) => {
  // nếu base rỗng (trên client), dùng đường dẫn tương đối
  return API_BASE_URL ? `${API_BASE_URL}${pathWithQuery}` : pathWithQuery;
};


export async function fetchProducts({ page = 1, limit = 12, q = '', category = '', gender = '', season = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('limit', limit.toString())
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  if (gender) params.set('gender', gender)
  if (season) params.set('season', season)

  const url = buildUrl(`/api/products?${params.toString()}`)
  console.log('Fetching products from:', url)
  
  const response = await fetch(url)
  
  if (!response.ok) {
    console.error('Failed to fetch products:', response.status, response.statusText)
    throw new Error('Failed to fetch products')
  }
  
  const data = await response.json()
  console.log('Fetched products:', data)
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch products')
  }
  
  return data.data
}

export async function fetchProduct(id) {
  const response = await fetch(buildUrl(`/api/products/${id}`))
  
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch product')
  }
  
  return data.data
}

export async function createProduct(productData) {
  const response = await fetch(buildUrl(`/api/products`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create product')
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to create product')
  }
  
  return data.data
}

export async function updateProduct(id, productData) {
  const response = await fetch(buildUrl(`/api/products/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update product')
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to update product')
  }
  
  return data.data
}

export async function deleteProduct(id) {
  const response = await fetch(buildUrl(`/api/products/${id}`), {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete product')
  }
  
  return data.data
}
