import { ResStatus } from "@/constants/apiStatus/resStatus";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";

export const registerUser = async(email: string, password: string) => {
  const user = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
        toast.success("Registered! Please check your email to verify your account");
      }

      return { status: ResStatus.SUCCESS, ...user };
    })
    .catch((error) => {
      const formattedErrorMsg = error.message.split('/')[1].split(')')[0].split('-').join(' ');
      toast.error(formattedErrorMsg);

      return { status: ResStatus.BAD_REQUEST, error: error};
    });

  return user;
};
