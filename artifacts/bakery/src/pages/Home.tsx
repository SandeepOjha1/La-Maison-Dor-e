import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { ArrowRight, Star, Clock, Award, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useListProducts, useListReviews } from "@workspace/api-client-react";

// Animated count-up number
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(value) {
        if (ref.current) ref.current.textContent = Math.round(value) + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// Floating bakery emoji element
function FloatingItem({ emoji, x, y, delay, duration }: { emoji: string; x: string; y: string; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute text-3xl select-none pointer-events-none"
      style={{ left: x, top: y }}
      animate={{
        y: ["0%", "-20%", "0%"],
        x: ["0%", "8%", "0%"],
        rotate: [0, 8, -4, 0],
        opacity: [0.25, 0.45, 0.25],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

function HeroSection() {
  const words = ["Baked", "with", "soul,", "served", "with", "warmth"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 dark:from-stone-900 dark:via-amber-950 dark:to-stone-950">
      {/* Animated blobs */}
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 rounded-full bg-amber-200/40 dark:bg-amber-800/25 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 left-12 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.2, 0.35], x: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-yellow-300/20 dark:bg-yellow-700/15 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating bakery items */}
      <FloatingItem emoji="🥐" x="8%" y="20%" delay={0} duration={7} />
      <FloatingItem emoji="☕" x="88%" y="15%" delay={1.2} duration={8} />
      <FloatingItem emoji="🎂" x="5%" y="65%" delay={0.6} duration={9} />
      <FloatingItem emoji="🍩" x="90%" y="60%" delay={2} duration={6.5} />
      <FloatingItem emoji="🍞" x="75%" y="80%" delay={0.3} duration={8.5} />
      <FloatingItem emoji="🧁" x="20%" y="85%" delay={1.5} duration={7.5} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-sm px-4 py-1.5">
            ✦ Artisan Bakery Since 1987
          </Badge>
        </motion.div>

        {/* Word-by-word reveal */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground leading-[1.05] mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-[0.25em] ${word === "soul," ? "text-primary italic" : ""}`}
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          From buttery croissants to hand-decorated cakes, every creation is handcrafted with the finest ingredients and the most demanding standards.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <Link href="/menu">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-lg hover:shadow-xl transition-shadow" data-testid="button-view-menu">
                View Menu <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/reserve">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base" data-testid="button-book-table">
                Book a Table
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats with count-up */}
        <div className="mt-16 flex justify-center gap-6 flex-wrap">
          {[
            { value: 200, suffix: "+", label: "Daily customers" },
            { value: 37, suffix: " yrs", label: "Of mastery" },
            { value: 60, suffix: "+", label: "Fresh items daily" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card/80 backdrop-blur-sm border border-card-border rounded-2xl px-6 py-4 shadow-sm"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.12, duration: 0.5, ease: "backOut" }}
              whileHover={{ y: -5, boxShadow: "0 12px 28px rgba(0,0,0,0.1)" }}
            >
              <div className="font-serif text-2xl font-bold text-primary">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.a
        href="#featured"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-1 text-xs cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <span>Explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.a>
    </section>
  );
}

function FeaturedProducts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: products, isLoading } = useListProducts({ featured: "true" });

  return (
    <section id="featured" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Specialties</Badge>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Creations
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Handcrafted daily by our pastry chefs — the finest ingredients, the most demanding standards.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="h-52 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(products ?? []).slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link href="/menu">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-full-menu">
                Explore Full Menu <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { icon: Users, value: 200, suffix: "+", label: "Daily guests" },
    { icon: Award, value: 12, suffix: "", label: "Awards won" },
    { icon: Clock, value: 36, suffix: "h", label: "Fermentation" },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Story</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Born from a passion for the perfect pastry
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              La Maison Dorée was founded in 1987 by Chef Michel Leblanc, trained at the Lenôtre school in Paris. What started as a small neighborhood boulangerie has become one of the city's most beloved culinary institutions.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Every croissant is still laminated by hand. Every sourdough goes through a 36-hour fermentation. We believe the best things take time — and we take all the time they need.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {stats.map(({ icon: Icon, value, suffix, label }, i) => (
                <motion.div
                  key={label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-serif text-2xl font-bold text-foreground">
                    <CountUp to={value} suffix={suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&fit=crop&auto=format&q=80", alt: "Bakery kitchen", cls: "h-64 mt-0" },
                { src: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&fit=crop&auto=format&q=80", alt: "Fresh bread", cls: "h-64 mt-8" },
                { src: "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600&fit=crop&auto=format&q=80", alt: "Pastries", cls: "h-48 mt-0" },
                { src: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&fit=crop&auto=format&q=80", alt: "Cake decoration", cls: "h-48 mt-4" },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-md ${img.cls}`}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: reviews, isLoading } = useListReviews();

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What our guests say
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border p-6 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {(reviews ?? []).slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                className="bg-card border border-card-border rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.14, duration: 0.5, ease: "backOut" }}
                whileHover={{ y: -5, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
                data-testid={`card-review-${review.id}`}
              >
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: i * 0.14 + j * 0.06 + 0.2, type: "spring", stiffness: 400 }}
                    >
                      <Star className={`w-4 h-4 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    </motion.div>
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
                <div className="font-semibold text-sm text-foreground">{review.customerName}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const images = [
    { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&fit=crop&auto=format&q=80", alt: "Celebration cake", tall: true },
    { src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&fit=crop&auto=format&q=80", alt: "Croissant", tall: false },
    { src: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&fit=crop&auto=format&q=80", alt: "Macarons", tall: false },
    { src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&fit=crop&auto=format&q=80", alt: "Tarte", tall: true },
    { src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&fit=crop&auto=format&q=80", alt: "Sourdough", tall: false },
    { src: "https://images.unsplash.com/photo-1527515637462-cff94ebb58ab?w=800&fit=crop&auto=format&q=80", alt: "Donuts", tall: false },
    { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&fit=crop&auto=format&q=80", alt: "Coffee", tall: true },
    { src: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800&fit=crop&auto=format&q=80", alt: "Éclair", tall: false },
    { src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&fit=crop&auto=format&q=80", alt: "Cookies", tall: false },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Gallery</Badge>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">From our kitchen</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            A glimpse into the colours, textures, and flavours we craft every day.
          </p>
        </motion.div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover ${img.tall ? "h-72" : "h-48"}`}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Visit Us</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">Come find us</h2>
            <div className="space-y-5 text-muted-foreground">
              {[
                { label: "Address", lines: ["42 Rue de la Paix, Paris, 75002"] },
                { label: "Hours", lines: ["Monday – Friday: 7:00 AM – 8:00 PM", "Saturday – Sunday: 8:00 AM – 9:00 PM"] },
                { label: "Phone", lines: ["+33 1 42 60 00 00"] },
                { label: "Email", lines: ["hello@lamaison.com"] },
              ].map(({ label, lines }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                >
                  <div className="font-semibold text-foreground mb-1">{label}</div>
                  {lines.map((l) => <p key={l}>{l}</p>)}
                </motion.div>
              ))}
            </div>
            <Link href="/reserve">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block mt-8">
                <Button className="gap-2" size="lg" data-testid="button-reserve-table">
                  Reserve a Table <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="h-80 lg:h-auto rounded-2xl overflow-hidden bg-muted shadow-md"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
          >
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&fit=crop&auto=format&q=80"
              alt="Bakery interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <TestimonialsSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
}
