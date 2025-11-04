import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCommunityProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyCommunity = ({
  message = "No posts yet",
  description = "Be the first to start a conversation in this community",
  actionLabel = "Create Post",
  onAction,
  showAction = true,
}: EmptyCommunityProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {showAction && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
