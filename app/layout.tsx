import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muted Studio | Architectural Design-Build",
  description: "Muted Studio is a Toronto-based architecture and design-build firm specializing in bold, cinematic outdoor environments.",
  keywords: "architecture, design-build, landscape architecture, outdoor environments, Toronto, modern design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
