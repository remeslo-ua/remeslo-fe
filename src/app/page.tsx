"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import "../firebase/firebase";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Nav } from "@/components/nav/Nav";

export default function Home() {
	const { state } = useAuthContext();
	const { isLoading } = state;

	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	return (
		<main className="h-[100vh]">
			<div>
				<h1 className="flex justify-center">HOME</h1>
			</div>
		</main>
	);
}
