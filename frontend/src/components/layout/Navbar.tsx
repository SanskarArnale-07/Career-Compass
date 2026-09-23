"use client";

import Link from "next/link";
import {
  Compass,
  Sparkles,
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name ? user.name.trim().split(" ")[0] : "Account";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/50">
      {/* Ultra-thin separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/60" />

      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Career<span className="text-primary/90">Compass</span>
          </span>
        </Link>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/coach"
            className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            Career Coach
          </Link>
          <Link
            href="/assessment"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Assessment
          </Link>
          <Link
            href="/careers"
            className="text-muted-foreground/50 transition-colors hover:text-muted-foreground text-[13px]"
          >
            Explore More Careers
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/coach"
            className="md:hidden inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            <span>Coach</span>
          </Link>

          {/* Desktop Auth: Profile Dropdown or Login Button */}
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground bg-card hover:bg-card-hover border border-border/80 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-semibold">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">Hi, {firstName}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border/80 bg-card p-1.5 shadow-2xl backdrop-blur-md z-50 text-xs">
                  <div className="px-2.5 py-2 border-b border-border/60">
                    <p className="font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-primary/80" />
                      <span>My Dashboard</span>
                    </Link>
                  </div>

                  <div className="border-t border-border/60 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border/60"
            >
              <LogIn className="h-3.5 w-3.5 text-primary/80" />
              <span>Login</span>
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            href="/assessment"
            className="hidden sm:inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-hover shadow-sm shadow-primary/20"
          >
            Start Assessment
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {/* Authenticated user bar in mobile menu */}
            {isAuthenticated && user && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-card/60 border border-border/60 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[170px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/coach"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary/70" />
              Career Coach
            </Link>
            <Link
              href="/assessment"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              Assessment
            </Link>
            <Link
              href="/careers"
              className="text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              Explore More Careers
            </Link>

            {/* Mobile login link if logged out */}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="h-4 w-4 text-primary/80" />
                <span>Login</span>
              </Link>
            )}

            <div className="pt-2 border-t border-border/60">
              <Link
                href="/assessment"
                className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover shadow-sm shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                Start Assessment
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
