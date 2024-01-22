"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import "../firebase/firebase";

export default function Home() {
	const { state } = useAuthContext();
	const { isLoading } = state;

	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	return (
		<main>
			<div>
				<h1 className="flex justify-center">HOME signed in</h1>
			</div>
		</main>
	);
}
