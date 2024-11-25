"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ListTodo, Calendar, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaskManagerIntro() {
  const [activeTab, setActiveTab] = useState("signup");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    console.log(`${activeTab} form submitted`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      {/* Task Manager Introduction */}
      <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 p-4 lg:w-1/2 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl lg:mb-6">
            Welcome to TaskMaster
          </h1>
          <p className="mb-6 text-lg text-gray-600 sm:text-xl lg:mb-8">
            Streamline your productivity with our intuitive task management
            system.
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:mb-12 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <ListTodo className="mr-2 h-5 w-5 text-primary" />
                  Organize Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  Easily create, categorize, and prioritize your tasks to stay
                  on top of your workload.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Set Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  Assign due dates to your tasks and never miss an important
                  deadline again.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  Monitor your task completion and celebrate your productivity
                  milestones.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Analyze Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">
                  Gain insights into your productivity patterns with detailed
                  analytics and reports.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
            <h2 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
              Why Choose TaskMaster?
            </h2>
            <ul className="list-inside list-disc space-y-1 text-gray-600 sm:space-y-2">
              <li className="text-sm sm:text-base">
                Intuitive and user-friendly interface
              </li>
              <li className="text-sm sm:text-base">
                Customizable task categories and tags
              </li>
              <li className="text-sm sm:text-base">
                Collaboration features for team projects
              </li>
              <li className="text-sm sm:text-base">
                Cross-platform synchronization
              </li>
              <li className="text-sm sm:text-base">
                Regular updates and new features
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sign Up and Login Forms */}
      <div className="flex w-full items-center bg-white p-4 lg:w-1/2 lg:p-8">
        <Card className="mx-auto w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Sign up for TaskMaster to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input id="signup-name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select name="department" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="bus">Business</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" type="submit">
                    Sign Up
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="w-full text-center text-xs text-gray-500 sm:text-sm">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </CardFooter>
            </TabsContent>
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Login to your TaskMaster account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="w-full text-center text-xs text-gray-500 sm:text-sm">
                  Forgot your password?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Reset it here
                  </a>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
