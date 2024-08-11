"use client";

import { registerUser } from "@/api/auth/register";
import "../../../firebase/firebase";
import { useForm } from "react-hook-form";
import { regInputs } from "./inputs";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { useRouter } from "next/navigation";
import { ResStatus } from "@/constants/apiStatus/resStatus";

interface regFormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<regFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async ({ email, password }: regFormInputs) => {
    const regRes = await registerUser(email, password);

    if (regRes.status === ResStatus.SUCCESS) {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-end items-center overflow-scroll">
      <form 
        className="w-[50vw] flex flex-col gap-3 p-5 justify-center" 
        onSubmit={handleSubmit(onSubmit)}
        >
        <h1 className="prose-titleH1 m-5">Registration</h1>

        {regInputs.map(({ name, label, id, type, validation }) => (
          <PrimaryInput
            key={id}
            name={name}
            label={label}
            type={type}
            register={register}
            validation={validation}
            errors={errors}
          />
        ))}
        <PrimaryButton
          text="Register"
          isDisabled={!!errors.passwordConfirm}
        />
      </form>
    </div>
  );
};
