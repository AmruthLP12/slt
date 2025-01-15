import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success response without exposing sensitive fields
    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
