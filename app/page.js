import { Suspense } from 'react'
import { fetchProducts } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Filter, Grid, List, Star, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1
  const q = searchParams.q || ''
  const category = searchParams.category || ''
  const gender = searchParams.gender || ''
  const season = searchParams.season || ''
  
  let productsData
  try {
    productsData = await fetchProducts({ page, q, category, gender, season, limit: 20 })
  } catch (error) {
    console.error('Error fetching products:', error)
    productsData = { items: [], page: 1, limit: 20, total: 0, totalPages: 1 }
  }

  const { items: products, page: currentPage, totalPages } = productsData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Fashion <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Forward</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Khám phá bộ sưu tập thời trang hiện đại với phong cách độc đáo và chất lượng cao cấp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-white/90">
                <Link href="#products">Khám phá ngay</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-indigo-900">
                <Link href="/products/new">Thêm sản phẩm</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{productsData.total}</div>
              <div className="text-sm text-muted-foreground">Sản phẩm</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Danh mục</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Giới tính</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Mùa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {q ? `Kết quả tìm kiếm "${q}"` : 'Tất cả sản phẩm'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bộ sưu tập đầy đủ các sản phẩm thời trang hiện đại, từ casual đến formal
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <FilterButton active={!category} href="/">Tất cả</FilterButton>
              <FilterButton active={category === 'T-Shirt'} href="/?category=T-Shirt">Áo thun</FilterButton>
              <FilterButton active={category === 'Hoodie'} href="/?category=Hoodie">Hoodie</FilterButton>
              <FilterButton active={category === 'Jacket'} href="/?category=Jacket">Áo khoác</FilterButton>
              <FilterButton active={category === 'Jeans'} href="/?category=Jeans">Quần jeans</FilterButton>
              <FilterButton active={category === 'Dress'} href="/?category=Dress">Váy</FilterButton>
              <FilterButton active={category === 'Shoes'} href="/?category=Shoes">Giày</FilterButton>
              <FilterButton active={category === 'Accessory'} href="/?category=Accessory">Phụ kiện</FilterButton>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">👕</div>
              <h3 className="text-3xl font-bold mb-4">Không tìm thấy sản phẩm</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                {q ? 'Hãy thử điều chỉnh từ khóa tìm kiếm của bạn' : 'Hãy là người đầu tiên thêm sản phẩm!'}
              </p>
              <Button asChild size="lg">
                <Link href="/products/new">Thêm sản phẩm</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
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
                  category={category}
                  gender={gender}
                  season={season}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng tạo phong cách riêng?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng thời trang và khám phá những xu hướng mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-purple-600 hover:bg-white hover:text-indigo-600">
              <Link href="/products/new">Thêm sản phẩm mới</Link>
            </Button>
          </div>
        </div>  
      </section>
    </div>
  )
}

function FilterButton({ active, href, children }) {
  return (
    <Button
      asChild
      variant={active ? "default" : "outline"}
      size="sm"
      className={active ? "bg-primary text-primary-foreground" : ""}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-br from-muted to-muted/50 aspect-square rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </div>
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
      <Button
        asChild
        variant="outline"
        disabled={currentPage === 1}
      >
        <Link href={createPageUrl(prevPage)} className="inline-flex items-center">
          Previous
        </Link>
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
          if (pageNum > totalPages) return null
          
          return (
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
          )
        })}
      </div>

      <Button
        asChild
        variant="outline"
        disabled={currentPage === totalPages}
      >
        <Link href={createPageUrl(nextPage)} className="inline-flex items-center">
          Next
          {/* <ChevronRight className="h-4 w-4 ml-2" /> */}
        </Link>
      </Button>
    </div>  
  )
}
