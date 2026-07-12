import { NextResponse } from 'next/server'
import connectDb from '@/lib/connectDB'
import Order from '@/model/order.model';
import { sendDeliveryOtpEmail } from '@/lib/mailer';

export async function POST(req: Request) {
    try {
        await connectDb();
        const { orderId, status } = await req.json();
        const order = await Order.findById(orderId).populate("buyer");
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        if (status === "confirmed" || status === "shipped") {
            order.orderStatus = status;
            await order.save();
            return NextResponse.json({
                message: "Order updated successfully"
            }, { status: 200 });
        }

        if (status === "delivered") {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            order.deliveryOtp = otp;
            order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await order.save();

            const email = order.buyer?.email;

            if (!email) {
                return NextResponse.json({ message: "Email not found" }, { status: 404 });
            }
            await sendDeliveryOtpEmail(email, otp);
            return NextResponse.json({
                message: "OTP sent successfully"
            });
        }

        return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({
            message: `Error updating order ${error}`
        }, { status: 500 });
    }
}
