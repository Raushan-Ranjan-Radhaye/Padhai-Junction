import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try{
        await connectDb();
        const session = await auth();
        const adminUser = await User.findById(session?.user?.id);
        if(!adminUser || adminUser.role !== "admin"){
            return NextResponse.json({
                message: "Only admin can update vendor status"}, {status: 403})
        }
        const {vendorId, status, rejectReason, reason} = await req.json();
        if(!vendorId || !status){
            return NextResponse.json({
                message: "Vendor id and status is required"
            }, {status: 400})
        }
        
        // Check if vendor exists
        const existingVendor = await User.findById(vendorId);
        if(!existingVendor){
            return NextResponse.json({
                message: "Vendor not found"
            }, {status: 404})
        }

        // Build update object based on status
        let updateData: Record<string, unknown> = {};
        
        if(status === "approved"){
            updateData = {
                verificationStatus: "approved",
                isApproved: true,
                approvedAt: new Date(),
                rejectedReason: null
            };
        } else if(status === "rejected"){
            updateData = {
                verificationStatus: "rejected",
                isApproved: false,
                approvedAt: null,
                rejectedReason: rejectReason || reason || "rejected by admin"
            };
        } else {
            return NextResponse.json({
                message: "Invalid status. Must be 'approved' or 'rejected'"
            }, {status: 400})
        }

        // Use findByIdAndUpdate for reliable atomic update
        const vendor = await User.findByIdAndUpdate(
            vendorId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if(!vendor){
            return NextResponse.json({
                message: "Failed to update vendor status"
            }, {status: 500})
        }

        return NextResponse.json({
            message: "Vendor status updated successfully",
            vendor
        }, {status: 200})

    }catch(error){
        console.error("Error updating vendor status:", error);
        return NextResponse.json({
            message: `Error updating vendor status: ${error}`
        }, {status: 500})
    }

}
