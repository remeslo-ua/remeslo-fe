"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { regInputs } from "./inputs";
import { PrimaryButton } from "../../common/primary/PrimaryButton";
import { PrimaryInput } from "../../common/primary/PrimaryInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/constants/validations/authValidations";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";

interface regFormInputs {
  login: string;
  password: string;
  passwordConfirm: string;
}

export const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<regFormInputs>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      login: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async ({ login, password }: regFormInputs) => {
    console.log("onSubmit called with", { login, password });
    setIsLoading(true);
    try {
      const response = await fetch(ROUTES.API.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: login, password }),
      });

      const data = await response.json();
      console.log("API response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Registration successful! Please login.");
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <form 
        className="flex flex-col gap-3 p-5 justify-center" 
        onSubmit={handleSubmit(onSubmit)}
        >
        <h1 className="prose-titleH1 m-5">Registration</h1>

        {regInputs.map(({ name, label, id, type }) => (
          <PrimaryInput
            key={id}
            name={name}
            label={label}
            type={type}
            register={register}
            errors={errors}
          />
        ))}
        <PrimaryButton
          text="Register"
          isDisabled={!!errors.passwordConfirm}
        />
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};
