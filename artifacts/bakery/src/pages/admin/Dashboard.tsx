import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Calendar, Users, TrendingUp, Clock, Star, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useGetAdminStats, useGetRecentOrders, useGetSalesByCategory } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  ready: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  delivered: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const CHART_COLORS = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#D2691E", "#BC8A5F"];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders();
  const { data: salesByCategory, isLoading: salesLoading } = useGetSalesByCategory();

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground mt-1">Admin access required.</p>
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, sub: `${stats.pendingOrders} pending` },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, sub: `$${stats.todayRevenue.toFixed(2)} today` },
    { label: "Reservations", value: stats.totalReservations, icon: Calendar, sub: "Total bookings" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, sub: "Registered" },
    { label: "Today's Orders", value: stats.todayOrders, icon: TrendingUp, sub: "Orders today" },
    { label: "Avg Rating", value: stats.averageRating.toFixed(1), icon: Star, sub: "Customer rating" },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            {[
              { label: "Orders", path: "/admin/orders" },
              { label: "Products", path: "/admin/products" },
              { label: "Reservations", path: "/admin/reservations" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                data-testid={`link-admin-${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statsLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            : statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Card className="p-5 border-card-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{card.label}</p>
                          <p className="font-serif text-3xl font-bold text-foreground mt-1" data-testid={`stat-${card.label.toLowerCase().replace(/ /g, "-")}`}>
                            {card.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Sales by category chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-card-border shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-5">Sales by Category</h2>
              {salesLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (salesByCategory ?? []).length === 0 ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  No sales data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesByCategory ?? []}>
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === "revenue" ? `$${Number(value).toFixed(2)}` : value,
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {(salesByCategory ?? []).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-6 border-card-border shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-5">Manage</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
                  { label: "Products", path: "/admin/products", icon: TrendingUp },
                  { label: "Reservations", path: "/admin/reservations", icon: Calendar },
                  { label: "Reviews", path: "/admin/reviews", icon: Star },
                  { label: "Messages", path: "/admin/messages", icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => setLocation(item.path)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all text-left"
                      data-testid={`link-manage-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-card-border shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-semibold text-foreground">Recent Orders</h2>
              <button
                onClick={() => setLocation("/admin/orders")}
                className="text-sm text-primary hover:underline"
                data-testid="link-view-all-orders"
              >
                View all
              </button>
            </div>
            {ordersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground font-medium py-2">Order</th>
                      <th className="text-left text-muted-foreground font-medium py-2">Customer</th>
                      <th className="text-left text-muted-foreground font-medium py-2">Total</th>
                      <th className="text-left text-muted-foreground font-medium py-2">Status</th>
                      <th className="text-left text-muted-foreground font-medium py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(recentOrders ?? []).slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/50 transition-colors" data-testid={`row-order-${order.id}`}>
                        <td className="py-3 font-medium">#{order.id}</td>
                        <td className="py-3 text-muted-foreground">{order.customerName}</td>
                        <td className="py-3 font-medium">${order.total.toFixed(2)}</td>
                        <td className="py-3">
                          <Badge className={`${STATUS_COLORS[order.status]} text-xs`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(recentOrders ?? []).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No orders yet</div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
