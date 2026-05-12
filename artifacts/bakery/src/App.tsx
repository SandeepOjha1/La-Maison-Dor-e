import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { motion, useScroll, useSpring } from "framer-motion";

import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import OrderTracking from "@/pages/OrderTracking";
import Reserve from "@/pages/Reserve";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOrders from "@/pages/admin/Orders";
import AdminProducts from "@/pages/admin/Products";
import AdminReservations from "@/pages/admin/Reservations";
import AdminReviews from "@/pages/admin/Reviews";
import AdminMessages from "@/pages/admin/Messages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const HIDDEN_FOOTER_PATHS = ["/login", "/register"];
const HIDDEN_NAV_PATHS = ["/login", "/register"];

function AppShell({ darkMode, toggleDark }: { darkMode: boolean; toggleDark: () => void }) {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  const showFooter = !HIDDEN_FOOTER_PATHS.includes(location) && !isAdminRoute;
  const showNav = !HIDDEN_NAV_PATHS.includes(location);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <ScrollToTop />
      {showNav && <Navbar darkMode={darkMode} toggleDark={toggleDark} />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/cart" component={Cart} />
          <Route path="/order-tracking/:id" component={OrderTracking} />
          <Route path="/reserve" component={Reserve} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/reservations" component={AdminReservations} />
          <Route path="/admin/reviews" component={AdminReviews} />
          <Route path="/admin/messages" component={AdminMessages} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("bakery_dark");
    return saved ? saved === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("bakery_dark", String(darkMode));
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => !d);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppShell darkMode={darkMode} toggleDark={toggleDark} />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
