import { useSession } from "next-auth/react";
import { AppSidebar } from "~/ui/components/app-sidebar";
import { SiteHeader } from "~/ui/components/site-header";
import { SidebarInset, SidebarProvider } from "~/ui/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/components/ui/card";
import SettingsCard from "~/ui/components/settings/settings-card";

export default function SettingsPage() {
  const { data: session } = useSession();

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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                      Manage your account settings and preferences
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                          Update your profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Name</p>
                            <p className="text-muted-foreground text-sm">
                              {session.user?.name || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-muted-foreground text-sm">
                              {session.user?.email || "Not set"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <SettingsCard
                      title="Notifications"
                      description="Configure your notification preferences"
                    >
                      <p className="text-muted-foreground text-sm">
                        Notification settings coming soon
                      </p>
                    </SettingsCard>

                    <Card>
                      <CardHeader>
                        <CardTitle>Integrations</CardTitle>
                        <CardDescription>
                          Connect with external services
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Integration settings coming soon
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                          Manage your security settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Security settings coming soon
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>
                          Customize your application experience
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Preference settings coming soon
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
