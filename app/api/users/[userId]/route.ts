import connectDB from "@/lib/connectDB";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const userId = params.userId;
    const body = await req.json();
    const { ...updateFields } = body;

    if (!userId) {
      return NextResponse.json(
        { message: `Invalid request: ${userId} is required` },
        { status: 400 }
      );
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: "Invalid request: No update fields provided" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    return NextResponse.json({ message: "User updated", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const userId = params?.userId;

    const user = await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
