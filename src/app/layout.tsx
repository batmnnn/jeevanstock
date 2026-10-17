import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Devanagari, Tiro_Devanagari_Hindi } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { getLang } from "@/lib/lang";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-face",
  display: "swap",
});

const deva = IBM_Plex_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-deva",
  display: "swap",
});

const display = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-display-face",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "JeevanStock — जीवन स्टॉक", template: "%s · JeevanStock" },
  description: "Public anti-venom and rabies-vaccine board for Durg and Balod. Shelf stock appears only after a centre posts.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#eef2ff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${sans.variable} ${deva.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <div className="sticky top-0 z-20">
          <SiteHeader lang={lang} />
        </div>
        {children}
      </body>
    </html>
  );
}
