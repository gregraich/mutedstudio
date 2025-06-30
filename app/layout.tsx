import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/lib/IntroContext";
import NavigationWrapper from "@/components/NavigationWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muted Studio - Architectural Design-Build",
  description: "Creating bold, cinematic outdoor environments that balance form and function. Based in Toronto.",
  keywords: "architecture, design-build, landscape architecture, outdoor environments, Toronto, modern design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <IntroProvider>
          <NavigationWrapper />
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
