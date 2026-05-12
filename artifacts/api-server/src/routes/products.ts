import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import {
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

router.get("/products/categories", async (_req, res): Promise<void> => {
  const categories = ["Cakes", "Pastries", "Bread", "Donuts", "Cookies", "Coffee"];
  res.json(categories);
});

router.get("/products", async (req, res): Promise<void> => {
  const queryParsed = ListProductsQueryParams.safeParse(req.query);
  const query = queryParsed.success ? queryParsed.data : {};

  let products = await db.select().from(productsTable);

  if (query.category) {
    products = products.filter((p) => p.category.toLowerCase() === query.category!.toLowerCase());
  }
  if (query.search) {
    const search = query.search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
    );
  }
  if (query.featured === "true") {
    products = products.filter((p) => p.featured);
  }

  res.json(products);
});

router.post("/products", requireAdmin, async (req: any, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(product);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.patch("/products/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set(parsed.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.delete("/products/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db.delete(productsTable).where(eq(productsTable.id, params.data.id)).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
