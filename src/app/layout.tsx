import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

if (adsenseClientId && !/^ca-pub-\d+$/u.test(adsenseClientId)) {
  throw new Error("NEXT_PUBLIC_ADSENSE_CLIENT_ID must use the format ca-pub-1234567890123456.");
}

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ToolNest | Free Online Tools for Everyday Work",
    template: "%s | ToolNest",
  },
  description: "Free online tools for writing, code, quick calculations and everyday tasks. Fast browser-based utilities that do the job without extra setup.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ToolNest",
    title: "ToolNest | Free Online Tools for Everyday Work",
    description: "Useful little tools for writing, code, and quick calculations.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "ToolNest | Free Online Tools for Everyday Work",
    description: "Useful little tools for writing, code, and quick calculations.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        {adsenseClientId && (
          <Script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
