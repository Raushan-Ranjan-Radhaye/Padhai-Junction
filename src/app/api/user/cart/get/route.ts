import { auth } from "@/auth"
import connectDb from "@/lib/connectDB"
import { NextResponse } from "next/server"
import User from '@/model/user.model';



export async function GET(){
    try{
        await connectDb()
        const session = await auth()
        if(!session || !session.user?.id || !session.user?.email){
            return NextResponse.json({
                message: "No authenticated user found"
            }, {status: 400})
        }

        const user = await User.findById(session.user?.id).populate("cart.product")
        if(!user){
            return NextResponse.json({
                message: "User is not found"
            }, {status: 404})
        }

        return NextResponse.json({
            cart:user.cart,
        }, {status: 200})
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: `Error getting cart ${error}`
        })

    }
}
