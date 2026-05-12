import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  featured: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      data-testid={`card-product-${product.id}`}
      className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
            Featured
          </Badge>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">Unavailable</span>
          </div>
        )}
        <motion.button
          className="absolute bottom-3 right-3 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={!product.available}
          data-testid={`button-add-cart-${product.id}`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium" data-testid={`text-rating-${product.id}`}>{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground" data-testid={`text-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.available}
            className="h-8 gap-1.5 text-xs"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-3 h-3" />
            Add to cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
