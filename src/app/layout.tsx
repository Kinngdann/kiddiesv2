import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import Navigation from "@components/navigation";
import { Toaster } from "@ui/sonner";

import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Future Star Contest",
  description: "Official website of The Future Star Contest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${nunito.variable} ${fredoka.variable} antialiased`}>
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
