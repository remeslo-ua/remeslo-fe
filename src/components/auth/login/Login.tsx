"use client";

import "../../../api/auth/firebase";
import { logInputs } from "./inputs";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { loginUser } from "@/api/auth/login";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ResStatus } from "@/constants/apiStatus/resStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLoginLogout } from "@/hooks/useLoginLogout";

interface logFormInputs {
	email: string;
	password: string;
}

export const Login = () => {
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

	const { login } = useLoginLogout();

	const onSubmit = async ({ email, password }: logFormInputs) => {
		const res = await loginUser(email, password);
		
		if (res.status === ResStatus.SUCCESS) {
			login(res)
		}
	};

	return (
		<div className='flex justify-end h-[100vh]'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-[50vw] flex flex-col gap-3 p-5 justify-center'
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
				<PrimaryButton text='Login' />
			</form>
		</div>
	);
};
