"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthContextProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Amplitude } from "@/analitics/amplitude/amplitude";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<Amplitude />
			<ThemeProvider>
				<AuthContextProvider>{children}</AuthContextProvider>
			</ThemeProvider>
			<Toaster />
		</NextUIProvider>
	);
}
