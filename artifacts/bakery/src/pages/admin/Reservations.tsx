import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useListReservations, useUpdateReservationStatus, getListReservationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminReservations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: reservations, isLoading } = useListReservations();
  const updateStatus = useUpdateReservationStatus();

  const handleAction = (id: number, status: "confirmed" | "cancelled") => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReservationsQueryKey() });
          toast({ title: `Reservation ${status}` });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-1">{(reservations ?? []).length} total bookings</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (reservations ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No reservations yet</div>
        ) : (
          <div className="space-y-4">
            {[...(reservations ?? [])].reverse().map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 border-card-border shadow-sm" data-testid={`card-reservation-${r.id}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-foreground">{r.customerName}</span>
                        <Badge className={STATUS_COLORS[r.status] ?? "bg-muted"}>
                          {r.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.customerEmail} · {r.customerPhone}</p>
                      <p className="text-sm text-foreground mt-1">
                        <span className="font-medium">{r.date}</span> at <span className="font-medium">{r.time}</span> · {r.guestCount} guests
                      </p>
                      {r.specialRequests && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{r.specialRequests}"</p>
                      )}
                    </div>
                    {r.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:hover:bg-emerald-950"
                          onClick={() => handleAction(r.id, "confirmed")}
                          data-testid={`button-confirm-reservation-${r.id}`}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/5"
                          onClick={() => handleAction(r.id, "cancelled")}
                          data-testid={`button-cancel-reservation-${r.id}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
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
