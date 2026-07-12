
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import Order from "@/model/order.model";

interface PopulatedUser {
  _id: unknown;
  name?: string;
  image?: string;
  role?: string;
  shopName?: string;
  email?: string;
}

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id).populate(
      "chats.with",
      "name image role shopName email"
    );

    if (!currentUser) {
      return NextResponse.json({ users: [] });
    }

    // Get unique users from existing chats
    const existingChats = currentUser.chats?.map((chat: { with: PopulatedUser | null }) => chat.with) || [];
    const filteredChats = existingChats.filter((u: PopulatedUser | null): u is PopulatedUser => u !== null);

    // Get potential contacts based on role
    let potentialContacts: PopulatedUser[] = [];

    if (currentUser.role === "user") {
      // Get vendors from user's orders
      const orders = await Order.find({ buyer: currentUser._id })
        .populate("productVendor", "name image shopName role email")
        .select("productVendor");
      
      const vendorMap = new Map<string, PopulatedUser>();
      orders.forEach((order: { productVendor: PopulatedUser | null }) => {
        if (order.productVendor && order.productVendor._id) {
          vendorMap.set(String(order.productVendor._id), order.productVendor);
        }
      });
      potentialContacts = Array.from(vendorMap.values());
    } else if (currentUser.role === "vendor") {
      // Vendors can contact admin
      const admin = await User.findOne({ role: "admin" }).select("name image role shopName email");
      if (admin) {
        potentialContacts = [admin];
      }
    }

    // Merge existing chats with potential contacts (avoiding duplicates)
    const allContacts = [...filteredChats];
    potentialContacts.forEach((contact) => {
      if (!allContacts.some((c) => String(c._id) === String(contact._id))) {
        allContacts.push(contact);
      }
    });

    return NextResponse.json({ users: allContacts });
  } catch (error) {
    console.error("Error in active-users API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

