import { Language } from "@/types/Language";
import enTranslations from "../../public/locales/en.json";
import ukTranslations from "../../public/locales/uk.json";

const translations: Record<Language, any> = {
  en: enTranslations,
  uk: ukTranslations,
};

export function getTranslation(
  lang: Language,
  key: string,
  defaultValue?: string
): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === "string" ? value : defaultValue || key;
}
