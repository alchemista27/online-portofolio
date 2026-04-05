import { db } from "@/db";
import { technologies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allTechs = await db.select().from(technologies);
    return NextResponse.json({ data: allTechs });
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json({ error: "Failed to fetch technologies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, iconUrl } = body;

    const newTech = await db.insert(technologies).values({
      name,
      iconUrl,
    }).returning();

    return NextResponse.json({ data: newTech[0] });
  } catch (error) {
    console.error("Error creating technology:", error);
    return NextResponse.json({ error: "Failed to create technology" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Technology ID required" }, { status: 400 });
    }

    await db.delete(technologies).where(eq(technologies.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting technology:", error);
    return NextResponse.json({ error: "Failed to delete technology" }, { status: 500 });
  }
}