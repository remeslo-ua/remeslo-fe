'use client';

import { useLoginLogout } from "@/hooks/useLoginLogout";
import { Button } from "@nextui-org/react";

export const SignOutBtn = () => {
  const { logout } = useLoginLogout();
  return (
    <div>
      <Button onClick={logout}>Sign Out</Button>
    </div>
  );
};