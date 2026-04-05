export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📋" },
  { href: "/admin/projects", label: "Projects", icon: "💼" },
  { href: "/admin/technologies", label: "Technologies", icon: "⚙️" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/menus", label: "Menus", icon: "🔗" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
          <p className="text-xs text-muted-foreground mt-1">Portfolio Management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <UserMenu name={session.user?.name} email={session.user?.email} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}