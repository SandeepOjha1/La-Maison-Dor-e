import { Router, type IRouter } from "express";
import { OrderModel, ReservationModel, UserModel, ReviewModel } from "@workspace/db";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    totalReservations,
    totalCustomers,
    pendingOrders,
    todayOrders,
    revenueAgg,
    todayRevenueAgg,
    ratingAgg,
  ] = await Promise.all([
    OrderModel.countDocuments(),
    ReservationModel.countDocuments(),
    UserModel.countDocuments({ role: "customer" }),
    OrderModel.countDocuments({ status: "pending" }),
    OrderModel.countDocuments({ createdAt: { $gte: today } }),
    OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    OrderModel.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    ReviewModel.aggregate([
      { $match: { approved: true } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]),
  ]);

  res.json({
    totalOrders,
    totalRevenue: revenueAgg[0]?.total ?? 0,
    totalReservations,
    totalCustomers,
    pendingOrders,
    todayOrders,
    todayRevenue: todayRevenueAgg[0]?.total ?? 0,
    averageRating: Math.round((ratingAgg[0]?.avg ?? 0) * 10) / 10,
  });
});

router.get("/admin/recent-orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(10);
  res.json(orders.map((o) => o.toJSON()));
});

router.get("/admin/sales-by-category", requireAdmin, async (_req, res): Promise<void> => {
  const salesData = await OrderModel.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.unitPrice", "$items.quantity"] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  if (salesData.length > 0) {
    res.json(
      salesData.map((r) => ({
        category: r._id ?? "Unknown",
        totalSold: r.totalSold,
        revenue: r.revenue,
      })),
    );
  } else {
    const categories = ["Cakes", "Pastries", "Bread", "Donuts", "Cookies", "Coffee"];
    res.json(categories.map((c) => ({ category: c, totalSold: 0, revenue: 0 })));
  }
});

export default router;
