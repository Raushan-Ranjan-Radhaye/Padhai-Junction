import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";
import Product from "@/model/product.model";
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        { message: "No authenticated user found" },
        { status: 401 },
      );
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user?.id);
    if (!user) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product is not found" },
        { status: 400 },
      );
    }

    const existingProduct = user.cart.find(
      (item: any) => item.product?.toString() === productId.toString(),
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({ product: product._id, quantity });
    }

    await user.save();

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error adding product to cart ${error}` },
      { status: 500 },
    );
  }
}
