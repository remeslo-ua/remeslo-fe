"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useTranslations } from "@/hooks";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "@/providers/ThemeProvider";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const t = useTranslations();

  return (
    <Select
      selectedKeys={[language]}
      onChange={(e) => setLanguage(e.target.value as "en" | "uk")}
      variant="bordered"
      aria-label={t("common.language", "Language")}
      classNames={{
        trigger: [
          "border-2",
          "h-10",
          "rounded-lg",
          theme === "dark"
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-black border-gray-300",
        ],
        value: [theme === "dark" ? "text-white" : "text-black"],
      }}
    >
      <SelectItem key="en" value="en">
        {t("common.english", "English")}
      </SelectItem>
      <SelectItem key="uk" value="uk">
        {t("common.ukrainian", "Українська")}
      </SelectItem>
    </Select>
  );
};
