import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        {
          message: "No authenticated user found",
        },
        { status: 400 },
      );
    }
    const body = await req.json();
    const { productId, quantity } = body;
    if (!productId || quantity < 1) {
      return NextResponse.json(
        {
          message: "Product ID and quantity are required",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.cart) {
      return NextResponse.json(
        {
          message: "User Cart is not found",
        },
        { status: 404 },
      );
    }

    const item = user.cart.find(
      (item: any) => item.product.toString() === productId.toString(),
    );

    if (!item) {
      return NextResponse.json(
        {
          message: "Item is not found in cart",
        },
        { status: 404 },
      );
    }
    item.quantity = quantity;
    await user.save();

    return NextResponse.json(
      {
        message: "Cart updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: `Error updating cart ${error}`,
    });
  }
}
