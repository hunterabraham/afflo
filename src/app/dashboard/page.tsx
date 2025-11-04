import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { ChartAreaInteractive } from "~/components/chart-area-interactive";
import { DataTable } from "~/components/data-table";
import { SectionCards } from "~/components/section-cards";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { signOut } from "~/server/auth";
import { type Metadata } from "next";
import data from "../data.json";
import { api } from "~/trpc/react";
import Page from "~/app/_components/page/page";

export const metadata: Metadata = {
  title: "Dashboard - Afflo",
  description: "Your affiliate management dashboard",
};

// Force Node.js runtime for database operations
export const runtime = "nodejs";

// This page will be dynamically rendered due to auth() usage
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    console.log("No session found, redirecting to login");
    redirect("/auth/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <Page.Header
            title={`Welcome back, ${session.user?.name || session.user?.email}!`}
            description={`Manage your account settings and preferences`}
            rightButton={
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/auth/login" });
                }}
              >
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>
            }
          />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
