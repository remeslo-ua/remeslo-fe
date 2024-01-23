"use client";
import { auth } from "@/firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";

type State = {
  user: User | null;
  isLoading: boolean;
};

type Action = { type: string; payload?: any };

const initialState: State = {
  user: null,
  isLoading: true,
};

const AuthContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          user: action.payload,
        };
      case "SET_LOADING":
        return {
          ...state,
          isLoading: action.payload,
        };
      default:
        return state;
    }
  }, initialState);

  onAuthStateChanged(auth, (user) => {
    const currentUrl = window.location.href;
    if (user) {
      if (state.user === null) {
        dispatch({ type: "SET_USER", payload: user });
      }
    } else {
      if (
        !currentUrl.includes("/login") &&
        !currentUrl.includes("/for-guests") &&
        !currentUrl.includes("/signup")
      ) {
        router.push("for-guests");
      }
      console.warn("User is signed out");
    }

    if (state.isLoading) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  });

  if (state.isLoading) {
    return <div className="h-[100vh] flex justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
