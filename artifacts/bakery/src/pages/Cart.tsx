import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@workspace/api-client-react";

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SWEET20: 20,
  BAKERY15: 15,
};

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });

  const discount = appliedCoupon && VALID_COUPONS[appliedCoupon]
    ? Math.round(subtotal * VALID_COUPONS[appliedCoupon]) / 100
    : 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    const upper = couponCode.toUpperCase();
    if (VALID_COUPONS[upper]) {
      setAppliedCoupon(upper);
      toast({ title: `Coupon applied! ${VALID_COUPONS[upper]}% off` });
    } else {
      toast({ title: "Invalid coupon code", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.deliveryAddress) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createOrder.mutate(
      {
        data: {
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: appliedCoupon || undefined,
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          toast({ title: "Order placed!", description: `Order #${order.id} confirmed.` });
          setLocation(`/order-tracking/${order.id}`);
        },
        onError: () => {
          toast({ title: "Failed to place order", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add something delicious from our menu.</p>
          <Link href="/menu">
            <Button size="lg" className="gap-2">Browse Menu <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="font-serif text-4xl font-bold text-foreground mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Cart
        </motion.h1>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Items */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex gap-4 bg-card border border-card-border rounded-2xl p-4 shadow-sm"
                  data-testid={`card-cart-${item.productId}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-foreground truncate">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-medium text-sm" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-foreground" data-testid={`text-item-total-${item.productId}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon */}
            <div className="bg-card border border-card-border rounded-2xl p-4 shadow-sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-9"
                    data-testid="input-coupon"
                  />
                </div>
                <Button variant="outline" onClick={applyCoupon} data-testid="button-apply-coupon">Apply</Button>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-primary mt-2 font-medium">
                  Coupon {appliedCoupon} applied — {VALID_COUPONS[appliedCoupon]}% off
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">Try: WELCOME10, SWEET20, BAKERY15</p>
            </div>
          </div>

          {/* Order form + summary */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Delivery Details</h2>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Sophie Martin"
                    className="mt-1"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="sophie@example.com"
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+33 1 00 00 00 00"
                    className="mt-1"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    placeholder="42 Rue de la Paix, Paris"
                    className="mt-1"
                    data-testid="input-address"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any special requests..."
                    className="mt-1 resize-none"
                    rows={2}
                    data-testid="input-notes"
                  />
                </div>
              </div>

              <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span data-testid="text-discount">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base text-foreground">
                    <span>Total</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 gap-2"
                  size="lg"
                  disabled={createOrder.isPending}
                  data-testid="button-place-order"
                >
                  {createOrder.isPending ? "Placing order..." : "Place Order"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
