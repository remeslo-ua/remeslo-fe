import {
	Navbar,
	NavbarBrand,
	NavbarMenuToggle,
	NavbarMenuItem,
	NavbarMenu,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from "@nextui-org/react";
import { PrimaryButton } from "../common/primary/PrimaryButton";
import { PrimaryIconBtn } from "../common/primary/PrimaryIconBtn";
import { useLoginLogout } from "@/hooks/useLoginLogout";
import { useState } from "react";
import { FakeLogo } from "@/icons/FakeLogo";
import { menuItems } from "./menuItems";
import { useAuthContext } from "@/providers/AuthProvider";

export const Nav = () => {
	const { state } = useAuthContext();
	const { logout } = useLoginLogout();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarContent justify='start'>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
			</NavbarContent>

			<NavbarContent
				className='p-3'
				justify='center'
			>
				<NavbarBrand>
					<FakeLogo />
				</NavbarBrand>
			</NavbarContent>

			{!state.user && (
				<NavbarContent justify='end'>
					<NavbarItem className='hidden lg:flex'>
						<Link href='#'>Login</Link>
					</NavbarItem>
					<NavbarItem>
						<Button
							as={Link}
							color='warning'
							href='#'
							variant='flat'
						>
							Sign Up
						</Button>
					</NavbarItem>
				</NavbarContent>
			)}

			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className='w-full'
							color={
								index === 2
									? "warning"
									: index === menuItems.length - 1
									? "danger"
									: "foreground"
							}
							href='#'
							size='lg'
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
};
