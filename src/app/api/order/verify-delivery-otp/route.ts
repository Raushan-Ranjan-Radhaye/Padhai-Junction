import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { otp, orderId } = await req.json();

        if (!orderId || !otp) {
            return NextResponse.json({
                message: "Order ID and OTP are required"
            }, { status: 400 });
        }

        const order = await Order.findById(orderId).populate("buyer");
        if (!order) {
            return NextResponse.json({
                message: "Order not found"
            }, { status: 404 });
        }

        if (
            order.deliveryOtp !== otp ||
            !order.otpExpiresAt ||
            order.otpExpiresAt < new Date()
        ) {
            return NextResponse.json({
                message: "Invalid or expired OTP"
            }, { status: 400 });
        }

        order.orderStatus = "delivered";
        order.isPaid = true;
        order.deliveryDate = new Date();
        order.deliveryOtp = undefined;
        order.otpExpiresAt = undefined;
        await order.save();

        return NextResponse.json({
            message: "Order delivered successfully"
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: `Error verifying OTP: ${error}`
        }, { status: 500 });
    }
}
