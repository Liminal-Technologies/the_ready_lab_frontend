import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface SuggestedAction {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
  badge?: string;
}

interface SuggestedActionsProps {
  title?: string;
  description?: string;
  actions: SuggestedAction[];
}

export function SuggestedActions({ 
  title = "Suggested Next Steps", 
  description = "Here are some actions to help you get the most out of your experience",
  actions 
}: SuggestedActionsProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4 md:pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-base">
          <span className="text-xl md:text-lg">💡</span>
          {title}
        </CardTitle>
        <CardDescription className="text-sm md:text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid md:grid-cols-2 gap-4 md:gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="card-interactive hover:border-primary/40 relative overflow-hidden group"
                data-testid={`action-card-${index}`}
              >
                <CardContent className="p-5 md:p-4">
                  <div className="flex items-start gap-4 md:gap-3">
                    <div className="p-3 md:p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1 space-y-2 md:space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-base md:text-sm">{action.title}</h4>
                        {action.badge && (
                          <span className="text-xs px-2 md:px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm md:text-xs text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                      <Button 
                        variant={action.variant || "outline"}
                        size="sm"
                        className="mt-2 md:mt-1.5 group/btn"
                        onClick={() => action.onClick ? action.onClick() : action.ctaLink && navigate(action.ctaLink)}
                        data-testid={`button-${action.ctaText.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {action.ctaText}
                        <ArrowRight className="ml-2 md:ml-1.5 h-4 w-4 md:h-3.5 md:w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
