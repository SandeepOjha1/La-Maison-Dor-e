import { Router, type IRouter } from "express";
import { db, ordersTable, reservationsTable, usersTable, reviewsTable } from "@workspace/db";
import { eq, sql, gte } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable);
  const [revenueResult] = await db.select({ total: sql<number>`coalesce(sum(total), 0)::float` }).from(ordersTable);
  const [reservationsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(reservationsTable);
  const [customersCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "customer"));
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));
  const [todayOrdersCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));
  const [todayRevenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(total), 0)::float` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));

  const reviewsResult = await db.select({ rating: reviewsTable.rating }).from(reviewsTable).where(eq(reviewsTable.approved, true));
  const avgRating =
    reviewsResult.length > 0
      ? reviewsResult.reduce((sum, r) => sum + r.rating, 0) / reviewsResult.length
      : 0;

  res.json({
    totalOrders: ordersCount.count,
    totalRevenue: revenueResult.total,
    totalReservations: reservationsCount.count,
    totalCustomers: customersCount.count,
    pendingOrders: pendingCount.count,
    todayOrders: todayOrdersCount.count,
    todayRevenue: todayRevenueResult.total,
    averageRating: Math.round(avgRating * 10) / 10,
  });
});

router.get("/admin/recent-orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(sql`${ordersTable.createdAt} desc`)
    .limit(10);
  res.json(orders);
});

router.get("/admin/sales-by-category", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable);
  const categoryMap: Record<string, { totalSold: number; revenue: number }> = {};

  for (const order of orders) {
    const items = order.items as Array<{ productId: number; productName: string; quantity: number; unitPrice: number }>;
    for (const item of items) {
      // We don't store category in order items, so we return aggregated by order status
    }
  }

  // Since category isn't stored on order items directly, return a meaningful breakdown
  const categories = ["Cakes", "Pastries", "Bread", "Donuts", "Cookies", "Coffee"];
  const result = categories.map((category, i) => ({
    category,
    totalSold: Math.floor(Math.random() * 0), // will be replaced by real data
    revenue: 0,
  }));

  // Aggregate from products via SQL
  const salesData = await db.execute(sql`
    SELECT p.category, 
           COUNT(DISTINCT o.id) as order_count,
           COALESCE(SUM(o.total), 0) as revenue
    FROM orders o
    CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item
    JOIN products p ON p.id = (item->>'productId')::int
    GROUP BY p.category
    ORDER BY revenue DESC
  `);

  const rows = salesData.rows as Array<{ category: string; order_count: string; revenue: string }>;

  if (rows.length > 0) {
    res.json(
      rows.map((r) => ({
        category: r.category,
        totalSold: parseInt(r.order_count, 10),
        revenue: parseFloat(r.revenue),
      })),
    );
  } else {
    res.json(categories.map((c) => ({ category: c, totalSold: 0, revenue: 0 })));
  }
});

export default router;
