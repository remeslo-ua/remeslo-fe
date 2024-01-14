import { NavbarMenuItem, Link } from "@nextui-org/react";

interface Props {
  item: string;
  index: number;
}

export const NavMenuItem: React.FC<Props> = ({ item, index }) => (
  <NavbarMenuItem>
    <Link
      className='w-full'
      color={
        index === 2
          ? "warning"
          : index === 5
          ? "danger"
          : "foreground"
      }
      href={item}
      size='lg'
    >
      {item}
    </Link>
  </NavbarMenuItem>
);