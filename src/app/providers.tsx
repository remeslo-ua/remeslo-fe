"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthContextProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<AuthContextProvider>{children}</AuthContextProvider>
			<Toaster />
		</NextUIProvider>
	);
}
