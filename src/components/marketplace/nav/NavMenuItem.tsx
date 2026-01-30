import { NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { MenuItem } from "./menuItems";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface Props {
  item: MenuItem;
}

export const NavMenuItem: React.FC<Props> = ({ item }) => {
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <NavbarMenuItem>
      {item.type === "link" && item.href ? (
        <Link
          className="w-full"
          color={item.color || "foreground"}
          href={item.href}
          size="lg"
        >
          {item.label}
        </Link>
      ) : (
        <Button
          className="w-full justify-start"
          color={item.color || "default"}
          variant="light"
          size="lg"
          onClick={handleLogout}
        >
          {item.label}
        </Button>
      )}
    </NavbarMenuItem>
  );
};