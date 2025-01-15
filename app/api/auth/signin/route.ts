import connectDB from "@/lib/connectDB";
import { createSession } from "@/lib/sessions";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }


    // Create a session
    await createSession(user._id.toString(), user.email, user.role);

    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
