"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { AppsSection } from "../components/AppsSection";
import { Nav } from "@/components/marketplace/nav/Nav";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  const { state } = useAuthContext();
  const router = useRouter();

  // Redirect to budgeting app if user only has budgeting app accessible
  useEffect(() => {
    if (state.user && state.user.accessibleApps.length === 1 && state.user.accessibleApps.includes('budgeting')) {
      router.push(ROUTES.BUDGETING.HOME);
    }
  }, [state.user, router]);

  return (
    <main>
        <Nav />
      <div className="p-4">
        <h1 className="flex justify-center text-4xl font-bold mb-8">HOME PAGE</h1>
        {!state.user ? (
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex justify-center">
              you have to be registered and logged in to see available apps
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome back{`, ${state.user.name || state.user.email}`}!
            </h2>
            <p className="text-gray-600 mb-4">Choose an app to get started</p>
            <div className="flex flex-col gap-4">
              <AppsSection />
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
