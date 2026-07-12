import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "No authenticated user found" },
        { status: 401 },
      );
    }
    
    const user = await User.findOne({ email: session.user.email }).select(
      "-password",
    );
    if (!user) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "User found", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error getting user ${error}` },
      { status: 500 },
    );
  }
}
