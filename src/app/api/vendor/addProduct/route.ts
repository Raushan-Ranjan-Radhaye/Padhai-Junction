import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
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
    const img1 = formData.get("image1") as Blob;
    const img2 = formData.get("image2") as Blob;
    const img3 = formData.get("image3") as Blob;
    const img4 = formData.get("image4") as Blob;

    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !img1
    ) {
      return NextResponse.json({ message: "All fields are required" });
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json({
        message: "Sizes are required for wearable products",
      });
    }

    const image1 = await uploadOnCloudinary(img1);
    const image2 = img2 ? await uploadOnCloudinary(img2) : undefined;
    const image3 = img3 ? await uploadOnCloudinary(img3) : undefined;
    const image4 = img4 ? await uploadOnCloudinary(img4) : undefined;

    const product = await Product.create({
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
      vendor: session.user.id,
      isWearable,
      sizes: isWearable ? sizes : [],
      replacementDays,
      warrenty: warranty,
      freeDelivery,
      payOnDelivery,
      detailsPoints,
      veificationStatus: "pending",
      isActive: false,
    });

    await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: {
          vendorProducts: product._id,
        },
      },
      { new: true },
    );

    return NextResponse.json({
      message: "Product added successfully",
      product,
    });

    // Process the image file and save it to the server or cloud storage
    // You can use libraries like multer or cloudinary for this purpose

    // Save the product details to the database
    // You can use your preferred database library (e.g., mongoose, prisma) to save the product details

  } catch (error) {
    console.error("Error adding product:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({ 
          message: "Validation error", 
          error: error.message,
          details: error
        }, { status: 400 });
      }
      if (error.name === 'CastError') {
        return NextResponse.json({ 
          message: "Invalid data format", 
          error: error.message
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      message: "Failed to add product", 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}