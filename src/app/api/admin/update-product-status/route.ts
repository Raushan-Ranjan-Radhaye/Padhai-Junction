import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const adminUser = await User.findById(session?.user?.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        {
          message: "Only admin can update product status",
        },
        { status: 403 },
      );
    }

    const { productId, status, reason } = await req.json();

    if (!productId || !status) {
      return NextResponse.json(
        {
          message: "Product id and status is required",
          received: { productId, status, reason },
        },
        { status: 400 },
      );
    }

    // Try to find product by both _id and id (virtual property)
    let product = await Product.findById(productId);
    if (!product) {
      // If not found by id, try converting to ObjectId and searching by _id
      try {
        const objectId = new mongoose.Types.ObjectId(productId);
        product = await Product.findById(objectId);
      } catch (e) {
        // Invalid ObjectId format
      }
    }

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
          searchAttempt: productId,
        },
        { status: 404 },
      );
    }

    if (status === "approved") {
      product.veificationStatus = "approved";
      product.approvedAt = new Date();
      product.rejectedReason = undefined;
    }

    if (status === "rejected") {
      product.veificationStatus = "rejected";
      product.rejectedReason = reason || "rejected by admin";
      console.log(
        "API Debug - Rejection reason saved:",
        product.rejectedReason,
      );
      console.log("API Debug - Full product after rejection:", {
        veificationStatus: product.veificationStatus,
        rejectedReason: product.rejectedReason,
      });
    }

    await product.save();
    return NextResponse.json(
      {
        message: "Product status updated successfully",
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product status:", error);
    return NextResponse.json(
      {
        message: `Error updating product status: ${error}`,
      },
      { status: 500 },
    );
  }
}
