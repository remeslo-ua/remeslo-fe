'use client';
import { SignOutBtn } from "../common/signOutBtn/SignOutBtn";
import { ProfileForm } from "./profileForm/ProfileForm";
import { auth } from "@/firebase/firebase";

export const Profile = () => {
  const { currentUser } = auth;

  if (currentUser === null) {
    console.log("user is null");
    return;
  } 
  console.log('user is here', currentUser);

  const { displayName } = currentUser;

  return (
    <div className="m-5 flex flex-col gap-5">
      <div>
        <div>{displayName}</div>
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