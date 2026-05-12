import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Cakes", "Pastries", "Bread", "Donuts", "Cookies", "Coffee"];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  available: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "Pastries",
  imageUrl: "",
  featured: false,
  available: true,
};

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      imageUrl: p.imageUrl,
      featured: p.featured,
      available: p.available,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    if (editId !== null) {
      updateProduct.mutate(
        { id: editId, data },
        {
          onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Product updated" }); },
          onError: () => toast({ title: "Failed to update", variant: "destructive" }),
        }
      );
    } else {
      createProduct.mutate(
        { data },
        {
          onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Product created" }); },
          onError: () => toast({ title: "Failed to create", variant: "destructive" }),
        }
      );
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => { invalidate(); toast({ title: "Product deleted" }); },
        onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">{(products ?? []).length} products</p>
          </div>
          <Button onClick={openCreate} className="gap-2" data-testid="button-new-product">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </motion.div>

        {/* Product form modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-semibold">{editId ? "Edit Product" : "New Product"}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" required data-testid="input-product-name" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 resize-none" rows={2} required data-testid="input-product-description" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Price ($)</Label>
                      <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" required data-testid="input-product-price" />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="mt-1" data-testid="input-product-image" />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} id="featured" />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} id="available" />
                      <Label htmlFor="available">Available</Label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending} data-testid="button-save-product">
                    {editId ? "Save Changes" : "Create Product"}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(products ?? []).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                data-testid={`card-admin-product-${p.id}`}
              >
                <Card className="overflow-hidden border-card-border shadow-sm hover:shadow-md transition-shadow">
                  <img src={p.imageUrl} alt={p.name} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-sm text-foreground truncate">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.category} · ${p.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {p.featured && <Badge className="text-[10px] bg-primary/10 text-primary px-1.5">Featured</Badge>}
                        {!p.available && <Badge variant="destructive" className="text-[10px] px-1.5">Unavail.</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => openEdit(p)} data-testid={`button-edit-product-${p.id}`}>
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id, p.name)} data-testid={`button-delete-product-${p.id}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
