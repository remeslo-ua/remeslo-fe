"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { state } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading && !state.user) {
      router.push("/marketplace/login");
    }
  }, [state.isLoading, state.user, router]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!state.user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}