import connectDB from "@/lib/connectDB";
import Order from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();

    const { orderId } = params;

    console.log(orderId, "orderId");

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order:", error.message);
    return NextResponse.json(
      { message: "Error fetching order", error: error.message },
      { status: 500 }
    );
  }
}
