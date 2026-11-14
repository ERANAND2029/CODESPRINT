import type { Metadata } from "next";
import { Archivo, Roboto, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Snap2Solve – Civic Redressal Protocol (Ghaziabad)",
  description: "Snap it. Report it. Fix it. Automated municipal grievance drafting with 7-day escalation clock for Ghaziabad citizens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${roboto.variable} ${notoSansDevanagari.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col paper-grain text-[#141414] font-sans selection:bg-[#E31E2D] selection:text-white pb-20 md:pb-0">
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 bg-[#E0DCD9]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
