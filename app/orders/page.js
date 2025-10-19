'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Filter } from 'lucide-react';
import OrderItem from '@/components/order/OrderItem';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/orders');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router, pagination.page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">View and track your orders</p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            
            {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
            
            {statusFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusFilter('')}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders found
            </h2>
            <p className="text-gray-600 mb-6">
              {statusFilter 
                ? `You don't have any ${statusFilter} orders.`
                : "You haven't placed any orders yet."}
            </p>
            <Button onClick={() => router.push('/products')} size="lg">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {orders.map((order) => (
                <OrderItem key={order._id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.page ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}