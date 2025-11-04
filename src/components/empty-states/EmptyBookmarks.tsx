import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyBookmarksProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyBookmarks = ({
  message = "No bookmarks yet",
  description = "Save lessons and resources from the feed to access them quickly",
  actionLabel = "Explore Content",
  actionPath = "/feed",
}: EmptyBookmarksProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        {description}
      </p>
      <Button onClick={() => navigate(actionPath)} variant="outline">
        {actionLabel}
      </Button>
    </div>
  );
};
