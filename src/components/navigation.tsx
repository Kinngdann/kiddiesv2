"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@ui/button";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Contestants", href: "/all-contestants" },
  { name: "Elite Board", href: "/elite-board" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-sky-100 z-10">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Image
          className="w-20 md:w-25"
          src="/logo.svg"
          alt="Kiddies Crown Contest logo"
          width={100}
          height={20}
          priority
        />
        <div className="space-x-6 hidden md:flex items-center">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-700 text-[0.95rem] font-bold hover:text-sky-500 transition group">
              {link.name}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sky-400 rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Button
            asChild
            className="rounded-full font-bold bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-white shadow-md shadow-sky-200 px-5">
            <Link href="/register">REGISTER</Link>
          </Button>
        </div>

        <Button
          onClick={() => setOpen(!open)}
          variant="outline"
          size="icon"
          className="md:hidden border-sky-200 text-sky-500 hover:bg-sky-50">
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white/98 border-t border-sky-100">
            <div className="px-4 py-4 flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 text-[0.95rem] font-bold hover:text-sky-500 transition">
                  {link.name}
                </Link>
              ))}
              <Button
                asChild
                className="font-bold rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white">
                <Link href="/register">REGISTER</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
