import { Router, type IRouter } from "express";
import { db, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateReservationBody,
  GetReservationParams,
  UpdateReservationStatusBody,
  UpdateReservationStatusParams,
} from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/reservations", requireAdmin, async (_req, res): Promise<void> => {
  const reservations = await db.select().from(reservationsTable).orderBy(reservationsTable.createdAt);
  res.json(reservations);
});

router.post("/reservations", async (req, res): Promise<void> => {
  const parsed = CreateReservationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [reservation] = await db.insert(reservationsTable).values(parsed.data).returning();
  res.status(201).json(reservation);
});

router.get("/reservations/:id", async (req, res): Promise<void> => {
  const params = GetReservationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [reservation] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, params.data.id));
  if (!reservation) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json(reservation);
});

router.patch("/reservations/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const params = UpdateReservationStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReservationStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [reservation] = await db
    .update(reservationsTable)
    .set({ status: parsed.data.status })
    .where(eq(reservationsTable.id, params.data.id))
    .returning();
  if (!reservation) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json(reservation);
});

export default router;
