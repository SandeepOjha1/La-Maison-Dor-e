import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChefHat, Sun, Moon, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavbarProps {
  darkMode: boolean;
  toggleDark: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reserve", label: "Reserve" },
];

export default function Navbar({ darkMode, toggleDark }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <>
      <motion.header
        data-testid="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
                Annapurna Bakehouse
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                className="hidden md:flex"
                data-testid="button-toggle-dark"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Link href="/cart" className="relative inline-flex" data-testid="button-cart">
                <Button variant="ghost" size="icon" asChild>
                  <span>
                    <ShoppingCart className="w-4 h-4" />
                  </span>
                </Button>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground pointer-events-none">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="button-user-menu">
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b border-border mb-1">
                      {user.name}
                    </div>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")} data-testid="link-admin">
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden md:inline-flex" data-testid="link-login">
                  <Button variant="outline" size="sm">Sign in</Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                data-testid="button-mobile-menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 bg-background border-l border-border shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-serif text-lg font-semibold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-5 gap-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 px-4 rounded-lg text-base font-medium hover:bg-muted transition-colors block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="py-3 px-4 rounded-lg text-base font-medium hover:bg-muted transition-colors block"
                        onClick={() => setMobileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="py-3 px-4 rounded-lg text-base font-medium hover:bg-muted transition-colors text-left text-destructive"
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="mt-2 block" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Sign in</Button>
                  </Link>
                )}
              </nav>
              <div className="p-5 border-t border-border">
                <button onClick={toggleDark} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {darkMode ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
