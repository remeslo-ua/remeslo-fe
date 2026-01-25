"use client";
import { logInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryInput } from "../../common/primary/PrimaryInput";
import { PrimaryButton } from "../../common/primary/PrimaryButton";
import { useAuthContext } from "@/providers/AuthProvider";
import { loginSchema } from "@/constants/validations/authValidations";
import toast from "react-hot-toast";

interface logFormInputs {
  login: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();
  const { login: authLogin } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async ({ login, password }: logFormInputs) => {
    console.log(login, password);
    setIsLoading(true);
    try {
      await authLogin(login, password);
      toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-5 justify-center"
      >
        <h1 className="prose-titleH1 m-5">login</h1>

        {logInputs.map(
          ({ name, label, id, type, autocomplete }) => (
            <PrimaryInput
              key={id}
              name={name}
              label={label}
              type={type}
              register={register}
              autocomplete={autocomplete}
              errors={errors}
            />
          )
        )}
        <PrimaryButton text="Login" isLoading={isLoading} />
      </form>
    </div>
  );
};
