import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useListReviews, useApproveReview, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useListReviews();
  const approveReview = useApproveReview();

  // Fetch all reviews including pending — we show approved from the public endpoint
  // In a full implementation, admin would have a separate "pending reviews" endpoint

  const handleApprove = (id: number) => {
    approveReview.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
          toast({ title: "Review approved" });
        },
        onError: () => toast({ title: "Failed to approve", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Approved customer reviews</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (reviews ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No reviews yet</div>
        ) : (
          <div className="space-y-4">
            {(reviews ?? []).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-testid={`card-review-${review.id}`}
              >
                <Card className="p-5 border-card-border shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-foreground">{review.customerName}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                          ))}
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                          Approved
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
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
