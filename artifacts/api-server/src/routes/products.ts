import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { ProductModel } from "@workspace/db";
import {
  CreateProductBody,
  UpdateProductBody,
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

  const filter: Record<string, unknown> = {};
  if (query.category) filter.category = { $regex: new RegExp(`^${query.category}$`, "i") };
  if (query.search) {
    const rx = new RegExp(query.search, "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }
  if (query.featured === "true") filter.featured = true;

  const products = await ProductModel.find(filter).lean({ virtuals: true }).sort({ createdAt: 1 });
  res.json(products.map((p) => ({ ...p, id: (p as any)._id.toString(), _id: undefined, __v: undefined })));
});

router.post("/products", requireAdmin, async (req: any, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const product = await ProductModel.create(parsed.data);
  res.status(201).json(product.toJSON());
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  const product = await ProductModel.findById(id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product.toJSON());
});

router.patch("/products/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const product = await ProductModel.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product.toJSON());
});

router.delete("/products/:id", requireAdmin, async (req: any, res): Promise<void> => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
