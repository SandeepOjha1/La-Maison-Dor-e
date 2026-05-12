import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams, UpdateOrderStatusBody, UpdateOrderStatusParams } from "@workspace/api-zod";
import { requireAdmin, requireAuth } from "./auth";

const router: IRouter = Router();

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SWEET20: 20,
  BAKERY15: 15,
};

router.get("/orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.post("/orders", async (req: any, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customerName, customerEmail, customerPhone, deliveryAddress, items, couponCode, notes } = parsed.data;

  const orderItems: Array<{ productId: number; productName: string; quantity: number; unitPrice: number }> = [];
  let subtotal = 0;

  for (const item of items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    orderItems.push({
      productId: product.id,
      productName: product.name,
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

  const [order] = await db
    .insert(ordersTable)
    .values({
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
    })
    .returning();

  res.status(201).json(order);
});

router.get("/orders/:id", async (req: any, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

router.patch("/orders/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

export default router;
