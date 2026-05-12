import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  ready: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  delivered: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const STATUSES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

export default function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: `Order #${id} updated to ${status}` });
        },
        onError: () => toast({ title: "Failed to update order", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">{(orders ?? []).length} total orders</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (orders ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No orders yet</div>
        ) : (
          <div className="space-y-4">
            {[...(orders ?? [])].reverse().map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-testid={`card-order-${order.id}`}
              >
                <Card className="p-5 border-card-border shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-foreground">Order #{order.id}</span>
                        <Badge className={STATUS_COLORS[order.status] ?? "bg-muted"}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} · {order.customerEmail} · {order.customerPhone}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(order.items as any[]).map((item: any) => `${item.productName} x${item.quantity}`).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString()} · ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                      >
                        <SelectTrigger className="w-36 h-9 text-sm" data-testid={`select-status-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
