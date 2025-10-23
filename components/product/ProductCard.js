'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onDelete, viewMode = 'grid' }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const isOwner = session?.user?.id === product.createdBy;

  // ✅ Định dạng số theo chuẩn Việt Nam + thêm "đ"
  const formatCurrency = (value) => {
    if (value == null || value === '') return '0đ';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(num)) return '0đ';
    return `${num.toLocaleString('vi-VN')}đ`;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      router.push('/auth/login?callbackUrl=/products');
      return;
    }

    try {
      setAdding(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Đã thêm vào giỏ hàng!');
      } else {
        toast.error(data.error || 'Không thể thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      toast.error('Thêm sản phẩm thất bại');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete) {
      onDelete(product._id);
    }
  };

  // ================= LIST VIEW =================
  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product._id}`}>
        <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex">
          {/* Ảnh sản phẩm */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name || 'Ảnh sản phẩm'}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(product.price)}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {product.category}
                  </span>
                )}
                {product.gender && (
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                    {product.gender}
                  </span>
                )}
                {product.season && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                    {product.season}
                  </span>
                )}
              </div>
            </div>

            {/* Nút thao tác */}
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1"
                aria-label="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </Button>

              {session && isOwner && (
                <>
                  <Link href={`/products/edit/${product._id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="text-red-600 hover:bg-red-50"
                    aria-label="Xóa sản phẩm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ================= GRID VIEW (default) =================
  return (
    <Link href={`/products/${product._id}`}>
      <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Ảnh sản phẩm */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name || 'Ảnh sản phẩm'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Nút chỉnh sửa/xóa */}
          {session && isOwner && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link href={`/products/edit/${product._id}`} onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white shadow-md hover:bg-gray-50 rounded-md"
                  aria-label="Chỉnh sửa sản phẩm"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDelete}
                className="bg-white shadow-md hover:bg-red-50 hover:text-red-600 rounded-md"
                aria-label="Xóa sản phẩm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.gender && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                {product.gender}
              </span>
            )}
            {product.season && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                {product.season}
              </span>
            )}
          </div>

          {/* Giá + nút thêm */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 mt-auto">
            <span className="text-lg font-bold text-indigo-600">
              {formatCurrency(product.price)}
            </span>

            <Button
              onClick={handleAddToCart}
              disabled={adding}
              size="sm"
              className="gap-1.5 whitespace-nowrap"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {adding ? 'Đang thêm...' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
