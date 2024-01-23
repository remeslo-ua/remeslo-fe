import { ResStatus } from "@/constants/apiStatus/resStatus";
import { auth } from "@/firebase/firebase";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

export const loginUser = async(email: string, password: string) => {
  const data = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user: User = userCredential.user;
      
      return {...user, status: ResStatus.SUCCESS};
    })
    .catch((error) => {
      toast.error('Login failed. Something went wrong.');
      return { status: ResStatus.UNAUTHORIZED , error: error };
    });
  
  return data;
};