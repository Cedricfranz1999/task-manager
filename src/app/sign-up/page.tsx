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
import { ListTodo, Calendar, CheckCircle, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function TaskManagerIntro() {
  const [activeTab, setActiveTab] = useState("signup");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const Signup = api.Auth.Signup.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setContactNumber("");
      setBirthDate("");
      window.alert("successfully registered");
      router.push("/sign-in");
    },
    onError: (error) => {
      window.alert("Error while signup check your fields");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setContactNumber("");
      setBirthDate("");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    const dateOfBirth = new Date(birthDate);

    event.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match, but no error will be shown.");
    }
    Signup.mutate({
      name: name,
      email: email,
      password: password,
      phoneNumber: contactNumber,
      age: 1,
      dateOfBirth: dateOfBirth,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 lg:flex-row">
      {/* Task Manager Introduction */}
      <div className="w-full lg:w-1/2 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl lg:mb-6">
            Welcome to Task Tracker
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
              Why Choose Task Tracker?
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

      {/* Sign Up Form */}
      <div className="flex w-full items-center bg-gradient-to-r from-blue-400 to-blue-300 p-4 lg:w-1/2 lg:p-8">
        <Card className="mx-auto w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Sign up for Task Tracker to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      value={email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-contact">Contact Number</Label>
                    <Input
                      id="signup-contact"
                      name="contactNumber"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-birthdate">Date of Birth</Label>
                    <Input
                      id="signup-birthdate"
                      name="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
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
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
