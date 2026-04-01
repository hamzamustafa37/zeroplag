"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconEditor({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconDocuments({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function IconReports({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconSignOut({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

// ─── Nav items ───────────────────────────────────────────────────────────────

const navItems = [
  { href: "/editor", label: "Editor", icon: IconEditor },
  { href: "/dashboard", label: "Documents", icon: IconDocuments },
  { href: "/reports", label: "Reports", icon: IconReports },
  { href: "/settings", label: "Settings", icon: IconSettings },
] as const;

// ─── Dark mode hook ───────────────────────────────────────────────────────────

function useDarkMode() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle };
}

// ─── Sidebar content ─────────────────────────────────────────────────────────

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { isDark, toggle } = useDarkMode();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-slate-700 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">Z</span>
        </div>
        <span className="font-bold text-slate-50 text-base tracking-tight">ZeroPlag</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                active
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/60"
              )}
            >
              <Icon className={cn(active ? "text-blue-400" : "text-slate-500")} />
              {label}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-0.5 flex-shrink-0">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-50 hover:bg-slate-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {isDark ? <IconMoon className="text-slate-500" /> : <IconSun className="text-slate-500" />}
          {isDark ? "Dark mode" : "Light mode"}
          <span className="ml-auto text-xs text-slate-600">{isDark ? "On" : "Off"}</span>
        </button>

        {/* Sign out */}
        <a
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <IconSignOut className="text-slate-500" />
          Sign out
        </a>
      </div>
    </div>
  );
}

// ─── Main sidebar component ───────────────────────────────────────────────────

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close mobile sidebar on route change
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col bg-slate-800 border-r border-slate-700">
        <SidebarContent />
      </aside>

      {/* ── Mobile: hamburger button ── */}
      <div className="md:hidden fixed top-0 left-0 z-50 h-14 flex items-center px-4">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {mobileOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* ── Mobile: backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Mobile: slide-in panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-56 bg-slate-800 border-r border-slate-700 flex flex-col shadow-2xl"
            aria-label="Mobile navigation"
          >
            <SidebarContent onNavClick={closeMobile} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
