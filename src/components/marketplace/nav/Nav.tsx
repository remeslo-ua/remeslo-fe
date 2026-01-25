"use client";

import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
} from "@nextui-org/react";
import { useState } from "react";
import { menuItems } from "./menuItems";
import { useAuthContext } from "@/providers/AuthProvider";
import { NavMenuItem } from "./NavMenuItem";
import { SignupLoginBtns } from "./SignupLoginBtns";
import { PWAInstallMenuItem } from "./PWAInstallMenuItem";

export const Nav = () => {
  const { state } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      {state.user ? (
        <>
          <NavbarContent className="absolute">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          {/* <ProfileBtn /> */}
        </>
      ) : (
        <SignupLoginBtns />
      )}
      <NavbarMenu>
        <PWAInstallMenuItem />
        {menuItems.map((item, index) => (
          <NavMenuItem key={index} item={item} index={index} />
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
