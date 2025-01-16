import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
  try {
    connectDB();
    const users = await User.find({}, { password: 0 });
    return NextResponse.json({ message: "Users found", users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

  
  
