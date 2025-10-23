"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  // For now, we'll show OAuth buttons by default
  // In production, you'd want to check server-side or use a different approach
  const hasGoogleAuth = true; // This should be determined server-side
  const hasShopifyAuth = true; // This should be determined server-side

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/auth/setup-company",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Authentication failed. Please try again.");
      } else if (result?.ok) {
        // Check if user needs to complete company setup
        const session = await getSession();
        if (session?.user) {
          router.push("/auth/setup-company");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSignUp = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Create user account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create account");
      }

      // Sign in the user
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/auth/setup-company",
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          "Account created but sign in failed. Please try signing in manually.",
        );
      } else if (result?.ok) {
        router.push("/auth/setup-company");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Afflo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OAuth Buttons - Only show if providers are configured */}
                {(hasGoogleAuth || hasShopifyAuth) && (
                  <>
                    <div className="space-y-2">
                      {hasGoogleAuth && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleOAuthSignIn("google")}
                          disabled={isLoading}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      )}
                      {hasShopifyAuth && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleOAuthSignIn("shopify")}
                          disabled={isLoading}
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M15.337 23.979c-.372 0-.657-.123-.857-.37-.2-.246-.3-.573-.3-.97 0-.396.1-.723.3-.97.2-.246.485-.37.857-.37.372 0 .657.124.857.37.2.247.3.574.3.97 0 .397-.1.724-.3.97-.2.246-.485.37-.857.37zm-9.65 0c-.372 0-.657-.123-.857-.37-.2-.246-.3-.573-.3-.97 0-.396.1-.723.3-.97.2-.246.485-.37.857-.37.372 0 .657.124.857.37.2.247.3.574.3.97 0 .397-.1.724-.3.97-.2.246-.485.37-.857.37z" />
                            <path d="M22.67 6.33c-.246 0-.456.082-.63.246-.174.164-.26.37-.26.62 0 .25.086.456.26.62.174.164.384.246.63.246.246 0 .456-.082.63-.246.174-.164.26-.37.26-.62 0-.25-.086-.456-.26-.62-.174-.164-.384-.246-.63-.246z" />
                          </svg>
                          Continue with Shopify
                        </Button>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-2">
                          Or continue with
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Credentials Form */}
                <form action={handleCredentialsSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Create a new account to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OAuth Buttons - Only show if providers are configured */}
                {(hasGoogleAuth || hasShopifyAuth) && (
                  <>
                    <div className="space-y-2">
                      {hasGoogleAuth && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleOAuthSignIn("google")}
                          disabled={isLoading}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      )}
                      {hasShopifyAuth && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleOAuthSignIn("shopify")}
                          disabled={isLoading}
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M15.337 23.979c-.372 0-.657-.123-.857-.37-.2-.246-.3-.573-.3-.97 0-.396.1-.723.3-.97.2-.246.485-.37.857-.37.372 0 .657.124.857.37.2.247.3.574.3.97 0 .397-.1.724-.3.97-.2.246-.485.37-.857.37zm-9.65 0c-.372 0-.657-.123-.857-.37-.2-.246-.3-.573-.3-.97 0-.396.1-.723.3-.97.2-.246.485-.37.857-.37.372 0 .657.124.857.37.2.247.3.574.3.97 0 .397-.1.724-.3.97-.2.246-.485.37-.857.37z" />
                            <path d="M22.67 6.33c-.246 0-.456.082-.63.246-.174.164-.26.37-.26.62 0 .25.086.456.26.62.174.164.384.246.63.246.246 0 .456-.082.63-.246.174-.164.26-.37.26-.62 0-.25-.086-.456-.26-.62-.174-.164-.384-.246-.63-.246z" />
                          </svg>
                          Continue with Shopify
                        </Button>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-2">
                          Or create account with
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Sign Up Form */}
                <form action={handleCredentialsSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
