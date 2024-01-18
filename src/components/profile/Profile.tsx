'use client';

import { SignOutBtn } from "../common/signOutBtn/SignOutBtn";
import { ProfileForm } from "./profileForm/ProfileForm";

export const Profile = () => {
  return (
    <div className="h-[100vh] m-5 flex flex-col gap-5">
      <div>
        <div>Here is your Remeslo Profile</div>
        <div>Define how the community will see you</div>
        <div>Build your persona carefully</div>
      </div>

      <div>
        <ProfileForm />
      </div>

      <SignOutBtn />
    </div>
  );
};