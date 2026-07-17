import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        await connectDb();
        console.log("Connected to database, fetching products...");
        
        // Fetch all products from the database
        const products = await Product.find().populate("vendor", "name email shopName gstNumber").populate({
          path:"reviews.user", select:"name email image"
        }).sort({ createdAt: -1 });
        
        console.log("Found products:", products.length);
        console.log("Sample product:", products[0] ? {
          _id: products[0]._id,
          title: products[0].title,
          vendor: products[0].vendor
        } : "No products");

        return NextResponse.json({ products });
    }catch(error){
        console.error("Error fetching products:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        });
        
        // Handle specific error types
        if (error instanceof Error) {
          if (error.name === 'ValidationError') {
            return NextResponse.json({ 
              message: "Validation error", 
              error: error.message
            }, { status: 400 });
          }
        }
        
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
