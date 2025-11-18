"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, Menu } from 'lucide-react';
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  try {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="hidden sm:flex items-center justify-center lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <div className="hidden sm:flex flex-col gap-1">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                Seminar Hub
              </h1>
              <p className="text-xs text-slate-500">Hall Management System</p>
            </div>
            <div className="flex sm:hidden">
              <h1 className="text-sm font-bold text-slate-900">Hub</h1>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Link
              href="/dashboard/notifications"
              className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>

            {/* User Button */}
            <div className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 rounded-lg",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error("[Header] Error rendering header:", error);
    return (
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-sm font-bold text-slate-900">Seminar Hub</h1>
          <div className="text-xs text-slate-500">Loading...</div>
        </div>
      </header>
    );
  }
}
