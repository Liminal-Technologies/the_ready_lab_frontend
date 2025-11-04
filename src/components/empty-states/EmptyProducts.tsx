import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyProductsProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
  showAction?: boolean;
}

export const EmptyProducts = ({
  message = "No products available",
  description = "Check back soon for new digital products and templates",
  actionLabel = "Browse All Products",
  actionPath = "/products",
  showAction = true,
}: EmptyProductsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Package className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {showAction && (
        <Button onClick={() => navigate(actionPath)}>{actionLabel}</Button>
      )}
    </div>
  );
};
