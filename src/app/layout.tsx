import type { Metadata } from "next";
import Navigation from "@components/navigation";
import { Toaster } from "@ui/sonner";

import "./globals.css";

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
      <body className="antialiased">
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
