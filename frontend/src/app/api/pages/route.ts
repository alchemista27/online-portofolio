import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  try {
    if (id) {
      const pageData = await db.select().from(pages).where(eq(pages.id, parseInt(id)));
      return NextResponse.json({ data: pageData[0] || null });
    }
    
    if (slug) {
      const pageData = await db.select().from(pages).where(eq(pages.slug, slug));
      return NextResponse.json({ data: pageData[0] || null });
    }
    
    const allPages = await db.select().from(pages);
    return NextResponse.json({ data: allPages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, content, excerpt, status, template } = body;

    const existing = await db.select().from(pages).where(eq(pages.slug, slug));
    
    if (existing.length > 0) {
      const updated = await db.update(pages)
        .set({ 
          title, 
          content: content || null, 
          excerpt: excerpt || null, 
          status: status || "draft", 
          template: template || null, 
          updatedAt: new Date() 
        })
        .where(eq(pages.id, existing[0].id))
        .returning();
      return NextResponse.json({ data: updated[0] });
    } else {
      const newPage = await db.insert(pages).values({ 
        slug, 
        title, 
        content: content || null, 
        excerpt: excerpt || null, 
        status: status || "draft", 
        template: template || null 
      }).returning();
      return NextResponse.json({ data: newPage[0] });
    }
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Page ID required" }, { status: 400 });
  }

  try {
    await db.delete(pages).where(eq(pages.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}