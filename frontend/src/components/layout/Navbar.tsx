"use client";

import Link from "next/link";
import {
  Compass,
  Sparkles,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  User,
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
    <header className="sticky top-0 z-50 w-full bg-[#0E0E0E]/90 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand Masthead */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <div className="h-7 w-7 rounded-lg bg-[#161412] border border-border/80 flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-[0.14em] uppercase text-foreground leading-tight">
              Career Compass
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60 leading-none">
              Navigation Instrument
            </span>
          </div>
        </Link>

        {/* Center: Editorial Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.1em]">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors py-1 relative group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="/coach"
            className="text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-1.5 relative group"
          >
            <span>Career Coach</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="/assessment"
            className="text-muted-foreground hover:text-primary transition-colors py-1 relative group"
          >
            <span>Assessment</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="/careers"
            className="text-muted-foreground/60 hover:text-muted-foreground transition-colors py-1 relative group"
          >
            <span>Explore More Careers</span>
          </Link>
        </nav>

        {/* Right: Actions & Primary CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/coach"
            className="lg:hidden inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Coach</span>
          </Link>

          {/* Desktop Auth: Compact Profile Dropdown or Login Button */}
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex items-center gap-2 text-xs font-mono text-foreground bg-[#141210] hover:bg-[#1A1612] border border-border/80 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate">{firstName}</span>
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/80 bg-[#141210] p-1.5 shadow-2xl backdrop-blur-md z-50 text-xs font-mono">
                  <div className="px-2.5 py-2 border-b border-border/50">
                    <p className="font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-primary/80" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-primary/80" />
                      <span>My Dashboard</span>
                    </Link>
                  </div>

                  <div className="border-t border-border/50 pt-1">
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
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#141210]"
            >
              <LogIn className="h-3.5 w-3.5 text-primary/80" />
              <span>Login</span>
            </Link>
          )}

          {/* Primary Masthead CTA: Start Assessment */}
          <Link
            href="/assessment"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold tracking-tight text-primary-foreground transition-all hover:bg-primary-hover shadow-sm shadow-primary/20 cursor-pointer"
          >
            Start Assessment
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-[#0E0E0E]/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
            {isAuthenticated && user && (
              <div className="p-2.5 rounded-lg bg-[#141210] border border-border/60 mb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
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
                    className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-primary/80" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-primary/80" />
                    <span>My Dashboard</span>
                  </Link>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/coach"
              className="text-muted-foreground hover:text-foreground transition-colors py-1.5 flex items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary/70" />
              Career Coach
            </Link>
            <Link
              href="/assessment"
              className="text-muted-foreground hover:text-primary transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              Assessment
            </Link>
            <Link
              href="/careers"
              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              Explore More Careers
            </Link>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors py-1.5 flex items-center gap-2 border-t border-border/50 pt-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="h-4 w-4 text-primary/80" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
