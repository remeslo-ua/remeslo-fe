"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import "../api/auth/firebase";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Nav } from "@/components/nav/Nav";

export default function Home() {
	const { state } = useAuthContext();
	
	return (
		<main className="h-[100vh]">
			{!state.user ? (
				<div>
					<h1>You have to login first!</h1>
				</div>
			) : (
				<div>
					<Nav />
				</div>
			)}
		</main>
	);
}
