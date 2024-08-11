"use client";
import { logInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryInput } from "../../common/primary/PrimaryInput";
import { PrimaryButton } from "../../common/primary/PrimaryButton";

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
    // await loginUser(email, password);
    router.push("/");
    setIsLoading(false);
  };

  return (
    <div className="flex justify-end items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[50vw] flex flex-col gap-3 p-5 justify-center"
      >
        <h1 className="prose-titleH1 m-5">login</h1>

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
