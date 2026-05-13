import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "bakery-secret-key";

export function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function requireAuth(req: any, res: any, next: any): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  req.userId = payload.userId;
  req.userRole = payload.role;
  next();
}

export async function requireAdmin(req: any, res: any, next: any): Promise<void> {
  await requireAuth(req, res, () => {
    if (req.userRole !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, passwordHash, role: "customer" });

  const token = signToken(user._id.toString(), user.role);
  res.status(201).json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken(user._id.toString(), user.role);
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

router.get("/auth/me", requireAuth, async (req: any, res): Promise<void> => {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

export default router;
