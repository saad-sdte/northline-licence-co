"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Shield, X } from "lucide-react";
import { BRAND, brandNameStop } from "@/lib/brand";

type Variant = "consultancy" | "application";

function variantFromPath(pathname: string): Variant {
  // Application chrome (Services / Apply / Contact, logo → /services/fishinglicence)
  // only on the licence-application section. /apply and /apply/[province] 404s
  // stay on the consultancy site (Home / Apply / Contact, logo → /), matching official.
  if (pathname.startsWith("/services") || pathname === "/contact" || pathname.startsWith("/contact/")) {
    return "application";
  }
  return "consultancy";
}

export function SiteChrome({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const pathname = usePathname();
  const mode = variant ?? variantFromPath(pathname);
  const [open, setOpen] = useState(false);

  const homeHref = mode === "application" ? "/services/fishinglicence" : "/";
  const applyHref = mode === "application" ? "/services/apply" : "/apply";
  const tagline = mode === "application" ? BRAND.taglineApplication : BRAND.taglineConsultancy;
  const links =
    mode === "application"
      ? [
          { href: "/services/fishinglicence", label: "Services" },
          { href: "/services/apply", label: "Apply" },
          { href: "/contact", label: "Contact" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/apply", label: "Apply" },
          { href: "/contact", label: "Contact" },
        ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 h-8 flex items-center justify-between text-[11px]">
          <span className="text-gov-red font-semibold tracking-wide">{BRAND.name}</span>
          <span className="flex items-center gap-1.5 text-gov-red font-semibold tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            DATAPROTECTION
            <span className="hidden sm:inline font-normal text-muted-foreground ml-1">
              Secure handling of your data
            </span>
          </span>
        </div>
      </div>

      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gov-red flex items-center justify-center">
              <span className="text-primary-foreground text-lg">🍁</span>
            </div>
            <div className="leading-tight">
              <span className="font-heading font-bold text-foreground text-base tracking-wide block">
                {BRAND.short}
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground tracking-wide uppercase">
                {tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-1 py-1 ${
                  isActive(link.href)
                    ? "text-foreground font-medium border-b-2 border-gov-red"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={applyHref}
              className="ml-5 gov-btn-primary rounded px-4 py-2 text-sm font-semibold"
            >
              GET STARTED
            </Link>
          </nav>

          <button className="md:hidden text-foreground" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-card px-4 pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={applyHref}
              onClick={() => setOpen(false)}
              className="inline-block gov-btn-primary rounded px-4 py-2 text-sm font-semibold"
            >
              GET STARTED
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-foreground font-heading font-bold tracking-wide">
            <span>🍁</span> {BRAND.short}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <p>© 2026 {brandNameStop()}</p>
            <Link href="/terms" className="text-gov-red hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-gov-red hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
