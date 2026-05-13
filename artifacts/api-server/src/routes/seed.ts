import bcrypt from "bcryptjs";
import { UserModel, ProductModel, ReviewModel } from "@workspace/db";
import { logger } from "../lib/logger";

const PRODUCTS = [
  {
    name: "Croissant au Beurre",
    description: "Classic French butter croissant, flaky and golden",
    price: 4.5,
    category: "Pastries",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: "Sourdough Boule",
    description: "36-hour fermented sourdough with crisp crust",
    price: 9.0,
    category: "Bread",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    featured: true,
    available: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    name: "Tarte aux Fraises",
    description: "Vanilla custard tart topped with fresh strawberries",
    price: 7.5,
    category: "Pastries",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 56,
  },
  {
    name: "Macaron Assortment",
    description: "Box of 6 handmade French macarons, seasonal flavours",
    price: 14.0,
    category: "Pastries",
    imageUrl: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600",
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 203,
  },
  {
    name: "Chocolate Fondant Cake",
    description: "Rich dark chocolate cake with molten centre",
    price: 32.0,
    category: "Cakes",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    featured: true,
    available: true,
    rating: 4.9,
    reviewCount: 178,
  },
  {
    name: "Cinnamon Glazed Donuts",
    description: "Hand-rolled donuts with cinnamon sugar glaze",
    price: 3.5,
    category: "Donuts",
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94ebb58ab?w=600",
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 67,
  },
  {
    name: "Café au Lait",
    description: "House-roasted espresso with steamed whole milk",
    price: 5.0,
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 312,
  },
  {
    name: "Almond Financier",
    description: "Buttery almond mini cakes with caramelised edges",
    price: 3.0,
    category: "Pastries",
    imageUrl: "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600",
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 45,
  },
  {
    name: "Baguette Tradition",
    description: "Classic French baguette with chewy crumb and crackling crust",
    price: 3.5,
    category: "Bread",
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600",
    featured: false,
    available: true,
    rating: 4.8,
    reviewCount: 290,
  },
  {
    name: "Fraisier Celebration Cake",
    description: "Two-layer génoise with mousseline cream and strawberries",
    price: 48.0,
    category: "Cakes",
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600",
    featured: false,
    available: true,
    rating: 5.0,
    reviewCount: 34,
  },
  {
    name: "Double Chocolate Cookie",
    description: "Thick, fudgy cookie loaded with two types of chocolate",
    price: 3.8,
    category: "Cookies",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 88,
  },
  {
    name: "Salted Caramel Éclair",
    description: "Choux pastry filled with caramel crème, salted caramel glaze",
    price: 6.5,
    category: "Pastries",
    imageUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600",
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 142,
  },
];

const REVIEWS = [
  { customerName: "Sophie M.", rating: 5, comment: "The croissants are absolutely divine — better than anything I've had in Paris!" },
  { customerName: "James T.", rating: 5, comment: "La Maison Dorée has ruined all other bakeries for me. The sourdough is perfection." },
  { customerName: "Amelia R.", rating: 4, comment: "Stunning macarons. The rose and pistachio are my favourites." },
  { customerName: "Lucas B.", rating: 5, comment: "I ordered the celebration cake for my wife's birthday — it was extraordinary." },
  { customerName: "Chloé W.", rating: 5, comment: "The best café au lait in the city, paired with a warm financier. Heaven." },
];

export async function seedDatabase(): Promise<void> {
  const productCount = await ProductModel.countDocuments();
  if (productCount > 0) {
    logger.info("Database already seeded — skipping.");
    return;
  }

  logger.info("Seeding database…");

  const adminHash = await bcrypt.hash("admin123", 10);
  await UserModel.create({
    name: "Admin",
    email: "admin@lamaison.com",
    passwordHash: adminHash,
    role: "admin",
  });

  await ProductModel.insertMany(PRODUCTS);

  await ReviewModel.insertMany(REVIEWS.map((r) => ({ ...r, approved: true })));

  logger.info("Database seeded successfully.");
}
