import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { getApiBaseUrl } from "~/ui/api/config";

export function Providers({ children }: { children: React.ReactNode }) {
  // Configure NextAuth to use the backend server on port 8080
  // Try both basePath and baseUrl props for NextAuth v5 compatibility
  const authBaseUrl = `${getApiBaseUrl()}/api/auth`;

  return (
    <SessionProvider basePath={authBaseUrl}>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
