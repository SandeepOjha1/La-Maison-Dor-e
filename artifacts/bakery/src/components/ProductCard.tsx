import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, ShoppingCart, Plus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string | number;
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
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAddToCart = () => {
    addItem({
      productId: String(product.id),
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
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.12)", y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 animate-pulse" />
            )}
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 gap-2">
            <ImageOff className="w-8 h-8 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground/60">{product.category}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.featured && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.3 }}
          >
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs shadow-md">
              ✦ Featured
            </Badge>
          </motion.div>
        )}

        {!product.available && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-sm font-medium text-muted-foreground">Unavailable</span>
          </div>
        )}

        <motion.button
          className="absolute bottom-3 right-3 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100"
          initial={false}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={handleAddToCart}
          disabled={!product.available}
          data-testid={`button-add-cart-${product.id}`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center gap-1">
            <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </motion.div>
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
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
