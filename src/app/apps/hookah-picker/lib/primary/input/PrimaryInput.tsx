'use client';

import { useState } from "react";

interface Props {
	isCheckbox?: boolean;
	options?: string[];
  label?: string;
  register?: any;
}

export const PrimaryInput: React.FC<Props> = ({
	isCheckbox = true,
	options = [],
  label,
}) => {
	const [value, setValue] = useState("");

	if (isCheckbox) {
		return (
			<div className='flex flex-col'>
        <span>{label}</span>
				{options.map(option => (
					<label
						key={option}
						className='flex items-center'
					>
						<input
							type='checkbox'
							className='mr-2'
							value={option}
							onChange={e => setValue(e.target.value)}
						/>
						{option}
					</label>
				))}
			</div>
		);
	}

	return (
		<input
      type="text"
			className='border border-gray-300 rounded-md p-2'
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	);
};
