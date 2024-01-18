import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";

export const useLoginLogout = () => {
	const { dispatch } = useAuthContext();
  const router = useRouter();

  const login = (user: any) => {
    dispatch({ type: "SET_USER", payload: user });
    router.push("/");
  };

  const logout = () => {
    
    router.push("/login");
  };

  return { login, logout };
};