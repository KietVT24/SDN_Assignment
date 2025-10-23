'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Package, MapPin, CreditCard, Calendar, 
  CheckCircle, Clock, Truck, XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-700 bg-yellow-100', icon: Clock },
  paid: { label: 'Paid', color: 'text-green-700 bg-green-100', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-blue-700 bg-blue-100', icon: Package },
  shipped: { label: 'Shipped', color: 'text-indigo-700 bg-indigo-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-700 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-100', icon: XCircle }
};

export default function OrderDetailPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/orders');
    } else if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error(data.error || 'Order not found');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to load order');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await res.json();
      
      if (data.success) {
        setOrder(data.data);
        toast.success('Order cancelled successfully');
      } else {
        toast.error(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const subtotal = order.totalAmount;
  const shipping = subtotal > 0 ? 10000 : 0; // Logic từ CartSummary
  const tax = subtotal * 0.1; // Logic từ CartSummary
  const total = subtotal + shipping + tax;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
              </h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {orderDate}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-5 w-5 mr-2" />
                {statusInfo.label}
              </span>
              
              {order.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-6 w-6 mr-2 text-indigo-600" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
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
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.price.toLocaleString('vi-VN')}đ × {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-indigo-600" />
                Shipping Address
              </h2>
              
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.city && <p>{order.shippingAddress.city}</p>}
                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{tax.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">
                    {total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-indigo-600" />
                Payment
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At:</span>
                    <span className="font-medium">
                      {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}