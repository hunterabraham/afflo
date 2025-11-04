import { Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "~/components/providers";
import { TRPCReactProvider } from "~/trpc/react";
import HomePage from "~/pages/HomePage";
import LoginPage from "~/pages/LoginPage";
import SetupCompanyPage from "~/pages/SetupCompanyPage";
import DashboardPage from "~/pages/DashboardPage";
import SettingsPage from "~/pages/SettingsPage";
import ProtectedRoute from "~/components/ProtectedRoute";

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
