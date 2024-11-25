"use client";
import Link from "next/link";
import { Clock, LayoutDashboard, LineChart, Square } from "lucide-react";

import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  // Function to check if the route is active
  // Function to check if the route is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="hidden w-72 border-r bg-muted md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="font-bold">Task Manager</span>
          </Link>
        </div>
        <div className="mt-6 flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/manage/DailyTask"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                isActive("/manage/DailyTask")
                  ? "bg-blue-300 text-white hover:text-white" // Active styles
                  : "text-muted-foreground" // Default styles
              }`}
            >
              <Clock className="h-4 w-4" />
              Daily Task
            </Link>

            <Link
              href="/manage/TaskList"
              className={`mt-5 flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                isActive("/manage/TaskList")
                  ? "bg-blue-300 text-white hover:text-white"
                  : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              TaskList
            </Link>

            {/* <Link
              href="/admin/tester"
              className={`mt-5 flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                isActive("/admin/tester")
                  ? "bg-teal-700 text-white hover:text-white"
                  : "text-muted-foreground"
              }`}
            >
              <LineChart className="h-4 w-4" />
              Testing
            </Link> */}
          </nav>
        </div>
        <div className="mt-auto py-10"></div>
      </div>
    </div>
  );
};

export default Sidebar;
