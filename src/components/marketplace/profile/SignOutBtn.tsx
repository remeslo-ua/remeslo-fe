"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { PrimaryButton } from "../common/primary/PrimaryButton";

export const SignOutBtn = () => {
  const { logout } = useAuthContext();

  return (
    <PrimaryButton
      text="Sign Out"
      type="button"
      onClick={logout}
      color="bg-red-500"
      styles="hover:bg-red-600"
    />
  );
};