import { useRouter } from "next/navigation";
import { useLocalStorage } from "./useLocalStorage";
import { useAuthContext } from "@/providers/AuthProvider";

export const useLoginLogout = () => {
  const { setLSItem, removeLSItem } = useLocalStorage("user");
	const { dispatch } = useAuthContext();
  const router = useRouter();

  const login = (user: any) => {
    dispatch({ type: "SET_USER", payload: user });
    setLSItem(JSON.stringify(user));
    router.push("/");
  };

  const logout = () => {
    removeLSItem();
    router.push("/login");
  };

  return { login, logout };
};