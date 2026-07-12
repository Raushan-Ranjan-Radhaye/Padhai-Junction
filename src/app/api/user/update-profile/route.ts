import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json(
        {
          message: "User not authenticated",
        },
        { status: 401 },
      );
    }
    const formData = await req.formData();
    const userName = formData.get("name") as string;
    const userPhone = formData.get("phone") as string;
    const file = formData.get("image") as File | null;

    if (!userName || !userPhone) {
      return NextResponse.json({
        message: "Name and phone are required"
      }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email }, 
      { 
        name: userName, 
        phone: userPhone, 
        image: imageUrl 
      }, 
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        message: "User not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error in update-profile API:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 },
    );
  }
}