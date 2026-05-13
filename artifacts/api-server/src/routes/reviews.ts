import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "@workspace/db";
import { CreateReviewBody } from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/reviews", async (_req, res): Promise<void> => {
  const reviews = await ReviewModel.find({ approved: true }).sort({ createdAt: 1 });
  res.json(reviews.map((r) => r.toJSON()));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const review = await ReviewModel.create({ ...parsed.data, approved: false });
  res.status(201).json(review.toJSON());
});

router.patch("/reviews/:id/approve", requireAdmin, async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }
  const review = await ReviewModel.findByIdAndUpdate(id, { approved: true }, { new: true });
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(review.toJSON());
});

export default router;
