import { NextResponse,NextRequest } from "next/server"
import connectDb from "@/lib/connectDB"
import Order from "@/model/order.model"

export async function POST (req:NextRequest) {
    try{
        await connectDb()
        const {orderId} = await req.json()
        if(!orderId){
            return NextResponse.json({message:"Order ID is required"},{status:400})
        }

        const order = await Order.findById(orderId)
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:404})
        }


        if(order.orderStatus === "cancelled"){
            return NextResponse.json({message:"Order is Cancelled cannot return"},{status:400})
        }

        if(order.orderStatus !== "delivered"){
            return NextResponse.json({message:"Order is not delivered"},{status:400})
        }

        if(order.orderStatus === "returned"){
            return NextResponse.json({message:"Order is already returned"},{status:400})
        }

        let returnAmount = 0; 
        for (const item of order.products) {
            returnAmount += item.price * item.quantity;
          }
        order.orderStatus = "returned"
        order.returnAmount = returnAmount;
        await order.save()
        return NextResponse.json(order,{status:200})



    }catch(error){
        return NextResponse.json({message:`Error returning order ${error}`},{status:500})
    }
}