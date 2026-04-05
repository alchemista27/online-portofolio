"use client";

import { useState, useEffect } from "react";

interface Menu {
  id: number;
  name: string;
  location: string | null;
  updatedAt: string | null;
}

interface MenuItem {
  id: number;
  menuId: number;
  title: string;
  url: string | null;
  pageId: number | null;
  parentId: number | null;
  order: number;
  target: string;
}

interface Page {
  id: number;
  slug: string;
  title: string;
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuLocation, setNewMenuLocation] = useState("primary");

  const [newItem, setNewItem] = useState({
    type: "custom",
    title: "",
    url: "",
    pageId: null as number | null,
  });

  useEffect(() => {
    fetchMenus();
    fetchPages();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/menus");
      const data = await res.json();
      setMenus(data.data || []);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data.data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const fetchMenuItems = async (menuId: number) => {
    try {
      const res = await fetch(`/api/menus?menuId=${menuId}`);
      const data = await res.json();
      if (data.data?.items) {
        setMenuItems(data.data.items);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleCreateMenu = async () => {
    if (!newMenuName.trim()) return;
    try {
      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMenuName,
          location: newMenuLocation,
          items: [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedMenu(data.data);
        fetchMenus();
        setShowAddMenu(false);
        setNewMenuName("");
      }
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  const handleSelectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    fetchMenuItems(menu.id);
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    let itemTitle = newItem.title;
    let itemUrl = newItem.url;

    if (newItem.type === "page" && newItem.pageId) {
      const page = pages.find((p) => p.id === newItem.pageId);
      if (page) {
        itemTitle = page.title;
        itemUrl = `/${page.slug}`;
      }
    }

    const newMenuItem: MenuItem = {
      id: Date.now(),
      menuId: selectedMenu!.id,
      title: itemTitle,
      url: itemUrl || null,
      pageId: newItem.type === "page" ? newItem.pageId : null,
      parentId: null,
      order: menuItems.length,
      target: "_self",
    };

    setMenuItems([...menuItems, newMenuItem]);
    setShowAddItem(false);
    setNewItem({ type: "custom", title: "", url: "", pageId: null });
  };

  const handleRemoveItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...menuItems];
    if (direction === "up" && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setMenuItems(newItems);
  };

  const handleSaveMenu = async () => {
    setSaving(true);
    try {
      const itemsToSave = menuItems.map((item, index) => ({
        title: item.title,
        url: item.url,
        pageId: item.pageId,
        parentId: item.parentId,
        target: item.target,
      }));

      await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedMenu!.name,
          location: selectedMenu!.location,
          items: itemsToSave,
        }),
      });
      fetchMenus();
    } catch (error) {
      console.error("Error saving menu:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;
    if (!confirm(`Are you sure you want to delete ${selectedMenu.name}?`)) return;
    try {
      await fetch(`/api/menus?id=${selectedMenu.id}`, { method: "DELETE" });
      setSelectedMenu(null);
      setMenuItems([]);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menus</h1>
          <p className="text-muted-foreground">Create and manage navigation menus</p>
        </div>
        <button
          onClick={() => setShowAddMenu(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + New Menu
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Menu Locations</h2>
            </div>
            <div className="divide-y">
              {menus.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No menus yet
                </div>
              ) : (
                menus.map((menu) => (
                  <div
                    key={menu.id}
                    className={`p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      selectedMenu?.id === menu.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                    }`}
                    onClick={() => handleSelectMenu(menu)}
                  >
                    <div className="font-medium text-sm">{menu.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {menu.location === "primary" ? "Primary" : menu.location === "footer" ? "Footer" : menu.location || "Unassigned"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {selectedMenu ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedMenu.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Location: {selectedMenu.location || "Unassigned"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteMenu}
                      className="px-4 py-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleSaveMenu}
                      disabled={saving}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Menu"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Menu Items</h3>
                  <button
                    onClick={() => setShowAddItem(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                {menuItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    No items in this menu. Click &quot;Add Item&quot; to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800"
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveItem(index, "up")}
                            disabled={index === 0}
                            className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveItem(index, "down")}
                            disabled={index === menuItems.length - 1}
                            className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          {item.url && (
                            <div className="text-xs text-muted-foreground">{item.url}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Select a menu to edit or create a new one
              </p>
            </div>
          )}
        </div>
      </div>

      {showAddMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New Menu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Menu Name</label>
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Main Navigation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  value={newMenuLocation}
                  onChange={(e) => setNewMenuLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="primary">Primary (Header)</option>
                  <option value="footer">Footer</option>
                  <option value="mobile">Mobile</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMenu}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Create Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Menu Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Link Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value, pageId: null, title: "", url: "" })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="custom">Custom Link</option>
                  <option value="page">Page</option>
                </select>
              </div>

              {newItem.type === "page" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Page</label>
                  <select
                    value={newItem.pageId || ""}
                    onChange={(e) => setNewItem({ ...newItem, pageId: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="">Select a page...</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                      placeholder="Link Label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input
                      type="text"
                      value={newItem.url}
                      onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddItem(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}