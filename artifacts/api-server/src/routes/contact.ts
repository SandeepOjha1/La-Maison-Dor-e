import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [msg] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  res.status(201).json(msg);
});

router.get("/contact/messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db.select().from(contactMessagesTable).orderBy(contactMessagesTable.createdAt);
  res.json(messages);
});

export default router;
