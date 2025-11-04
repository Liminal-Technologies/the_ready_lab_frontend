import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyContentProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
  showAction?: boolean;
}

export const EmptyContent = ({
  message = "No content yet",
  description = "Create your first piece of content to get started",
  actionLabel = "Create Content",
  actionPath = "/dashboard",
  showAction = true,
}: EmptyContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {showAction && (
        <Button onClick={() => navigate(actionPath)}>{actionLabel}</Button>
      )}
    </div>
  );
};
