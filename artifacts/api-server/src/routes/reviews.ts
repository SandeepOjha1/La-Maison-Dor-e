import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateReviewBody, ApproveReviewParams } from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/reviews", async (_req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.approved, true))
    .orderBy(reviewsTable.createdAt);
  res.json(reviews);
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db.insert(reviewsTable).values({ ...parsed.data, approved: false }).returning();
  res.status(201).json(review);
});

router.patch("/reviews/:id/approve", requireAdmin, async (req: any, res): Promise<void> => {
  const params = ApproveReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ approved: true })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(review);
});

export default router;
