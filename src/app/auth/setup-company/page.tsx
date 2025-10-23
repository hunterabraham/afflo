"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
import { toast } from "sonner";

export default function SetupCompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const handleCompanySetup = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const companyName = formData.get("companyName") as string;
      const domain = formData.get("domain") as string;
      const shopifySecret = formData.get("shopifySecret") as string;

      const response = await fetch("/api/auth/setup-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          domain,
          shopifySecret,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to setup company");
      }

      toast.success("Company setup completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to setup company",
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
            Complete Your Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your company to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              We need some basic information about your company to set up your
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCompanySetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Company Domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="example.com"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be used to identify your company
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopifySecret">Shopify Secret (Optional)</Label>
                <Input
                  id="shopifySecret"
                  name="shopifySecret"
                  type="password"
                  placeholder="Enter your Shopify secret key"
                />
                <p className="text-xs text-gray-500">
                  You can add this later in your settings if you don't have it
                  now
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
