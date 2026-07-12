import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text(); 
    
    let event;
    try {
      // Use the correct method for signature verification
      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }
      
      // Parse the webhook payload
      event = JSON.parse(rawBody);
    } catch (error) {
      console.log('Signature verification error:', error);
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle Razorpay payment captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      console.log('Payment captured:', payment);
      console.log('Razorpay Order ID:', razorpayOrderId);
      
      if (razorpayOrderId) {
        await connectDb();
        
        // Find the order by the razorpay order ID stored in paymentDetails
        const order = await Order.findOne({ "paymentDetails.stripeSessionId": razorpayOrderId });
        
        if (order) {
          await Order.findByIdAndUpdate(order._id, {
            isPaid: true,
            paymentDetails: {
              stripePaymentId: payment.id,
              stripeSessionId: razorpayOrderId,
            },
          });
          console.log('Order marked as paid:', order._id);
        } else {
          console.log('Order not found for razorpay order ID:', razorpayOrderId);
        }
      }
    }

    return NextResponse.json(
      { message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log('Webhook error:', error);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
