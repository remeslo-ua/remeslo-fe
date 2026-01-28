import { Language } from "@/types/Language";

let translations: Record<Language, any> = {
  en: {},
  uk: {},
};

// Load translations
async function loadTranslations() {
  try {
    const en = await fetch("/locales/en.json").then((r) => r.json());
    const uk = await fetch("/locales/uk.json").then((r) => r.json());
    translations.en = en;
    translations.uk = uk;
  } catch (error) {
    console.error("Failed to load translations:", error);
  }
}

// Initialize on load
loadTranslations();

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
