import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const vendors = await User.find({ role: "vendor" }).sort({ createdAt: -1 }).populate("vendorProducts");
    if(!vendors){
        return NextResponse.json({
            message: "No vendors found"
        },{ status: 404})
    }
    return NextResponse.json({ vendors }, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user", error },
      { status: 500 },
    );
  }
}
