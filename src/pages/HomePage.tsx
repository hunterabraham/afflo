import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      navigate("/auth/login");
    } else {
      navigate("/dashboard");
    }
  }, [session, status, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
