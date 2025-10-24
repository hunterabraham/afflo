import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Afflo",
  description: "Sign in or create your Afflo account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
