import { motion } from "framer-motion";
import { Mail, MailOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListContactMessages } from "@workspace/api-client-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = useListContactMessages();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">{(messages ?? []).length} contact messages</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (messages ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No messages yet</div>
        ) : (
          <div className="space-y-4">
            {[...(messages ?? [])].reverse().map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-testid={`card-message-${msg.id}`}
              >
                <Card className="p-5 border-card-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.read ? "bg-muted" : "bg-primary/10"}`}>
                      {msg.read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-foreground">{msg.name}</span>
                        {!msg.read && <Badge className="bg-primary/10 text-primary text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                      <p className="text-sm font-medium text-foreground mt-2">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
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
