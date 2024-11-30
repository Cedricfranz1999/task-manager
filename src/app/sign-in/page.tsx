"use client";
import { api } from "@/trpc/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const { data: users, isLoading, isError } = api.Auth.Login.useQuery();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Ensure you're checking for users with the correct structure
    const user = users?.find(
      (user) => user.email === email && user.password === password, // Handle null passwords if necessary
    );

    if (user) {
      // Save email and password to localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      setError(null);
      router.push("/manage/DailyTask");
      window.alert("Successfully logged in");
    } else {
      setError("Invalid email or password.");
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      const user = users?.find(
        (user) =>
          user.email === storedEmail && user.password === storedPassword, // Handle null passwords if necessary
      );

      if (user) {
        router.push("/manage/DailyTask");
      }
    }
  }, [users, router]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-300">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-300">
        <p>Error fetching users. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login - Task Manager</title>
        <meta name="description" content="Login to your Task Manager account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-300">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="mb-4 text-center text-gray-600">
            Login to manage your tasks effectively.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="mb-4 text-center text-sm text-red-500">{error}</p>
            )}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 py-3 text-white transition duration-200 hover:bg-blue-500"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
