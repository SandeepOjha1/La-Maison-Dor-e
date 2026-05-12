import { Link } from "wouter";
import { ChefHat, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold">La Maison Dorée</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Artisan baking since 1987. Every creation is a small act of devotion to craft, flavor, and joy.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Menu</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Cakes", "Pastries", "Bread", "Donuts", "Coffee"].map((cat) => (
                <li key={cat}>
                  <Link href="/menu" className="hover:text-foreground transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Visit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>42 Rue de la Paix</li>
              <li>Paris, 75002</li>
              <li className="pt-2">Mon–Fri: 7am–8pm</li>
              <li>Sat–Sun: 8am–9pm</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Reserve a Table", href: "/reserve" },
                { label: "Cart", href: "/cart" },
                { label: "Sign In", href: "/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} La Maison Dorée. All rights reserved.</p>
          <p>Crafted with love in Paris.</p>
        </div>
      </div>
    </footer>
  );
}
