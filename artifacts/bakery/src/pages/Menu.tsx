import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useListProducts, useListCategories } from "@workspace/api-client-react";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: search || undefined,
  });

  const allCategories = ["All", ...(categories ?? [])];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">Our Menu</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every item made fresh daily — no shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex gap-2 flex-wrap mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full"
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="h-52 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (products ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search or category.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products ?? []).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
