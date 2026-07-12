import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    
    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json({
        message: "Unauthorized"
      }, { status: 401 });
    }

    const { productId } = await req.json();
    
    if (!productId) {
      return NextResponse.json({
        message: "Product ID is required"
      }, { status: 400 });
    }

    // Find the product and verify it belongs to the current vendor
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({
        message: "Product not found"
      }, { status: 404 });
    }

    // Check if the product belongs to the current vendor
    if (String(product.vendor) !== session.user.id) {
      return NextResponse.json({
        message: "Unauthorized - You can only delete your own products"
      }, { status: 403 });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      message: "Product deleted successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}