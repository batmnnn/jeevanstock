import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import { SiteHeader, DemoBanner } from "@/components/site-header";
import { getLang } from "@/lib/lang";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-deva", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

export const metadata: Metadata = {
  title: { default: "JeevanStock — जीवन स्टॉक", template: "%s · JeevanStock" },
  description: "Public, tamper-evident anti-venom (ASV) and anti-rabies (ARV) stock board. Synthetic demo data.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b6e4f" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${inter.variable} ${deva.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <SiteHeader lang={lang} />
        <DemoBanner lang={lang} />
        {children}
      </body>
    </html>
  );
}
