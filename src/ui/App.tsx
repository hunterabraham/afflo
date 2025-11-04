import { Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "~/ui/components/providers";
import { TRPCReactProvider } from "~/ui/trpc/react";
import HomePage from "~/ui/pages/HomePage";
import LoginPage from "~/ui/pages/LoginPage";
import SetupCompanyPage from "~/ui/pages/SetupCompanyPage";
import DashboardPage from "~/ui/pages/DashboardPage";
import SettingsPage from "~/ui/pages/SettingsPage";
import ProtectedRoute from "~/ui/components/ProtectedRoute";

function App() {
  return (
    <Providers>
      <TRPCReactProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/auth/setup-company"
            element={
              <ProtectedRoute>
                <SetupCompanyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TRPCReactProvider>
    </Providers>
  );
}

export default App;
