import { Router, type IRouter } from "express";
import { ContactMessageModel } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const msg = await ContactMessageModel.create(parsed.data);
  res.status(201).json(msg.toJSON());
});

router.get("/contact/messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await ContactMessageModel.find().sort({ createdAt: 1 });
  res.json(messages.map((m) => m.toJSON()));
});

export default router;
