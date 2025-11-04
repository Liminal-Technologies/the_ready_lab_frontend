import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyCoursesProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyCourses = ({
  message = "No courses yet",
  description = "Start your learning journey by exploring our courses",
  actionLabel = "Browse Courses",
  actionPath = "/explore"
}: EmptyCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      <Button onClick={() => navigate(actionPath)}>
        {actionLabel}
      </Button>
    </div>
  );
};
