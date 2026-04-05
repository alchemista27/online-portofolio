export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders, projects, technologies, testimonials } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

async function getStats() {
  try {
    const [orderCount, projectCount, techCount, testimonialCount, pendingOrders, recentOrders] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(technologies),
      db.select({ count: sql<number>`count(*)` }).from(testimonials),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'pending')),
      db.select().from(orders).orderBy(sql`${orders.orderDate} DESC`).limit(5),
    ]);

    return {
      totalOrders: orderCount[0]?.count || 0,
      totalProjects: projectCount[0]?.count || 0,
      totalTechnologies: techCount[0]?.count || 0,
      totalTestimonials: testimonialCount[0]?.count || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
      recentOrders: recentOrders,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalOrders: 0,
      totalProjects: 0,
      totalTechnologies: 0,
      totalTestimonials: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const stats = await getStats();

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: "📋", color: "bg-blue-500" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "bg-yellow-500" },
    { label: "Projects", value: stats.totalProjects, icon: "💼", color: "bg-purple-500" },
    { label: "Technologies", value: stats.totalTechnologies, icon: "⚙️", color: "bg-green-500" },
    { label: "Testimonials", value: stats.totalTestimonials, icon: "💬", color: "bg-pink-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user?.name || "Admin"}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-zinc-900 rounded-xl border p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white text-lg`}>
                {card.icon}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="p-6">
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.clientName}</p>
                    <p className="text-sm text-muted-foreground">{order.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}