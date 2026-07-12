import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import User from "@/model/user.model";



export async function POST(req: NextRequest) {
    try {
        await connectDb();
        
        const session = await auth();
        if(!session || !session.user?.email){
            return NextResponse.json({message:"Please login to add review"}, {status:401})
        }

        const currentUser = await User.findOne({email: session.user.email});
        if(!currentUser){
            return NextResponse.json({message:"User not found"}, {status:404})
        }
        
        const formData = await req.formData();
        const productId = formData.get("productId") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;
        const file = formData.get("image") as File | null;
        
        if(!productId){
            return NextResponse.json({message:"Product ID is required"}, {status:400})
        }

        if(!rating || rating < 1 || rating > 5){
            return NextResponse.json({message:"Rating must be between 1 and 5"}, {status:400})
        }

        if(!comment || comment.trim().length === 0){
            return NextResponse.json({message:"Comment is required"}, {status:400})
        }

        const product = await Product.findById(productId);
        if(!product){
            return NextResponse.json({message:"Product not found"}, {status:404})
        }

        let imageUrl = null;

        if(file && file.size > 0){
            try {
                imageUrl = await uploadOnCloudinary(file);
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
            }
        }

        const newReview = {
            user: currentUser._id,
            rating,
            comment,
            images: imageUrl,
            createdAt: new Date()
        };

        if(!product.reviews) {
            product.reviews = [];
        }
        
        // Push just the review data, user will be handled separately if needed
        product.reviews = [...(product.reviews || []), newReview];
        
        await product.save();

        // Fetch the updated product with populated user
        const updatedProduct = await Product.findById(productId).populate({
            path: "reviews.user",
            select: "name email image"
        });
        
        return NextResponse.json({message:"Review added successfully", reviews: updatedProduct?.reviews}, {status:200})


    } catch (error) {
        console.error("Review API Error:", error);
        return NextResponse.json({ message: "Error adding review", error: String(error) }, { status: 500 });
    }
}
