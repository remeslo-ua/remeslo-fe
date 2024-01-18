"use client";

import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { profileInputs } from "./ProfileInputs";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { updateProfile } from "firebase/auth";
import { useAuthContext } from "@/providers/AuthProvider";
import { use, useEffect } from "react";
import { ProfileFormFields } from "@/types/ProfileFormFields";
import { set } from "firebase/database";

export const ProfileForm = () => {
	const { user } = useAuthContext().state;
	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormFields>({
    defaultValues: {
      name: user?.displayName || 'null',
    },
  });

	const onSubmit = (data: any) => {
		if (user === null) {
			console.log("user is null");
			return;
		}

		console.log(data);

		updateProfile(user, {
			displayName: data.name,
			photoURL: data.imgUrl,
		})
			.then(() => {
				console.log("Profile updated");
			})
			.catch(error => {
				console.log(error);
			});
	};

  useEffect(() => {
    if (user && user.displayName) {
      setValue('name', user.displayName);
    }
    console.log(getValues());
  }, [user?.displayName, user]);
	
  
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
			<PrimaryButton text='Save Changes' />
		</form>
	);
};
