'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ProductCard from '@/components/product/ProductCard';
import { fetchProducts } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'T-Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Dress', 'Skirt', 'Shoes', 'Accessory'];
const GENDERS = ['All', 'Men', 'Women', 'Unisex'];
const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter'];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Khởi tạo từ URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const season = searchParams.get('season');
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page')) || 1;

    if (category) setSelectedCategory(category);
    if (gender) setSelectedGender(gender);
    if (season) setSelectedSeason(season);
    if (q) setSearchQuery(q);
    setCurrentPage(page);
  }, [searchParams]);

  // Gọi API
  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, selectedGender, selectedSeason]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadProducts();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  async function loadProducts() {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: 12,
        q: searchQuery.trim(),
        category: selectedCategory !== 'All' ? selectedCategory : '',
        gender: selectedGender !== 'All' ? selectedGender : '',
        season: selectedSeason !== 'All' ? selectedSeason : '',
      };

      const data = await fetchProducts(filters);

      setProducts(data?.items ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setTotalProducts(data?.total ?? 0);
    } catch (err) {
      console.error('Error loading products:', err);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        loadProducts();
      } else toast.error(data.error || 'Failed to delete');
    } catch {
      toast.error('Delete error');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = (overrides = {}) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedGender !== 'All') params.set('gender', selectedGender);
    if (selectedSeason !== 'All') params.set('season', selectedSeason);
    params.set('page', overrides.page?.toString() || currentPage.toString());
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end === totalPages) start = Math.max(1, end - maxVisible + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedGender !== 'All' || selectedSeason !== 'All' || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600 mb-6">Browse and filter our collection</p>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Category */}
          <div>
            <h3 className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Filter className="h-4 w-4 mr-2" /> Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gender + Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      selectedGender === g ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Season</label>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      selectedSeason === s ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Mode */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Result Info */}
        <p className="text-sm text-gray-600 mb-4">
          {totalProducts > 0 && (
            <>
              Showing {((currentPage - 1) * 12) + 1}–{Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
            </>
          )}
        </p>

        {/* Products */}
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting filters or search query</p>
            {hasActiveFilters && <Button onClick={() => window.location.reload()}>Clear Filters</Button>}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            <Suspense fallback={<ProductGridSkeleton />}>
              {products.map((product) => (
                <ProductCard key={product._id ?? product.id} product={product} onDelete={handleDelete} viewMode={viewMode} />
              ))}
            </Suspense>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>

            {getPageNumbers().map((num) => (
              <Button
                key={num}
                variant={num === currentPage ? 'default' : 'outline'}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-4">
          <div className="bg-gray-200 aspect-square rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}