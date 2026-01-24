"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { PrimaryButton } from "../components/marketplace/common/primary/PrimaryButton";
import { AppsSection } from "../components/AppsSection";
import Link from "next/link";

export default function Home() {
  const { state } = useAuthContext();

  return (
    <main className="min-h-screen p-8">
      <div>
        <h1 className="flex justify-center text-4xl font-bold mb-8">HOME PAGE</h1>

        {!state.user ? (
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/marketplace/login">
              <PrimaryButton
                text="Login"
                type="button"
                color="bg-blue-500"
                styles="hover:bg-blue-600"
              />
            </Link>
            <Link href="/marketplace/register">
              <PrimaryButton
                text="Register"
                type="button"
                color="bg-green-500"
                styles="hover:bg-green-600"
              />
            </Link>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome back, {state.user.name || state.user.email}!
            </h2>
            <p className="text-gray-600 mb-4">Choose an app to get started</p>
            <div className="flex justify-center">
              <Link href="/marketplace/profile">
                <PrimaryButton
                  text="View Profile"
                  type="button"
                  color="bg-purple-500"
                  styles="hover:bg-purple-600"
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {state.user && <AppsSection />}
    </main>
  );
}
