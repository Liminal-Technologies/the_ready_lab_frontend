import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Clock, Calendar } from "lucide-react";

interface CertificationBadgeProps {
  title: string;
  issuer: string;
  dateEarned?: string;
  progress?: number;
  status: "earned" | "in-progress" | "available";
  credentialId?: string;
  size?: "sm" | "md" | "lg";
}

const CertificationBadge = ({
  title,
  issuer,
  dateEarned,
  progress = 0,
  status,
  credentialId,
  size = "md"
}: CertificationBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "earned":
        return {
          color: "bg-success text-success-foreground",
          icon: CheckCircle,
          label: "Certified"
        };
      case "in-progress":
        return {
          color: "bg-warning text-warning-foreground",
          icon: Clock,
          label: "In Progress"
        };
      case "available":
        return {
          color: "bg-muted text-muted-foreground",
          icon: Award,
          label: "Available"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "p-3 text-sm",
    md: "p-4 text-base",
    lg: "p-6 text-lg"
  };

  return (
    <Card className={`group transition-all duration-300 ${status === "earned" ? "ring-2 ring-success/20 hover:ring-success/40" : "hover:shadow-medium"}`}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.color} shadow-soft`}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{issuer}</p>
            
            {status === "in-progress" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {status === "earned" && dateEarned && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Earned {dateEarned}</span>
              </div>
            )}
            
            {credentialId && status === "earned" && (
              <div className="text-xs text-muted-foreground mt-1">
                ID: {credentialId}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationBadge;