import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay with error handling
let razorpay: Razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Razorpay credentials not configured");
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
}

export async function POST(req: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { message: "Payment gateway not configured. Please contact admin." },
        { status: 503 }
      );
    }

    await connectDb();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: "Please login to place an order" }, { status: 401 });
    }
    
    if (!session.user?.id) {
      return NextResponse.json({ message: "User ID not found. Please login again." }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, address, amount, deliveryCharge, serviceCharge } = body;

    if (!productId || !quantity) {
      return NextResponse.json({ message: "Product and quantity are required" }, { status: 400 });
    }

    // Convert string numbers to actual numbers
    const parsedAmount = Number(amount);
    const parsedDeliveryCharge = Number(deliveryCharge);
    const parsedServiceCharge = Number(serviceCharge);
    const parsedQuantity = Number(quantity);

    if (isNaN(parsedAmount) || isNaN(parsedDeliveryCharge) || isNaN(parsedServiceCharge)) {
      return NextResponse.json({ message: "Invalid amount values" }, { status: 400 });
    }

    if (!address?.name || !address?.phone || !address?.address || !address?.city || !address?.pincode) {
      return NextResponse.json({ message: "Complete address is required" }, { status: 400 });
    }

    const userId = session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!user.cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const cartItem = user.cart.find((item: { product: string }) =>
      item.product.toString() === productId.toString()
    );

    if (!cartItem) {
      return NextResponse.json({ message: "Product not in cart" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.stock < parsedQuantity) {
      return NextResponse.json(
        { message: `Insufficient stock. Available: ${product.stock}` },
        { status: 400 }
      );
    }

    const productsTotal = product.price * parsedQuantity;

    // Create order
    const order = await Order.create({
      buyer: userId,
      products: [
        {
          product: product._id,
          quantity: parsedQuantity,
          price: product.price,
        },
      ],
      productVendor: product.vendor,
      productsTotal,
      deliveryCharge: parsedDeliveryCharge,
      serviceCharge: parsedServiceCharge,
      totalAmount: parsedAmount,
      paymentMethod: "stripe",
      isPaid: false,
      orderStatus: "pending",
      address,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(parsedAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
        order_id: order._id.toString(),
        user_id: userId,
      },
    });

    // Update order with razorpay order ID
    await Order.findByIdAndUpdate(order._id, {
      paymentDetails: {
        stripeSessionId: razorpayOrder.id,
      },
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        razorpayOrderId: razorpayOrder.id,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
        order: order,
      },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error("Online payment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
