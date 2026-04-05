"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  clientName: string;
  clientReview: string;
  clientAvatarUrl: string | null;
  createdAt: string | null;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: "",
    clientReview: "",
    clientAvatarUrl: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      if (res.ok) {
        fetchTestimonials();
        setShowAddForm(false);
        setNewTestimonial({ clientName: "", clientReview: "", clientAvatarUrl: "" });
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center addForm-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Add Testimonial
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Testimonial</h2>
            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newTestimonial.clientName}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review</label>
                <textarea
                  required
                  value={newTestimonial.clientReview}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, clientReview: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={newTestimonial.clientAvatarUrl}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, clientAvatarUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
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
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No testimonials yet
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                {testimonial.clientAvatarUrl ? (
                  <img
                    src={testimonial.clientAvatarUrl}
                    alt={testimonial.clientName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{testimonial.clientReview}</p>
              <button
                onClick={() => handleDeleteTestimonial(testimonial.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}