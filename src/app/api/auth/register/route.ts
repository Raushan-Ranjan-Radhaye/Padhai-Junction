import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
    // make a api to register user
    // post method ka
  try{
    await connectDb();
  const { name, email, password } = await req.json();

  const existuser = await User.findOne({ email });
  if (existuser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 },
    );
  }

  if(password.length < 6){
    return NextResponse.json(
      { message: "Password must be at least 6 characters long" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({
    message: "User registered successfully",
    user
  }, { status: 201 });

  }catch(error){
    return NextResponse.json(
      { message: `register Server Error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    );
  }
}
