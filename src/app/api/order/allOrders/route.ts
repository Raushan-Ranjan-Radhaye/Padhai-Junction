import connectDb from "@/lib/connectDB"
import Order from "@/model/order.model"
import { NextResponse } from "next/server"


export async function GET(){

    try{
        await connectDb()
        
        // Get all orders without requiring authentication for admin panel
        const orders = await Order.find().populate("buyer", "name email image")
        .populate('productVendor', 'name shopName email')
        .populate({
            path: 'products.product',
            select: 'title image1 price category stock vendor replacementDays',
            model: 'Product'
        })
        .sort({createdAt: -1})
        return NextResponse.json({
            orders
        }, {status: 200})

    }catch(error){
        return NextResponse.json({
            message: `Error getting all orders ${error}`
        }, {status: 500})
    
    }
    
}
