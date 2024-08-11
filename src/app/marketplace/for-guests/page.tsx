import Link from "next/link";

export default function ForGuests() {
  return (
    <div className="h-[100vh]">
      <h1>Here will be content for guests...</h1>

      <Link href="login">Login</Link>
    </div>
  );
};