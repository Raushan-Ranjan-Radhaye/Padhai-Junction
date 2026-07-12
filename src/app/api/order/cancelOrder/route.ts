import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {orderId} = await req.json()
        if(!orderId){
            return NextResponse.json({message:"Order ID is required"},{status:400})
        }

        const order = await Order.findById(orderId)
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:404})
        }

        order.orderStatus = "cancelled",
        order.cancelledAt = new Date()
        await order.save()
        return NextResponse.json({message:"Order cancelled successfully"},{status:200})

    } catch (error) {
        return NextResponse.json({message:`Error cancelling order ${error}`},{status:500})
        
    }
}