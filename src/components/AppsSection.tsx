"use client";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useAuthContext } from "@/providers/AuthProvider";
import { useEffect } from "react";
import amplitude from "@/analitics/amplitude/amplitude";

interface App {
  id: string;
  name: string;
  description: string;
  href: string;
}

const allApps: App[] = [
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Buy and sell products in our community marketplace",
    href: "/marketplace",
  },
  {
    id: "hookah-picker",
    name: "Hookah Picker",
    description: "Find the perfect hookah setup for your needs",
    href: "/apps/hookah-picker",
  },
  {
    id: "budgeting",
    name: "Budgeting Tool",
    description: "Manage your small business finances effectively",
    href: "/apps/budgeting",
  },
];

export const AppsSection = () => {
  const { state } = useAuthContext();

  // Log event when user enters the app section
  useEffect(() => {
    if (state.user) {
      amplitude.track('apps_section_viewed', {
        userName: state.user.name,
        userRole: state.user.role,
      });
    }
  }, []);

  // Filter apps based on user role and accessible apps
  const getAvailableApps = () => {
    if (!state.user) return [];

    if (state.user.role === 'admin') {
      return allApps; // Admins can access all apps
    }

    // Regular users can only access apps in their accessibleApps array
    return allApps.filter(app => state.user!.accessibleApps.includes(app.id));
  };

  const handleAppClick = (appId: string, appName: string) => {
    amplitude.track('app_clicked', {
      appId,
      appName,
    });
  };

  const availableApps = getAvailableApps();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">Available Apps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {availableApps.map((app) => (
          <Link key={app.name} href={app.href} onClick={() => handleAppClick(app.id, app.name)}>
            <Card className="transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold">{app.name}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">{app.description}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};