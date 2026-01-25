"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { AppsSection } from "../components/AppsSection";
import { Nav } from "@/components/marketplace/nav/Nav";

export default function Home() {
  const { state } = useAuthContext();

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
