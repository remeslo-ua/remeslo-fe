"use client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";
import amplitude from "@/analitics/amplitude/amplitude";

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  accessibleApps: string[];
  createdAt: string;
  updatedAt: string;
}

type State = {
  user: User | null;
  isLoading: boolean;
  token: string | null;
};

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TOKEN"; payload: string | null }
  | { type: "LOGOUT" };

const initialState: State = {
  user: null,
  isLoading: true,
  token: null,
};

const AuthContext = createContext<
  { state: State; dispatch: Dispatch<Action>; login: (email: string, password: string) => Promise<void>; logout: () => void } | undefined
>(undefined);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "SET_USER":
        // Identify user in Amplitude when user is set
        if (action.payload) {
          amplitude.setUserId(action.payload._id);
          amplitude.identify(
            new amplitude.Identify()
              .set("email", action.payload.email)
              .set("name", action.payload.name || "")
              .set("role", action.payload.role)
              .set("accessibleApps", action.payload.accessibleApps)
              .set("loginTime", new Date().toISOString())
          );
        } else {
          amplitude.reset(); // Clear user identity on logout
        }
        return {
          ...state,
          user: action.payload,
        };
      case "SET_LOADING":
        return {
          ...state,
          isLoading: action.payload,
        };
      case "SET_TOKEN":
        if (action.payload) {
          localStorage.setItem("token", action.payload);
        } else {
          localStorage.removeItem("token");
        }
        return {
          ...state,
          token: action.payload,
        };
      case "LOGOUT":
        localStorage.removeItem("token");
        amplitude.reset(); // Clear amplitude user identity
        return {
          ...state,
          user: null,
          token: null,
        };
      default:
        return state;
    }
  }, initialState);

  // Check for existing token on mount and validate it
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Validate token with server
          const response = await fetch("/api/auth/validate", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch({ type: "SET_USER", payload: data.user });
            dispatch({ type: "SET_TOKEN", payload: token });
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
        }
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(ROUTES.API.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      dispatch({ type: "SET_USER", payload: data.user });
      dispatch({ type: "SET_TOKEN", payload: data.token });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(ROUTES.API.AUTH.LOGOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      router.push(ROUTES.HOME);
    }
  };

  // if (state.isLoading) {
  //   return <div className="h-[100vh] flex justify-center">Loading...</div>;
  // }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
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
