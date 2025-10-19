import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

// Note: This is a simplified payment flow
// For production, integrate with Stripe, PayOS, or other payment gateways

// POST: Create payment intent / Process payment
export async function POST(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { orderId, paymentMethod = 'stripe' } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.user.toString() !== token.sub) {
      return NextResponse.json(
        { error: 'Forbidden - You cannot pay for this order' },
        { status: 403 }
      );
    }

    // Check if already paid
    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    /* 
    // STRIPE INTEGRATION EXAMPLE (Uncomment and configure)
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Amount in cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: token.sub
      }
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
    */

    // MOCK PAYMENT (For demo purposes)
    // In production, replace this with actual payment gateway integration
    
    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

    if (paymentSuccess) {
      // Update order status
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.paidAt = new Date();
      order.paymentMethod = paymentMethod;
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          orderId: order._id,
          paymentStatus: 'paid',
          redirectUrl: `/payment/success?orderId=${order._id}`
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Payment failed',
          message: 'Your payment could not be processed. Please try again.'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Check payment status
export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.user.toString() !== token.sub) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        totalAmount: order.totalAmount,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status', details: error.message },
      { status: 500 }
    );
  }
}