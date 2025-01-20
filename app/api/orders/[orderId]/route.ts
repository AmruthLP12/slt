import connectDB from "@/lib/connectDB"
import Order from "@/models/Invoice"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectDB()

    const { orderId } = params

    console.log(orderId, "orderId")

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching order:", error.message)
    return NextResponse.json({ message: "Error fetching order", error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectDB()

    const { orderId } = params
    const { isDelivered, deliveredDate } = await req.json()

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    order.isDelivered = isDelivered
    order.deliveredDate = isDelivered ? deliveredDate : null

    await order.save()

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.error("Error updating order:", error.message)
    return NextResponse.json({ message: "Error updating order", error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectDB()

    const { orderId } = params

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    const order = await Order.findByIdAndDelete(orderId)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting order:", error.message)
    return NextResponse.json({ message: "Error deleting order", error: error.message }, { status: 500 })
  }
}

