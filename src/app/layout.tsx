import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillWeave SA — Build Your Future Through Modular Learning",
  description:
    "South Africa's modular learning, credentialing, and experiential learning platform. Build personalised pathways, earn stackable credentials, and connect with real opportunities.",
  keywords: [
    "SkillWeave", "South Africa", "learning", "credentials", "NQF",
    "SAQA", "modules", "pathways", "skills", "employment",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-sans",
            style: {
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
