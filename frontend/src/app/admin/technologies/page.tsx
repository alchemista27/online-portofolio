"use client";

import { useState, useEffect } from "react";

interface Technology {
  id: number;
  name: string;
  iconUrl: string | null;
}

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTech, setNewTech] = useState({ name: "", iconUrl: "" });

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const res = await fetch("/api/technologies");
      const data = await res.json();
      setTechnologies(data.data || []);
    } catch (error) {
      console.error("Error fetching technologies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTech),
      });
      if (res.ok) {
        fetchTechnologies();
        setShowAddForm(false);
        setNewTech({ name: "", iconUrl: "" });
      }
    } catch (error) {
      console.error("Error adding technology:", error);
    }
  };

  const handleDeleteTech = async (id: number) => {
    if (!confirm("Are you sure you want to delete this technology?")) return;
    try {
      const res = await fetch(`/api/technologies?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTechnologies();
      }
    } catch (error) {
      console.error("Error deleting technology:", error);
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
          <h1 className="text-2xl font-bold text-foreground">Technologies</h1>
          <p className="text-muted-foreground">Manage your tech stack</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Add Technology
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Technology</h2>
            <form onSubmit={handleAddTech} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="e.g., React, Node.js, Python"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon URL (optional)</label>
                <input
                  type="url"
                  value={newTech.iconUrl}
                  onChange={(e) => setNewTech({ ...newTech, iconUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Add Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {technologies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No technologies yet
          </div>
        ) : (
          technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border p-4 shadow-sm flex items-center gap-3"
            >
              {tech.iconUrl ? (
                <img
                  src={tech.iconUrl}
                  alt={tech.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
                  {tech.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{tech.name}</p>
              </div>
              <button
                onClick={() => handleDeleteTech(tech.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}