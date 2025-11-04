import { useState } from "react";
import { signIn } from "next-auth/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthService } from "~/ui/api";
import { Button } from "~/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/components/ui/card";
import { Input } from "~/ui/components/ui/input";
import { Label } from "~/ui/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/ui/components/ui/tabs";
import { Separator } from "~/ui/components/ui/separator";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // For now, we'll show OAuth buttons by default
  // In production, you'd want to check server-side or use a different approach
  const hasGoogleAuth = true; // This should be determined server-side

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/auth/setup-company",
        redirect: false,
      });

      if (result?.error) {
        toast.error("An error occurred during authentication.");
        setIsLoading(false);
      } else if (result?.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        navigate(callbackUrl);
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
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
        toast.error("Invalid email or password.");
        setIsLoading(false);
      } else if (result?.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        navigate(callbackUrl);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const handleCredentialsSignUp = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Create user account using the API service (which uses the correct base URL)
      await AuthService.postApiAuthSignup({
        requestBody: { name, email, password },
      });

      // Sign in the user
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/auth/setup-company",
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          "Account created but sign in failed. Please try signing in.",
        );
        navigate("/auth/login");
      } else if (result?.ok) {
        navigate("/auth/setup-company");
      }
    } catch (error) {
      let errorMessage = "Failed to create account";

      if (error instanceof Error) {
        // Check if it's an ApiError with a body containing error details
        if ("body" in error && error.body && typeof error.body === "object") {
          const apiError = error.body as { message?: string; error?: string };
          errorMessage = apiError.message || apiError.error || error.message;
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
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
                {hasGoogleAuth && (
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
                <form
                  action={handleCredentialsSignIn}
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCredentialsSignIn(new FormData(e.currentTarget));
                  }}
                >
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
                  <Button
                    isLoading={isLoading}
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Sign In
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
                {hasGoogleAuth && (
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
                <form
                  action={handleCredentialsSignUp}
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCredentialsSignUp(new FormData(e.currentTarget));
                  }}
                >
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
                  <Button
                    isLoading={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    Create Account
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
