import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  PlayCircle,
  Calendar
} from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  category: string;
  nextLesson?: string;
  certification: boolean;
}

interface ProgressTrackerProps {
  learningPaths: LearningPath[];
  totalProgress: number;
  weeklyGoal: number;
  currentStreak: number;
}

const ProgressTracker = ({ 
  learningPaths, 
  totalProgress, 
  weeklyGoal, 
  currentStreak 
}: ProgressTrackerProps) => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground">{totalProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-2xl font-bold text-foreground">{weeklyGoal}/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold text-foreground">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningPaths.map((path) => {
            const progressPercentage = Math.round((path.completedLessons / path.totalLessons) * 100);
            const isCompleted = progressPercentage === 100;
            
            return (
              <div key={path.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{path.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {path.category}
                      </Badge>
                      {path.certification && (
                        <Badge className="bg-accent/10 text-accent text-xs" variant="outline">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {path.completedLessons}/{path.totalLessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {path.estimatedTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {progressPercentage}%
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-success/10 text-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Progress value={progressPercentage} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    {path.nextLesson && !isCompleted ? (
                      <div className="text-sm text-muted-foreground">
                        Next: {path.nextLesson}
                      </div>
                    ) : isCompleted ? (
                      <div className="text-sm text-success">
                        🎉 Path completed! Ready for certification.
                      </div>
                    ) : (
                      <div></div>
                    )}
                    
                    <Button size="sm" variant={isCompleted ? "default" : "outline"}>
                      {isCompleted ? (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Get Certified
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;