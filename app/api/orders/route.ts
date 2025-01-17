import connectDB from "@/lib/connectDB";
import Order from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    connectDB();
    const data = await req.json();
    await Order.create(data);
    return NextResponse.json({ message: "Order created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(res: NextResponse) {
  try {
    connectDB();
    const orders = await Order.find({});
    return NextResponse.json({ message: "Orders found", orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
