'use client';

import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { profileInputs } from "./ProfileInputs";
import { useAuthContext } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { getAuth, updateProfile } from "firebase/auth";

export const ProfileForm = () => {
  const auth = getAuth();
  const { state: { user } } = useAuthContext();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);

    // updateProfile(auth.currentUser, {
    //   displayName: data.displayName,
    //   photoURL: data.photoURL
    // }).then(() => {
    //   console.log('updateProfile success');
    // }).catch((error) => {
    //   console.log('updateProfile error', error);
    // });
  };

  console.log(auth.currentUser)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {profileInputs.map(({name, label, type, validation}) => (
          <PrimaryInput
            key={name}
            register={register}
            name={name}
            label={label}
            type={type}
            validation={validation}
            errors={errors}
          />
      ))}

      <PrimaryButton text="Save Changes" />
      
    </form>
  )
};