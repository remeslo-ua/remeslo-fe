import { Input, autocomplete } from "@nextui-org/react";

interface Props {
	id: string;
	name: string;
	register: any;
	label: string;
	type?: string;
	autocomplete?: string;
	validation: any;
	errors?: any;
}

export const PrimaryInput: React.FC<Props> = ({
	id,
	name,
	register,
	label,
	type,
	autocomplete,
	validation,
	errors,
}) => {
	return (
		<div
			key={id}
			className='mb-5'
		>
			<Input
				{...register(name, validation)}
				label={label}
				width='100%'
				type={type}
				autoComplete={autocomplete}
				errorMessage={errors[name] && errors[name]?.message}
				classNames={{
					inputWrapper: [
						'border-2 border-black-200 h-[62px] bg-[#FFFFFF] text-start',
						`${errors[name] && 'border-danger-D300 bg-[#F7E8E8]'}`,
					],
					label: [
						'group-data-[focus=true]:text-primary',
						'group-data-[filled=true]:text-primary',
						'text-start',
						`${errors[name] && 'group-data-[filled=true]:text-danger-D300'}`,
						`${errors[name] && 'group-data-[focus=true]:text-danger-D300'}`,
					],
					errorMessage: 'text-danger-D300',
					helperWrapper: 'pl-2',
					description: 'text-[#474949]',
				}}
			/>
		</div>
	);
};
