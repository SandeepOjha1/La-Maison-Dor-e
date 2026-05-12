import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, Clock, Award, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useListProducts, useListReviews } from "@workspace/api-client-react";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 dark:from-stone-900 dark:via-amber-950 dark:to-stone-950">
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-200/30 dark:bg-amber-800/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-orange-200/25 dark:bg-orange-900/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Saffron accent blob */}
      <motion.div
        className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-yellow-300/20 dark:bg-yellow-700/15 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-sm px-4 py-1.5">
            Artisan Bakery Since 1987
          </Badge>
        </motion.div>

        <motion.h1
          className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground leading-[1.05] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Baked with
          <br />
          <span className="text-primary italic">soul</span>, served
          <br />
          with warmth
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          From buttery croissants to hand-decorated cakes, every creation is handcrafted with the finest ingredients and the most demanding standards.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link href="/menu">
            <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-md hover:shadow-lg transition-shadow" data-testid="button-view-menu">
              View Menu <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/reserve">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" data-testid="button-book-table">
              Book a Table
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 flex justify-center gap-6 flex-wrap">
          {[
            { value: "500+", label: "Daily customers" },
            { value: "33+", label: "Years of craft" },
            { value: "60+", label: "Fresh creations" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card/80 backdrop-blur-sm border border-card-border rounded-2xl px-6 py-4 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="font-serif text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.a
        href="#featured"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-1 text-xs"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
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
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-full-menu">
              Explore Full Menu <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
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
              {[
                { icon: Users, value: "200+", label: "Daily guests" },
                { icon: Award, value: "12", label: "Awards won" },
                { icon: Clock, value: "36h", label: "Fermentation" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-serif text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600" alt="Bakery kitchen" className="rounded-2xl object-cover h-64 w-full shadow-md" />
              <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600" alt="Fresh bread" className="rounded-2xl object-cover h-64 w-full shadow-md mt-8" />
              <img src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600" alt="Pastries" className="rounded-2xl object-cover h-48 w-full shadow-md" />
              <img src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600" alt="Cake decoration" className="rounded-2xl object-cover h-48 w-full shadow-md mt-4" />
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
                className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                data-testid={`card-review-${review.id}`}
              >
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
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
    { src: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800", alt: "Indian sweets", tall: true },
    { src: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800", alt: "Gulab jamun", tall: false },
    { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800", alt: "Celebration cake", tall: false },
    { src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800", alt: "Masala chai", tall: true },
    { src: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=800", alt: "Indian dessert spread", tall: false },
    { src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800", alt: "Fresh bread", tall: false },
    { src: "https://images.unsplash.com/photo-1571197119068-8bfc7b2aef05?w=800", alt: "Jalebi", tall: true },
    { src: "https://images.unsplash.com/photo-1527515637462-cff94ebb58ab?w=800", alt: "Donuts", tall: false },
    { src: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800", alt: "Colourful pastries", tall: false },
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
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
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Visit Us</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">Come find us</h2>
            <div className="space-y-5 text-muted-foreground">
              <div>
                <div className="font-semibold text-foreground mb-1">Address</div>
                <p>42 Rue de la Paix, Paris, 75002</p>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">Hours</div>
                <p>Monday – Friday: 7:00 AM – 8:00 PM</p>
                <p>Saturday – Sunday: 8:00 AM – 9:00 PM</p>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">Phone</div>
                <p>+33 1 42 60 00 00</p>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">Email</div>
                <p>hello@lamaison.com</p>
              </div>
            </div>
            <Link href="/reserve">
              <Button className="mt-8 gap-2" size="lg" data-testid="button-reserve-table">
                Reserve a Table <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="h-80 lg:h-auto rounded-2xl overflow-hidden bg-muted shadow-md"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
              alt="Annapurna Bakehouse interior"
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
