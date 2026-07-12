import Product from "@/model/product.model";
import { NextRequest,NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";
export async function GET(req:NextRequest){
    try {
        await connectDb()
        const {searchParams} = new URL(req.url)
        const query = searchParams.get("query") || ""
        const category = searchParams.get("category")
        const shop = searchParams.get("shop")

        const filter: {
            isActive: boolean;
            veificationStatus: string;
            $or?: Array<{
                title?: { $regex: string; $options: string };
                description?: { $regex: string; $options: string };
                category?: { $regex: string; $options: string };
            }>;
            category?: string;
            vendor?: string;
        } = {
            isActive: true,
            veificationStatus: "approved",
        };

        if(query){
            filter.$or = [
                {title: {$regex:query, $options:"i"}},
                {description: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}}
            ]
        }

        // category Filter

        if(category && category !== "all"){
            filter.category = category
        }

         if(shop && shop!== "all"){
            filter.vendor = shop
        }

        const products = await Product.find(filter)
        .populate('vendor', 'name shopName image').sort({createdAt: -1})

        return NextResponse.json(
            {
                success:true,
                count:products.length,
                products
            },{
                status:200
            }
        )


    } catch (error) {
        return NextResponse.json({message:`Error getting products ${error}`},{status:500})
    }
}