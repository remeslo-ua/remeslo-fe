import { Button, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";

export const SignupLoginBtns = () => (
  <NavbarContent justify='end'>
    <NavbarItem className='hidden lg:flex'>
      <Link href='/login'>Login</Link>
    </NavbarItem>
    <NavbarItem>
      <Button
        as={Link}
        color='warning'
        href='/register'
        variant='flat'
      >
        Sign Up
      </Button>
    </NavbarItem>
  </NavbarContent>
);