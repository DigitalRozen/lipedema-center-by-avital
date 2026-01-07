import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "אביטל רוזן - מומחית ליפדמה | קליניקה לטיפול בליפדמה",
  description: "קליניקה מובילה לטיפול בליפדמה. מידע מקצועי, טיפולים מתקדמים ותמיכה מקצועית בדרך להחלמה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="font-hebrew antialiased min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
