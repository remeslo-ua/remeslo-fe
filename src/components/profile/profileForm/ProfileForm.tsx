"use client";
import { PrimaryInput } from "@/components/common/primary/PrimaryInput";
import { profileInputs } from "./ProfileInputs";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "@/components/common/primary/PrimaryButton";
import { updateProfile } from "firebase/auth";
import { useAuthContext } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { ProfileFormFields } from "@/types/ProfileFormFields";
import { auth } from "@/firebase/firebase";

export const ProfileForm = () => {
	const { currentUser } = auth;
	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormFields>({
		defaultValues: {
			name: currentUser?.displayName || 'null',
		},
	});

	const onSubmit = (data: any) => {
		if (currentUser === null) {
			console.log("user is null");
			return;
		}

		// console.log(data);

		updateProfile(currentUser, {
			displayName: data.name,
		})
			.then(() => {
				console.log("Profile updated");
			})
			.catch(error => {
				console.log('error profile', error);
			});
	};

	useEffect(() => {
		if (currentUser && currentUser.displayName) {
			console.log(currentUser.displayName);
			setValue('name', currentUser.displayName);
		}
	}, [currentUser?.displayName, currentUser]);


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
