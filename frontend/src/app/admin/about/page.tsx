"use client";

import { useState, useEffect } from "react";

interface AboutPage {
  id: number;
  content: string | null;
  updatedAt: string | null;
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setAbout(data.data);
      setContent(data.data?.content || "");
    } catch (error) {
      console.error("Error fetching about page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setAbout(data.data);
      }
    } catch (error) {
      console.error("Error saving about page:", error);
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-foreground">About Page</h1>
          <p className="text-muted-foreground">Edit your about page content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6">
        <label className="block text-sm font-medium mb-2">About Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-background min-h-[400px]"
          placeholder="Write your about page content here..."
        />
        {about?.updatedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(about.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}