"use client";
import { PrimaryInput } from "../../common/primary/PrimaryInput";
import { profileInputs } from "./ProfileInputs";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../common/primary/PrimaryButton";
import { useAuthContext } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { ProfileFormFields } from "@/types/ProfileFormFields";
import toast from "react-hot-toast";

export const ProfileForm = () => {
  const { state } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormFields>({
    defaultValues: {
      name: state.user?.name || "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!state.user) {
      console.log("user is null");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${state.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.token}`,
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("error profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.user && state.user.name) {
      setValue("name", state.user.name);
    }
  }, [state.user?.name, state.user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {profileInputs.map(({ name, label, type, validation }) => (
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
  );
};
