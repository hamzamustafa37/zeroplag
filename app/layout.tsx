import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZeroPlag — Plagiarism & Grammar Checker",
    template: "%s | ZeroPlag",
  },
  description:
    "AI-powered plagiarism detection and grammar checking. Write with confidence.",
  keywords: ["plagiarism checker", "grammar checker", "AI writing assistant"],
  authors: [{ name: "ZeroPlag" }],
  creator: "ZeroPlag",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ZeroPlag — Plagiarism & Grammar Checker",
    description: "AI-powered plagiarism detection and grammar checking.",
    siteName: "ZeroPlag",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroPlag — Plagiarism & Grammar Checker",
    description: "AI-powered plagiarism detection and grammar checking.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
