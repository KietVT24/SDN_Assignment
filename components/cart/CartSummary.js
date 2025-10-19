'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartSummary({ totalAmount, itemCount, isCheckout = false }) {
  const shipping = totalAmount > 0 ? 10 : 0; // $10 flat shipping
  const tax = totalAmount * 0.1; // 10% tax
  const total = totalAmount + shipping + tax;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-indigo-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {!isCheckout && (
        <>
          <Link href="/checkout">
            <Button className="w-full mb-3" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </>
      )}

      {/* Benefits */}
      <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Free returns within 30 days
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secure checkout
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Fast shipping
        </div>
      </div>
    </div>
  );
}