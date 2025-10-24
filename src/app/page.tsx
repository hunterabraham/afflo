import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Afflo - Home",
  description: "Affiliate Management Platform",
};

// This page will be dynamically rendered due to auth() usage
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // If user is authenticated, redirect to dashboard
  redirect("/dashboard");
}
