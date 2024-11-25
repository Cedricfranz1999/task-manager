"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LayoutDashboard,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Timer,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    // Redirect to sign-in page
    router.push("/sign-in");
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 sm:hidden lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <div className="mb-10 ml-2 flex w-full items-start justify-start font-extrabold">
              <p>Task Manager</p>
            </div>
            <Link
              href="/"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Timer className="h-5 w-5" />
              Daily Task
            </Link>

            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard className="h-5 w-5" />
              Tasklist
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
