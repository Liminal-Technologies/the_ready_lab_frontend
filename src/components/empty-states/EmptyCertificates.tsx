import { Award, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface EmptyCertificatesProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyCertificates = ({
  message = "Start Earning Certificates",
  description = "Complete courses to earn professional certificates you can share on LinkedIn and add to your resume. Each certificate includes a unique verification code to prove your achievement.",
  actionLabel = "Find Courses to Complete",
  actionPath = "/explore"
}: EmptyCertificatesProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2">
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-2xl"></div>
          <Award className="relative h-20 w-20 text-yellow-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-3">{message}</h3>
        <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
          {description}
        </p>
        <Button 
          onClick={() => navigate(actionPath)}
          size="lg"
          className="gap-2"
          data-testid="button-find-courses"
        >
          <Trophy className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};
