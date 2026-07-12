import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { shopName, shopAddress, gstNumber } = await req.json();

    if(!shopName || !shopAddress || !gstNumber){
        return NextResponse.json({
            message: "All fields are required"
        }, {status: 400})
    }
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const UpdatedVendor = await User.findOneAndUpdate({ email: session?.user?.email },
      { 
        shopName, 
        shopAddress, 
        gstNumber, 
        verificationStatus: "pending", 
        requestedAt: new Date(),
        rejectedReason: null,
        isApproved: false,
      },
      { new: true }
    );

    if (!UpdatedVendor) {
      return NextResponse.json(
        {
          message: "Vendor not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Verify again Vendor successfully",
      UpdatedVendor,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error updating Vendor ${error}`,
      },
      { status: 500 },
    );
  }
}