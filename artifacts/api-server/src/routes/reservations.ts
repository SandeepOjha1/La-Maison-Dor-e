import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "@workspace/db";
import {
  CreateReservationBody,
  UpdateReservationStatusBody,
} from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/reservations", requireAdmin, async (_req, res): Promise<void> => {
  const reservations = await ReservationModel.find().sort({ createdAt: 1 });
  res.json(reservations.map((r) => r.toJSON()));
});

router.post("/reservations", async (req, res): Promise<void> => {
  const parsed = CreateReservationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const reservation = await ReservationModel.create(parsed.data);
  res.status(201).json(reservation.toJSON());
});

router.get("/reservations/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid reservation ID" });
    return;
  }
  const reservation = await ReservationModel.findById(id);
  if (!reservation) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json(reservation.toJSON());
});

router.patch("/reservations/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid reservation ID" });
    return;
  }
  const parsed = UpdateReservationStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const reservation = await ReservationModel.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true },
  );
  if (!reservation) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json(reservation.toJSON());
});

export default router;
