import { db } from "@/db";
import { pages, menus, menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      const pageData = await db.select().from(pages).where(eq(pages.slug, slug));
      return NextResponse.json({ data: pageData[0] || null });
    }
    const allPages = await db.select().from(pages).orderBy(asc(pages.title));
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
        .set({ title, content, excerpt, status, template, updatedAt: new Date() })
        .where(eq(pages.id, existing[0].id))
        .returning();
      return NextResponse.json({ data: updated[0] });
    } else {
      const newPage = await db.insert(pages).values({ slug, title, content, excerpt, status, template }).returning();
      return NextResponse.json({ data: newPage[0] });
    }
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}