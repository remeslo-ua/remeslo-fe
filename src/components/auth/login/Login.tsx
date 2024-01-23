"use client";

import "../../../firebase/firebase";
import { logInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { loginUser } from "@/api/auth/login";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface logFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: logFormInputs) => {
    setIsLoading(true);
    await loginUser(email, password);
    router.push("/");
    setIsLoading(false);
  };

  return (
    <div className="flex justify-end h-[100vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[50vw] flex flex-col gap-3 p-5 justify-center"
      >
        {logInputs.map(
          ({ name, label, id, type, autocomplete, validation }) => (
            <PrimaryInput
              key={id}
              name={name}
              label={label}
              type={type}
              register={register}
              autocomplete={autocomplete}
              validation={validation}
              errors={errors}
            />
          )
        )}
        <PrimaryButton text="Login" isLoading={isLoading} />
      </form>
    </div>
  );
};
