import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Star,
  ArrowRight,
  Award,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id?: string;
  title: string;
  description: string;
  duration: string;
  students: string;
  rating: string;
  level: string;
  price: string;
  category: string;
  certification?: boolean;
  featured?: boolean;
  instructorImage?: string;
  instructorName?: string;
}

const CourseCard = ({
  id = "1",
  title,
  description,
  duration,
  students,
  rating,
  level,
  price,
  category,
  certification = false,
  featured = false,
  instructorImage,
  instructorName,
}: CourseCardProps) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/courses/${id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-accent/10 text-accent border-accent/20";
    }
  };

  return (
    <Card
      className={`group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border ${featured ? "ring-2 ring-primary/20" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getLevelColor(level)} variant="outline">
              {level}
            </Badge>
            {certification && (
              <Badge
                className="bg-accent/10 text-accent border-accent/20"
                variant="outline"
              >
                <Award className="h-3 w-3 mr-1" />
                Certified
              </Badge>
            )}
            {featured && (
              <Badge
                className="bg-primary/10 text-primary border-primary/20"
                variant="outline"
              >
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xl font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg ml-2 shrink-0">
            <DollarSign className="h-4 w-4" />
            {price.replace("$", "")}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
          {category}
        </div>
        <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {/* Instructor Section */}
        {instructorImage && instructorName && (
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <img
              src={instructorImage}
              alt={`Instructor ${instructorName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-foreground">Instructor</p>
              <p className="text-xs text-muted-foreground">{instructorName}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {students}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            {rating}
          </div>
        </div>

        <Button
          className="w-full group"
          variant={featured ? "default" : "outline"}
          onClick={handleViewCourse}
        >
          View Course
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
