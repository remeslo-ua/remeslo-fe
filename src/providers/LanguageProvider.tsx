"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "./AuthProvider";

type Language = "en" | "uk";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { state } = useAuthContext();
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = () => {
      // If user is logged in, use their language preference from database
      if (state.user) {
        const userLanguage = (state.user as any).language || "en";
        setLanguageState(userLanguage);
        localStorage.setItem("language", userLanguage);
      } else {
        // If no user, check localStorage
        const savedLanguage = localStorage.getItem("language") as Language | null;
        
        if (savedLanguage) {
          setLanguageState(savedLanguage);
        } else {
          // Detect browser language
          const browserLang = navigator.language.split("-")[0];
          const detectedLanguage: Language = browserLang === "uk" ? "uk" : "en";
          setLanguageState(detectedLanguage);
          localStorage.setItem("language", detectedLanguage);
        }
      }
      setIsLoading(false);
    };

    initializeLanguage();
  }, [state.user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    // If user is logged in, save to database
    if (state.user) {
      try {
        const token = localStorage.getItem("token");
        await fetch("/api/users/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ language: lang }),
        });
      } catch (error) {
        console.error("Failed to save language preference:", error);
      }
    }
  };

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
