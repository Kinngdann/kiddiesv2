"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
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
    <nav className="fixed w-full bg-white shadow-xl z-10">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Image
          className="dark:invert w-20 md:w-25"
          src="/logo.svg"
          alt="Kiddies Crown Contest logo"
          width={100}
          height={20}
          priority
        />
        <div className="space-x-8 hidden md:inline-block">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-black/70 text-[0.95rem] font-black hover:text-pink-500 transition">
              {link.name}
            </Link>
          ))}
          <Button variant="outline" size="icon">
            <Search />
          </Button>
        </div>

        <Button
          onClick={() => setOpen(!open)}
          variant="outline"
          size="icon"
          className="md:hidden">
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
            className="md:hidden overflow-hidden backdrop-blur-md ">
            <div className="px-4 py-4 flex flex-col gap-4 ">
              {navigationLinks.map((link) => (
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  key={link.name}
                  href={link.href}
                  className="text-black/70 text-[0.95rem] font-black hover:text-pink-500 transition">
                  {link.name}
                </Link>
              ))}
              <Button asChild className="font-bold">
                <Link href="/register">REGISTER</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
