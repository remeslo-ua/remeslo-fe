"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthContextProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Amplitude } from "@/analitics/amplitude/amplitude";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<Amplitude />
			<AuthContextProvider>{children}</AuthContextProvider>
			<Toaster />
		</NextUIProvider>
	);
}
