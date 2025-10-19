'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, MapPin, Truck } from 'lucide-react';
import CartSummary from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Vietnam',
    postalCode: '',
    notes: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
    } else if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      const data = await res.json();
      
      if (data.success) {
        if (!data.data || data.data.items.length === 0) {
          toast.error('Your cart is empty');
          router.push('/cart');
          return;
        }
        setCart(data.data);
      } else {
        toast.error(data.error || 'Failed to load cart');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to load cart');
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode
          },
          notes: formData.notes,
          paymentMethod: formData.paymentMethod
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Order placed successfully!');
        router.push(`/orders/${data.data._id}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Place order error:', error);
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ho Chi Minh City"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Vietnam"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="700000"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-3 font-medium">Cash on Delivery</span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-3 font-medium">Credit/Debit Card (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold">Order Notes</h2>
                </div>
                
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for your order..."
                  rows={4}
                />
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {cart?.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4 pb-3 border-b last:border-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                totalAmount={cart?.totalAmount || 0}
                itemCount={cart?.items.length || 0}
                isCheckout={true}
              />
              
              <Button
                type="submit"
                className="w-full mt-4"
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}