import { ROUTES } from "@/constants/routes";

export type MenuItem = {
  label: string;
  type: "link" | "action";
  href?: string;
  action?: () => void;
  color?: any;
};

export const menuItems: MenuItem[] = [
  {
    label: "Profile",
    type: "link",
    href: ROUTES.AUTH.PROFILE,
    color: "foreground",
  },
  {
    label: "Help & Feedback",
    type: "link",
    href: "/help",
    color: "default",
  },
  {
    label: "Log Out",
    type: "action",
    color: "danger",
  },
];