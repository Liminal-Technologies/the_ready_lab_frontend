import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface EmptyCoursesProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyCourses = ({
  message = "Your Learning Journey Starts Here",
  description = "Discover courses from expert educators and start building skills that matter. From business fundamentals to advanced technical training, find what fits your goals.",
  actionLabel = "Browse Course Catalog",
  actionPath = "/explore"
}: EmptyCoursesProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2">
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <BookOpen className="relative h-20 w-20 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-3">{message}</h3>
        <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
          {description}
        </p>
        <Button 
          onClick={() => navigate(actionPath)}
          size="lg"
          className="gap-2"
          data-testid="button-browse-courses"
        >
          <Sparkles className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};
