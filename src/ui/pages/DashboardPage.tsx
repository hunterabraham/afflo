import { useSession } from "next-auth/react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "~/ui/components/app-sidebar";
import { ChartAreaInteractive } from "~/ui/components/chart-area-interactive";
import { DataTable } from "~/ui/components/data-table";
import { SectionCards } from "~/ui/components/section-cards";
import { SiteHeader } from "~/ui/components/site-header";
import { SidebarInset, SidebarProvider } from "~/ui/components/ui/sidebar";
import { Button } from "~/ui/components/ui/button";
import { signOut } from "next-auth/react";
import data from "~/ui/dashboard-data.json";
import Page from "~/ui/_components/page/page";

export default function DashboardPage() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    navigate("/auth/login");
  };

  if (!session) {
    return null; // ProtectedRoute will handle redirect
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
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
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
