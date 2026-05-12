import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Clock, ChefHat, Package, Truck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrder } from "@workspace/api-client-react";

const STEPS = [
  { key: "pending", label: "Order Received", icon: CheckCircle },
  { key: "confirmed", label: "Confirmed", icon: Clock },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: Package },
  { key: "delivered", label: "Delivered", icon: Truck },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  ready: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  delivered: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function OrderTracking() {
  const [, params] = useRoute("/order-tracking/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id, queryKey: ["order", id] } });

  const currentStepIndex = STEPS.findIndex((s) => s.key === order?.status);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-full max-w-lg px-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground">Order not found</h2>
          <p className="text-muted-foreground mt-2">Check your order ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-serif text-4xl font-bold text-foreground">Order #{order.id}</h1>
            <Badge className={STATUS_COLORS[order.status] ?? "bg-muted text-foreground"}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-10">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>

          {/* Progress steps */}
          {order.status !== "cancelled" && (
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-6">Order Progress</h2>
              <div className="space-y-4">
                {STEPS.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.key}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                          {isCurrent && (
                            <motion.span
                              className="ml-2 inline-block text-xs text-primary"
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              Current
                            </motion.span>
                          )}
                        </div>
                      </div>
                      {isCompleted && <Star className="w-4 h-4 text-primary" />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Items</h2>
            <div className="space-y-3">
              {(order.items as any[]).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.productName} x{item.quantity}</span>
                  <span className="text-muted-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-${(order.discount ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Delivery Details</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Name:</span> {order.customerName}</p>
              <p><span className="font-medium text-foreground">Email:</span> {order.customerEmail}</p>
              <p><span className="font-medium text-foreground">Phone:</span> {order.customerPhone}</p>
              <p><span className="font-medium text-foreground">Address:</span> {order.deliveryAddress}</p>
              {order.notes && <p><span className="font-medium text-foreground">Notes:</span> {order.notes}</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
