import { Avatar, Badge, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export const ProfileBtn = () => {
	const router = useRouter();

	return (
		<NavbarContent className='absolute right-5'>
			<NavbarBrand
				className='cursor-pointer'
				onClick={() => {
					router.push(ROUTES.AUTH.PROFILE);
				}}
			>
				<Badge
					content='3'
					color='primary'
				>
					<Avatar
						radius='md'
						size='sm'
						src='https://i.pravatar.cc/300?u=a042581f4e29026709d'
					/>
				</Badge>
			</NavbarBrand>
		</NavbarContent>
	);
};
