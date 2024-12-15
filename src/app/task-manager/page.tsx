"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  BarChart2,
  Calendar,
  BookOpen,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TaskMasterLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const id = target.getAttribute("href")?.slice(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", handleScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleScroll);
      });
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateToInstruction = () => {
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-blue-100">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link className="mr-6 flex items-center justify-center" href="#">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">Task Tracker</span>
          </Link>
          <nav
            className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col space-y-2 bg-background p-4 md:static md:flex md:flex-row md:space-x-6 md:space-y-0`}
          >
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#how-it-works"
            >
              How It Works
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#testimonials"
            >
              Testimonials
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#about"
            >
              About
            </Link>
          </nav>
          <Button
            className="ml-auto md:hidden"
            size="icon"
            variant="ghost"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Tasks with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Task Tracker helps you organize your work and education tasks
                  in one place. Stay productive and never miss a deadline.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" onClick={() => router.push("sign-in")}>
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={navigateToInstruction}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full bg-gray-50 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <BarChart2 className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-lg font-bold">Task Analytics</h3>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Track your productivity with detailed insights
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Calendar className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-lg font-bold">Smart Scheduling</h3>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Automatically organize your tasks and deadlines
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <BookOpen className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-lg font-bold">Education Mode</h3>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Special features for students and learners
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6" id="instruction">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-lg font-bold">Sign Up</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create your account in seconds
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-lg font-bold">Add Tasks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Input your work and study tasks
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-lg font-bold">Stay Organized</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Let Task Tracker handle the rest
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="calendar"
          className="w-full bg-gray-50 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Daily Tasks
            </h2>
            <Card className="mx-auto w-full max-w-3xl">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">October 20, 2024</h3>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Change Date
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium">3:00 AM</div>
                      <div className="ml-4 flex-1 rounded-md bg-primary/10 p-2">
                        <h4 className="font-medium">Early Morning Study</h4>
                        <p className="text-sm text-gray-500">
                          Review notes for upcoming exam
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium">5:00 AM</div>
                      <div className="ml-4 flex-1 rounded-md bg-primary/10 p-2">
                        <h4 className="font-medium">Exercise</h4>
                        <p className="text-sm text-gray-500">
                          Morning jog and stretching
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium">7:00 AM</div>
                      <div className="ml-4 flex-1 rounded-md bg-primary/10 p-2">
                        <h4 className="font-medium">Breakfast and Planning</h4>
                        <p className="text-sm text-gray-500">
                          Review days schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <img
                    src="image1.jpeg"
                    alt="image1.jpeg"
                    className="mb-4 h-40 w-40 rounded-full"
                  />
                  <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    Task Tracker has revolutionized how I manage my work tasks.
                    Highly recommended
                  </p>
                  <p className="font-bold">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Marketing Manager
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <img
                    src="image4.jpeg"
                    alt="Jane Smith"
                    className="mb-4 h-40 w-40 rounded-full"
                  />
                  <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    As a student, Task Trackerhelps me balance my studies and
                    part-time job effortlessly.
                  </p>
                  <p className="font-bold">Jane Smith</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    University Student
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <img
                    src="image3.jpeg"
                    alt="Alex Johnson"
                    className="mb-4 h-40 w-40 rounded-full"
                  />
                  <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    The analytics feature has helped me identify and improve my
                    productivity patterns
                  </p>
                  <p className="font-bold">Alex Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Freelance Designer
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="about"
          className="w-full bg-primary py-12 text-primary-foreground md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About Task Tracker
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Task Tracker was born out of a passion for productivity and a
                  desire to help people achieve more in their personal and
                  professional lives. Our team of dedicated developers and
                  productivity experts have created a tool that seamlessly
                  integrates into your daily routine, making task management
                  effortless and enjoyable.
                </p>
              </div>
              <Button
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                size="lg"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Task Tracker. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
