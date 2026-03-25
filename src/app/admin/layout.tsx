"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@ui/button";

const navLinks = [
  { href: "/admin/add-vote", label: "Add Vote" },
  { href: "/admin/update-picture", label: "Update Picture" },
  { href: "/admin/contest-config", label: "Contest Config" },
  { href: "/admin/stage-transition", label: "Stage Transition" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between bg-background">
        <nav className="flex gap-4 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium underline-offset-4 hover:underline ${
                pathname === link.href ? "underline font-bold" : "text-muted-foreground"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
