"use client";

import { useLanguage } from "@/providers/LanguageProvider";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as "en" | "uk")}
      className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-sm"
    >
      <option value="en">English</option>
      <option value="uk">Українська</option>
    </select>
  );
};
