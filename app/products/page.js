import { Suspense } from 'react'
import { fetchProducts } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'All Products - Clothing Store',
  description: 'Browse all products in our clothing store',
}

export const revalidate = 0

export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1
  const q = searchParams.q || ''
  
  let productsData
  try {
    productsData = await fetchProducts({ page, q })
  } catch (error) {
    console.error('Products page - Error fetching:', error)
    productsData = { items: [], page: 1, limit: 12, total: 0, totalPages: 1 }
  }

  const { items: products, page: currentPage, totalPages, limit, total } = productsData

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            {q ? `Search results for "${q}"` : 'Browse our complete collection'}
          </p>
        </div>
      </div>

      {/* Results Count - FIXED */}
      {products.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, total)} of {total} products
          </p>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👕</div>
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {q ? 'Try adjusting your search terms' : 'Be the first to add a product!'}
          </p>
          <Button asChild>
            <Link href="/products/new">Add Product</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <Suspense fallback={<ProductGridSkeleton />}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Suspense>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              searchQuery={q} 
            />
          )}
        </>
      )}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted aspect-square rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </>
  )
}

function Pagination({ currentPage, totalPages, searchQuery }) {
  const prevPage = Math.max(1, currentPage - 1)
  const nextPage = Math.min(totalPages, currentPage + 1)
  
  const createPageUrl = (page) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (searchQuery) params.set('q', searchQuery)
    return `/products?${params.toString()}`
  }

  // FIXED: Tính toán đúng range của page numbers
  const getPageNumbers = () => {
    const maxVisible = 5
    const pages = []
    
    if (totalPages <= maxVisible) {
      // Hiển thị tất cả nếu ít hơn hoặc bằng 5 trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Logic hiển thị khi có nhiều hơn 5 trang
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + maxVisible - 1)
      
      // Điều chỉnh startPage nếu endPage đã chạm totalPages
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisible + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        asChild
        variant="outline"
        disabled={currentPage === 1}
      >
        <Link href={createPageUrl(prevPage)} className="inline-flex items-center" >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Link>
      </Button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            asChild
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
          >
            <Link href={createPageUrl(pageNum)}>
              {pageNum}
            </Link>
          </Button>
        ))}
      </div>

      <Button
        asChild
        variant="outline"
        disabled={currentPage === totalPages}
      >
        <Link href={createPageUrl(nextPage)} className="inline-flex items-center" >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}