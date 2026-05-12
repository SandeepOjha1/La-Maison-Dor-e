import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateReservation } from "@workspace/api-client-react";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export default function Reserve() {
  const { toast } = useToast();
  const createReservation = useCreateReservation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    date: "",
    time: "",
    guestCount: 2,
    specialRequests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.date || !form.time) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createReservation.mutate(
      { data: form },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast({ title: "Reservation confirmed!", description: "We'll see you soon." });
        },
        onError: () => {
          toast({ title: "Reservation failed", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-3">You're booked!</h2>
          <p className="text-muted-foreground text-lg mb-2">
            We've reserved a table for <strong>{form.guestCount}</strong> on{" "}
            <strong>{new Date(form.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong> at{" "}
            <strong>{form.time}</strong>.
          </p>
          <p className="text-muted-foreground mb-8">A confirmation has been sent to {form.customerEmail}.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline">Make another reservation</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-5xl font-bold text-foreground mb-3">Reserve a Table</h1>
          <p className="text-muted-foreground text-lg">Experience the warmth of La Maison Dorée. We're open 7 days a week.</p>
        </motion.div>

        <motion.div
          className="bg-card border border-card-border rounded-2xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="res-name">Full Name *</Label>
                <Input
                  id="res-name"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Sophie Martin"
                  className="mt-1"
                  data-testid="input-reservation-name"
                />
              </div>
              <div>
                <Label htmlFor="res-email">Email *</Label>
                <Input
                  id="res-email"
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="sophie@example.com"
                  className="mt-1"
                  data-testid="input-reservation-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="res-phone">Phone</Label>
              <Input
                id="res-phone"
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                placeholder="+33 1 00 00 00 00"
                className="mt-1"
                data-testid="input-reservation-phone"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="res-date">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </Label>
                <Input
                  id="res-date"
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1"
                  data-testid="input-reservation-date"
                />
              </div>
              <div>
                <Label>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </Label>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {TIMES.slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, time: t })}
                      className={`text-xs py-1.5 rounded-lg border transition-colors ${
                        form.time === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                      data-testid={`button-time-${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>
                <Users className="w-4 h-4 inline mr-1" />
                Number of Guests *
              </Label>
              <div className="flex items-center gap-3 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setForm({ ...form, guestCount: Math.max(1, form.guestCount - 1) })}
                  data-testid="button-decrease-guests"
                >
                  −
                </Button>
                <span className="w-8 text-center font-semibold text-lg" data-testid="text-guest-count">{form.guestCount}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setForm({ ...form, guestCount: Math.min(20, form.guestCount + 1) })}
                  data-testid="button-increase-guests"
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">guests</span>
              </div>
            </div>

            <div>
              <Label htmlFor="res-requests">Special Requests</Label>
              <Textarea
                id="res-requests"
                value={form.specialRequests}
                onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                placeholder="Allergies, seating preferences, celebrations..."
                className="mt-1 resize-none"
                rows={3}
                data-testid="input-special-requests"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={createReservation.isPending}
              data-testid="button-submit-reservation"
            >
              {createReservation.isPending ? "Reserving..." : "Confirm Reservation"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
