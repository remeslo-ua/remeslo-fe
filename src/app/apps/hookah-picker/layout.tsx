import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeSwitcher from "./common/ThemeSwitch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "hookah_picker",
  description: "hookah_picker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeSwitcher />
        {children}
      </body>
    </html>
  );
}
