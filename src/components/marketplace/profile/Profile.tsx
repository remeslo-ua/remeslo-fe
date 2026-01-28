'use client';
import { ProfileForm } from "./profileForm/ProfileForm";
import { SignOutBtn } from "./SignOutBtn";
import { useAuthContext } from "@/providers/AuthProvider";
import { PrimaryButton } from "../common/primary/PrimaryButton";
import Link from "next/link";
import AuthGuard from "../../AuthGuard";
import { ROUTES } from "@/constants/routes";

export const Profile = () => {
  const { state } = useAuthContext();

  if (!state.user) {
    return <div>Please log in to view your profile.</div>;
  }

  const { name, email } = state.user;

  return (
    <AuthGuard>
      <div className="m-5 flex flex-col gap-5">
        <div>
          <div>{name || email}</div>
          <div>Here is your Remeslo Profile</div>
          <div>Define how the community will see you</div>
          <div>Build your persona carefully</div>
        </div>

        <div>
          <ProfileForm />
        </div>

        <div className="flex gap-4 justify-center">
          <Link href={ROUTES.HOME}>
            <PrimaryButton
              text="Go Back Home"
              type="button"
              color="bg-gray-500"
              styles="hover:bg-gray-600"
            />
          </Link>
          <SignOutBtn />
        </div>
      </div>
    </AuthGuard>
  );
};