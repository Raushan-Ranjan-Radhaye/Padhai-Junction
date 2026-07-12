import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";
import { auth } from "@/auth";
import Product from "@/model/product.model";
import uploadOnCloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 },
      );
    }

    if (String(product.vendor) !== session.user.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isWearable = formData.get("isWearable") === "true";
    const sizes = formData.getAll("sizes") as string[];
    const replacementDaysInput = formData.get("replacementDays");
    const warrantyInput = formData.get("warranty");

    // Parse replacementDays with proper validation
    let replacementDays = 0;
    if (replacementDaysInput) {
      const parsed = Number(replacementDaysInput);
      if (!isNaN(parsed) && parsed >= 0) {
        replacementDays = parsed;
      }
    }

    // Parse warranty with proper validation
    let warranty = 0;
    if (warrantyInput) {
      const parsed = Number(warrantyInput);
      if (!isNaN(parsed) && parsed >= 0) {
        warranty = parsed;
      }
    }
    const freeDelivery = formData.get("freeDelivery") === "true";
    const payOnDelivery = formData.get("payOnDelivery") === "true";
    const detailsPoints = formData.getAll("detailsPoints") as string[];
    const img1 = formData.get("image1") as Blob | null;
    const img2 = formData.get("image2") as Blob | null;
    const img3 = formData.get("image3") as Blob | null;
    const img4 = formData.get("image4") as Blob | null;

    let image1 = product.image1;
    let image2 = product.image2;
    let image3 = product.image3;
    let image4 = product.image4;

    if (img1) {
      image1 = await uploadOnCloudinary(img1);
    }
    if (img2) {
      image2 = await uploadOnCloudinary(img2);
    }
    if (img3) {
      image3 = await uploadOnCloudinary(img3);
    }
    if (img4) {
      image4 = await uploadOnCloudinary(img4);
    }

    if (isWearable && sizes.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "Sizes are required for wearable products",
        }),
        { status: 400 },
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      title,
      description,
      price,
      stock,
      category,
      isStockAvailable: stock > 0,
      image1,
      image2,
      image3,
      image4,
      isWearable,
      sizes: isWearable ? sizes : [],
      replacementDays,
      warrenty: warranty,
      freeDelivery,
      payOnDelivery,
      detailsPoints,
      veificationStatus: "pending",
      isActive: false,
    },{new:true});
    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
  }
}
