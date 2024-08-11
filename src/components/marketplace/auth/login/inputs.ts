import { validations } from "@/constants/validations/authValidations";

export const logInputs = [
	{
		id: "1",
		name: "email",
		type: "email",
		label: "Email",
		autocomplete: "email",
		validation: validations.email,
	},
	{
		id: "2",
		name: "password",
		type: "password",
		label: "Password",
		autocomplete: "current-password",
		validation: { required: { value: true, message: "Password is required" }, },
	},
];
