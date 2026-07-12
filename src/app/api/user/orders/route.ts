import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Order from "@/model/order.model";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    
    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        { message: "No authenticated user found" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Fetch orders where the user is the buyer
    const orders = await Order.find({ buyer: userId })
      .populate("products.product", "title image1 price")
      .populate("productVendor", "name shopName")
      .sort({ createdAt: -1 });

    if (!orders) {
      return NextResponse.json(
        { message: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { orders },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting orders: ${error}` },
      { status: 500 }
    );
  }
}

