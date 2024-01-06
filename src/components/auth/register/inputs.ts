import { validations } from "@/constants/validations/authValidations";

export const regInputs = [
  {
    id: '1',
    name: "email",
    type: "email",
    label: "Email",
    validation: validations.email,
  },
  {
    id: '2',
    name: "password",
    type: "password",
    label: "Password",
    validation: validations.password,
  },
  {
    id: '3',
    name: "passwordConfirm",
    type: "password",
    label: "Confirm Password",
    validation: {
      ...validations.password,
      validate: (value: string, { password }: any) => {
        return value === password || "The passwords do not match";
      },
    },
  },
];