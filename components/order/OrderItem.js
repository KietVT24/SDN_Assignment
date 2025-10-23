'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-700 bg-yellow-100',
    icon: Clock
  },
  paid: {
    label: 'Paid',
    color: 'text-green-700 bg-green-100',
    icon: CheckCircle
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-700 bg-blue-100',
    icon: Package
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-700 bg-indigo-100',
    icon: Truck
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700 bg-green-100',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700 bg-red-100',
    icon: XCircle
  }
};

export default function OrderItem({ order }) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-mono font-semibold text-gray-900">
                {order.orderNumber || `ORD-${order._id.slice(-8).toUpperCase()}`}
              </p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-gray-500">Date</p>
              <div className="flex items-center text-gray-900">
                <Calendar className="h-4 w-4 mr-1" />
                {orderDate}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {status.label}
            </span>
            <span className="text-lg font-bold text-gray-900">
            {order.totalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
          
          {order.items.length > 3 && (
            <p className="text-sm text-gray-500 text-center">
              + {order.items.length - 3} more items
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Link href={`/orders/${order._id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {order.status === 'pending' && (
            <Button 
              variant="ghost" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}