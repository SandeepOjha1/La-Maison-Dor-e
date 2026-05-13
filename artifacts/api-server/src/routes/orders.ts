import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { OrderModel, ProductModel } from "@workspace/db";
import { CreateOrderBody, UpdateOrderStatusBody } from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SWEET20: 20,
  BAKERY15: 15,
};

router.get("/orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await OrderModel.find().sort({ createdAt: 1 });
  res.json(orders.map((o) => o.toJSON()));
});

router.post("/orders", async (req: any, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customerName, customerEmail, customerPhone, deliveryAddress, items, couponCode, notes } = parsed.data;

  const orderItems: Array<{ productId: string; productName: string; category: string; quantity: number; unitPrice: number }> = [];
  let subtotal = 0;

  for (const item of items) {
    const productId = String(item.productId);
    if (!mongoose.isValidObjectId(productId)) {
      res.status(400).json({ error: `Invalid product ID: ${productId}` });
      return;
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(400).json({ error: `Product ${productId} not found` });
      return;
    }
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    orderItems.push({
      productId: product._id.toString(),
      productName: product.name,
      category: product.category,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  let discount = 0;
  if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
    const pct = VALID_COUPONS[couponCode.toUpperCase()];
    discount = Math.round((subtotal * pct) / 100 * 100) / 100;
  }

  const total = Math.max(0, subtotal - discount);

  const order = await OrderModel.create({
    userId: req.userId ?? null,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    items: orderItems,
    subtotal,
    discount,
    total,
    couponCode: couponCode ?? null,
    notes: notes ?? null,
    status: "pending",
  });

  res.status(201).json(order.toJSON());
});

router.get("/orders/:id", async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  const order = await OrderModel.findById(id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order.toJSON());
});

router.patch("/orders/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const order = await OrderModel.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order.toJSON());
});

export default router;
