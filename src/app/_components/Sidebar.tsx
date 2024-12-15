"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircleUser, Clock, LayoutDashboard, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format } from "date-fns";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: userData } = api.Auth.getAllUser.useQuery({
    email: storedEmail || "",
  });

  console.log("DATA", userData);

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const Signup = api.Auth.EditProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "SUCCESS",
        description: "Profile successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "ERROR",
        description:
          error.message || "An error occurred while updating the profile.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    setStoredEmail(email);
  }, []);

  useEffect(() => {
    if (userData ?? userData?.[0]) {
      setProfileData({
        name: userData[0]?.name || "",
        age: userData[0]?.age?.toString() || "",
        dateOfBirth: userData[0]?.dateOfBirth
          ? new Date(userData[0].dateOfBirth).toISOString()
          : "",

        phoneNumber: userData[0]?.phoneNumber || "",
        email: userData[0]?.email || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [userData]);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    router.push("/sign-in");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userData && userData[0]?.id) {
      const updatedProfileData = {
        ...profileData,
        id: userData[0].id || null,
        age: Number(profileData.age),
        password: profileData.newPassword || userData[0]?.password,
      };

      Signup.mutate(updatedProfileData as any);
    }
  };

  return (
    <div className="hidden w-72 border-r bg-muted md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex w-full flex-col items-center">
            <Link
              href="/task-manager"
              className="flex items-start gap-2 font-semibold"
            >
              <span className="font-bold">Task Manager</span>
            </Link>
          </div>
        </div>
        <div className="mt-6 flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/manage/DailyTask"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                isActive("/manage/DailyTask")
                  ? "bg-blue-300 text-white hover:text-white"
                  : "text-muted-foreground"
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="mt-5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-all hover:text-primary">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </nav>
        </div>

        {/* Profile Edit Section */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex w-full cursor-pointer items-center justify-center bg-blue-400 py-4 text-white">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center gap-1">
                  <CircleUser />
                  <p className="text-xs font-bold">EDIT PROFILE</p>
                </div>
                <p className="text-xs">{storedEmail}</p>
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Profile</AlertDialogTitle>
              <AlertDialogDescription>
                Update your profile information below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={profileData.age}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateOfBirth" className="text-right">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentPassword" className="text-right">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPassword" className="text-right">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={handleProfileChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Save</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Sidebar;
