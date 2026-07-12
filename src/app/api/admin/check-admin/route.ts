import User from '@/model/user.model'
import { NextResponse } from 'next/server'
import connectDb from '@/lib/connectDB'

export async function GET(req: Request) {
    try{
        await connectDb();
        const admin = await User.findOne({role:"admin"})
        return NextResponse.json({
            exists: !!admin,
        })

    }catch(error){
        return NextResponse.json({
            message: `check-admin error ${error}`
        }, {status: 500})
    }

   
}