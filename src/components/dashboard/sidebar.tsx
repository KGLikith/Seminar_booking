"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Calendar, BarChart3, Wrench, LogOut } from 'lucide-react';

interface SidebarProps {
  userRole: string | null;
}

const menuItems = {
  teacher: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Book Seminar", href: "/dashboard/teacher", icon: BookOpen },
    { label: "My Bookings", href: "/dashboard/teacher/bookings", icon: Calendar },
  ],
  hod: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Pending Requests", href: "/dashboard/hod", icon: Calendar },
    { label: "Usage Statistics", href: "/dashboard/hod/usage", icon: BarChart3 },
  ],
  tech_staff: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/dashboard/tech-staff", icon: Calendar },
    { label: "Equipment", href: "/dashboard/tech-staff/equipment", icon: Wrench },
    { label: "Maintenance", href: "/dashboard/tech-staff/maintenance", icon: BarChart3 },
  ],
};

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const items = userRole ? menuItems[userRole as keyof typeof menuItems] || [] : [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full overflow-y-auto flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Seminar Hub</h2>
            <p className="text-xs text-slate-500 capitalize">{userRole?.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              style={{
                animation: `slide-in-right 0.3s ease-out`,
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-medium text-sm">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
