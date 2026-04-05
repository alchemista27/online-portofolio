"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  status: string;
  template: string | null;
  updatedAt: string | null;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    template: "",
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data.data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedPage(null);
    setFormData({
      slug: "",
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      template: "",
    });
    setIsEditing(true);
  };

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content || "",
      excerpt: page.excerpt || "",
      status: page.status,
      template: page.template || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPage(data.data);
        fetchPages();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`/api/pages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPages();
        if (selectedPage?.id === id) {
          setSelectedPage(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error deleting page:", error);
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
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground">Create and manage your pages</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + New Page
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold">All Pages</h2>
            </div>
            <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
              {pages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No pages yet
                </div>
              ) : (
                pages.map((page) => (
                  <div
                    key={page.id}
                    className={`p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      selectedPage?.id === page.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                    }`}
                    onClick={() => handleEdit(page)}
                  >
                    <div className="font-medium text-sm">{page.title}</div>
                    <div className="text-xs text-muted-foreground">/{page.slug}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          page.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {isEditing ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedPage ? "Edit Page" : "New Page"}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.slug || !formData.title}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : selectedPage ? "Update" : "Publish"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg bg-background"
                        placeholder="page-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-lg"
                    placeholder="Page title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    rows={2}
                    placeholder="Short description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your page content here..."
                  />
                </div>

                {selectedPage && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleDelete(selectedPage.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete this page
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Select a page to edit or create a new one
              </p>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create New Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}