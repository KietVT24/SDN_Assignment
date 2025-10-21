'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }) {
  const { product, quantity, price } = item;

  if (!product) {
    return null;
  }

  const handleIncrease = () => {
    onUpdateQuantity(product._id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product._id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(product._id);
  };

  const subtotal = price * quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {price.toLocaleString('vi-VN')}đ / sản phẩm
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {product.category && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              {product.category}
            </span>
          )}
          {product.gender && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              {product.gender}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrease}
            disabled={isUpdating || quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrease}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="text-right mb-2">
          <p className="text-lg font-bold text-gray-900">
            {subtotal.toLocaleString('vi-VN')}đ
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa
        </Button>
      </div>
    </div>
  );
}
