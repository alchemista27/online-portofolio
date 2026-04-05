import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allTestimonials = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return NextResponse.json({ data: allTestimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientReview, clientAvatarUrl } = body;

    const newTestimonial = await db.insert(testimonials).values({
      clientName,
      clientReview,
      clientAvatarUrl,
    }).returning();

    return NextResponse.json({ data: newTestimonial[0] });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID required" }, { status: 400 });
    }

    await db.delete(testimonials).where(eq(testimonials.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}