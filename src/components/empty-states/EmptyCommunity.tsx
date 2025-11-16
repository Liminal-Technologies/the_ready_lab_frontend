import { MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyCommunityProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyCommunity = ({
  message = "Join the Conversation",
  description = "Connect with peers, ask questions, and share insights. Communities are where learning comes alive through discussion and collaboration.",
  actionLabel = "Explore Communities",
  onAction,
  showAction = true
}: EmptyCommunityProps) => {
  return (
    <Card className="border-dashed border-2">
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl"></div>
          <Users className="relative h-20 w-20 text-purple-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-3">{message}</h3>
        <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
          {description}
        </p>
        {showAction && onAction && (
          <Button 
            onClick={onAction}
            size="lg"
            className="gap-2"
            data-testid="button-explore-communities"
          >
            <MessageSquare className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
