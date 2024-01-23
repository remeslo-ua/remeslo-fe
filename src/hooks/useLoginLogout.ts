import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

export const useLoginLogout = () => {
	const { dispatch } = useAuthContext();
  const router = useRouter();

  const login = (user: any) => {
    dispatch({ type: "SET_USER", payload: user });
    toast.success('Logged in successfully')
    router.push("/");
  };

  const logout = () => {
    signOut(auth).then(() => {
      dispatch({ type: "SET_USER", payload: null });
      toast.success('Signed out successfully')
      router.push("for guests");
    }).catch((error) => {
      toast.error(error.message);
    });
  };

  return { login, logout };
};