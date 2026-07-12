import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import Product from "@/model/product.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    
   
    
    if (!session) {
      return NextResponse.json({ message: "No session found. Please login." }, { status: 401 });
    }
    
    if (!session.user?.id) {
      console.log("COD Order - No user ID in session");
      return NextResponse.json({ message: "User ID not found in session. Please login again." }, { status: 401 });
    }
    
    if (!session.user?.email) {
      console.log("COD Order - No email in session");
      return NextResponse.json({ message: "User email not found in session. Please login again." }, { status: 401 });
    }

    const { productId, quantity, address, amount, deliveryCharge, serviceCharge } = await req.json();

    // Debug: Log the received payload
    console.log("COD Order - Received payload:", { productId, quantity, address, amount, deliveryCharge, serviceCharge });
    console.log("COD Order - Types:", { 
      amount: typeof amount, 
      deliveryCharge: typeof deliveryCharge, 
      serviceCharge: typeof serviceCharge,
      quantity: typeof quantity 
    });

    const userId = session.user?.id;

    if (!productId || !quantity) {
      console.log("COD Order - Missing productId or quantity");
      return NextResponse.json({ message: "ProductId and quantity required" }, { status: 400 });
    }

    // Convert string numbers to actual numbers
    const parsedAmount = Number(amount);
    const parsedDeliveryCharge = Number(deliveryCharge);
    const parsedServiceCharge = Number(serviceCharge);
    const parsedQuantity = Number(quantity);

    if (isNaN(parsedAmount) || isNaN(parsedDeliveryCharge) || isNaN(parsedServiceCharge)) {
      console.log("COD Order - Invalid amounts after parsing:", { parsedAmount, parsedDeliveryCharge, parsedServiceCharge });
      return NextResponse.json({ message: "Invalid amount, delivery or service charge" }, { status: 400 });
    }

    if (
      !address?.name ||
      !address?.phone ||
      !address?.address ||
      !address?.city ||
      !address?.pincode
    ) {
      console.log("COD Order - Missing address fields:", address);
      return NextResponse.json({ message: "All address fields are required" }, { status: 400 });
    }

    console.log("COD Order - Looking for user:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log("COD Order - User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!user.cart) {
      console.log("COD Order - User cart not found");
      return NextResponse.json({ message: "User cart not found" }, { status: 404 });
    }

    console.log("COD Order - User cart:", user.cart);
    const cartItem = user.cart.find((item: any) =>
      item.product.toString() === productId.toString()
    );

    if (!cartItem) {
      console.log("COD Order - Product not in cart, looking for:", productId);
      return NextResponse.json({ message: "Product not found in cart" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log("COD Order - Product not found in database");
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.stock < parsedQuantity) {
      return NextResponse.json(
        { message: `Insufficient stock for ${product.title}` },
        { status: 400 }
      );
    }

    const productsTotal = product.price * parsedQuantity;

    // Create the order
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
      paymentMethod: "cod",
      isPaid: false,
      orderStatus:"pending",
      address,
    });



    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -parsedQuantity },
    });

    user.cart = user.cart.filter((item: any) => item.product.toString() !== productId.toString());
    await user.save();

    user.orders.push(order._id);
    await user.save();

    return NextResponse.json(
      {message:"Order created successfully",order},{status:200}
    );

   
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating order in cod: ${error}` },
      { status: 500 }
    );
  }
}
