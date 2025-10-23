import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { fetchProducts } from '@/lib/api'

// Load ProductCard on client only (if your ProductCard uses client hooks).
// Show a server-side skeleton while it loads on the client.
const ProductCard = dynamic(() => import('@/components/product/ProductCard'), {
  ssr: false,
  loading: () => <ProductGridSkeleton />,
})

export default async function HomePage({ searchParams }) {
  // Merge behaviour: this page keeps the colorful hero + categories (from file A)
  // and also fetches & shows products, filters, pagination (from file B).
  const page = parseInt(searchParams?.page) || 1
  const q = searchParams?.q || ''
  const category = searchParams?.category || ''
  const gender = searchParams?.gender || ''
  const season = searchParams?.season || ''

  let productsData
  try {
    productsData = await fetchProducts({ page, q, category, gender, season, limit: 20 })
  } catch (error) {
    console.error('Error fetching products:', error)
    productsData = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 }
  }

  const { items: products = [], page: currentPage = 1, totalPages = 1, total = 0 } = productsData || {}

  return (
    <div className="min-h-screen">
      {/* Hero Section (from file 1) */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Welcome to Modern Store</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-2xl mx-auto">
              Discover the latest fashion trends and elevate your style with our curated collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 min-w-[200px]">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 min-w-[200px]">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Features Section (from file 1) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over 1,000,000đ</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600">Carefully curated items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section (from file 1) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Shop by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'T-Shirts', emoji: '👕', color: 'from-blue-400 to-blue-600' },
              { name: 'Hoodies', emoji: '🧥', color: 'from-purple-400 to-purple-600' },
              { name: 'Jeans', emoji: '👖', color: 'from-indigo-400 to-indigo-600' },
              { name: 'Dresses', emoji: '👗', color: 'from-pink-400 to-pink-600' },
              { name: 'Shoes', emoji: '👟', color: 'from-green-400 to-green-600' },
              { name: 'Jackets', emoji: '🧥', color: 'from-orange-400 to-orange-600' },
              { name: 'Skirts', emoji: '👚', color: 'from-red-400 to-red-600' },
              { name: 'Accessories', emoji: '👜', color: 'from-yellow-400 to-yellow-600' },
            ].map((categoryItem) => (
              <Link key={categoryItem.name} href={`/products?category=${encodeURIComponent(categoryItem.name)}`}>
                <div className={`bg-gradient-to-br ${categoryItem.color} rounded-lg p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
                  <div className="text-4xl mb-2">{categoryItem.emoji}</div>
                  <h3 className="font-semibold">{categoryItem.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section (merged behaviour from file 2) */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {q ? `Search results for "${q}"` : 'Featured & Latest Products'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection — use filters or search to narrow results.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">👕</div>
              <h3 className="text-3xl font-bold mb-4">No products found</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {q ? 'Try adjusting your search keywords or filters.' : 'Be the first to add a product!'}
              </p>
              <Button asChild size="lg">
                <Link href="/products/new">Add product</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  // ProductCard loaded client-side for interactive cards; if you prefer server rendering, replace with server markup.
                  <ProductCard key={product._id ?? product.id ?? product.slug} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchQuery={q}
                  category={category}
                  gender={gender}
                  season={season}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section (from file 1) */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of happy customers and find your perfect style today</p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Browse All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section (from file 1) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">{total >= 10000 ? '10K+' : total}</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{Math.min(500, total)}</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">50+</div>
              <div className="text-gray-600">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-br from-gray-200 to-gray-100 aspect-square rounded-lg mb-4" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </>
  )
}

function Pagination({ currentPage, totalPages, searchQuery, category, gender, season }) {
  const prevPage = Math.max(1, currentPage - 1)
  const nextPage = Math.min(totalPages, currentPage + 1)

  const createPageUrl = (page) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (searchQuery) params.set('q', searchQuery)
    if (category) params.set('category', category)
    if (gender) params.set('gender', gender)
    if (season) params.set('season', season)
    return `/?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button asChild variant="outline" disabled={currentPage === 1}>
        <Link href={createPageUrl(prevPage)} className="inline-flex items-center">Previous</Link>
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
          if (pageNum > totalPages) return null

          return (
            <Button key={pageNum} asChild variant={pageNum === currentPage ? 'default' : 'outline'} size="sm">
              <Link href={createPageUrl(pageNum)}>{pageNum}</Link>
            </Button>
          )
        })}
      </div>

      <Button asChild variant="outline" disabled={currentPage === totalPages}>
        <Link href={createPageUrl(nextPage)} className="inline-flex items-center">Next</Link>
      </Button>
    </div>
  )
}