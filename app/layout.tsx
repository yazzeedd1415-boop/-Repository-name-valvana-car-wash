import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام خدمات غسيل السيارات",
  description: "نظام عربي لإدارة حجوزات وخدمات غسيل السيارات وبرنامج الولاء.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
