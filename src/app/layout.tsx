import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import Navigation from "@components/navigation";
import { Toaster } from "@ui/sonner";

import "./globals.css";

const ubuntu = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiddies Crown",
  description: "Official website of the Kiddies Crown Contest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${ubuntu.variable} antialiased bg-[url(../components/images/organic2-slider-bg.webp)] bg-repeat bg-scroll`}>
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
