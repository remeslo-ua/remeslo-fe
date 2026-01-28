"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { getTranslation } from "@/lib/translations";

export const useTranslations = () => {
  const { language } = useLanguage();

  return (key: string, defaultValue?: string) => {
    return getTranslation(language, key, defaultValue);
  };
};
