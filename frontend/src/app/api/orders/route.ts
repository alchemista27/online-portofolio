import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.orderDate));
    return NextResponse.json({ data: allOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, serviceType, description, status } = body;

    const newOrder = await db.insert(orders).values({
      clientName,
      clientEmail,
      serviceType,
      description,
      status: status || "pending",
    }).returning();

    return NextResponse.json({ data: newOrder[0] });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedOrder = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json({ data: updatedOrder[0] });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    await db.delete(orders).where(eq(orders.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}