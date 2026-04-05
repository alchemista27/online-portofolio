import { db } from "@/db";
import { menus, menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const menuId = searchParams.get("menuId");

  try {
    if (menuId) {
      const menuData = await db.select().from(menus).where(eq(menus.id, parseInt(menuId)));
      const itemsData = await db.select().from(menuItems).where(eq(menuItems.menuId, parseInt(menuId)));
      return NextResponse.json({ data: { ...menuData[0], items: itemsData || [] } });
    }
    
    if (location) {
      const menuData = await db.select().from(menus).where(eq(menus.location, location));
      if (menuData.length > 0) {
        const itemsData = await db.select().from(menuItems).where(eq(menuItems.menuId, menuData[0].id));
        return NextResponse.json({ data: { ...menuData[0], items: itemsData || [] } });
      }
      return NextResponse.json({ data: null });
    }
    
    const allMenus = await db.select().from(menus);
    return NextResponse.json({ data: allMenus });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ error: `Failed to fetch menus: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, items } = body;

    const existing = await db.select().from(menus).where(eq(menus.name, name));
    let menuId: number;

    if (existing.length > 0) {
      const updated = await db.update(menus)
        .set({ location, updatedAt: new Date() })
        .where(eq(menus.id, existing[0].id))
        .returning();
      menuId = updated[0].id;
    } else {
      const newMenu = await db.insert(menus).values({ name, location }).returning();
      menuId = newMenu[0].id;
    }

    if (items && Array.isArray(items)) {
      await db.delete(menuItems).where(eq(menuItems.menuId, menuId));
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await db.insert(menuItems).values({
          menuId,
          title: item.title,
          url: item.url || null,
          pageId: item.pageId || null,
          parentId: item.parentId || null,
          order: i,
          target: item.target || "_self",
        });
      }
    }

    const menuData = await db.select().from(menus).where(eq(menus.id, menuId));
    const itemsData = await db.select().from(menuItems).where(eq(menuItems.menuId, menuId));
    return NextResponse.json({ data: { ...menuData[0], items: itemsData } });
  } catch (error) {
    console.error("Error saving menu:", error);
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Menu ID required" }, { status: 400 });
  }

  try {
    const parsedId = parseInt(id);
    await db.delete(menuItems).where(eq(menuItems.menuId, parsedId));
    await db.delete(menus).where(eq(menus.id, parsedId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json({ error: "Failed to delete menu" }, { status: 500 });
  }
}