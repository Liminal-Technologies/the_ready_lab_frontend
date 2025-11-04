import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  Share2,
  Flag,
  Play,
  Pause,
  Trophy,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [quizPassed, setQuizPassed] = useState(false);

  // Quiz modal states
  const [showQuizTrigger, setShowQuizTrigger] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  // Mock quiz questions
  const mockQuizQuestions = [
    {
      question: "What is the main concept covered in this lesson?",
      options: [
        "Introduction to basic concepts",
        "Core principles and foundations",
        "Advanced implementation techniques",
        "Summary and conclusions",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which of the following is an example of best practices?",
      options: [
        "Following industry standards",
        "Ignoring code quality",
        "Skipping documentation",
        "Avoiding testing",
      ],
      correctAnswer: 0,
    },
    {
      question: "What is the most important takeaway from this lesson?",
      options: [
        "Memorizing all details",
        "Understanding core concepts",
        "Copying code examples",
        "Rushing through material",
      ],
      correctAnswer: 1,
    },
    {
      question: "How should you apply what you learned?",
      options: [
        "Wait for perfect conditions",
        "Practice and experiment",
        "Only use in specific scenarios",
        "Avoid real-world application",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the next step after completing this lesson?",
      options: [
        "Stop learning",
        "Review and practice",
        "Skip to advanced topics",
        "Forget the basics",
      ],
      correctAnswer: 1,
    },
  ];

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);

      // Trigger quiz at 95%
      if (
        currentProgress >= 95 &&
        !hasCompleted &&
        !showQuizTrigger &&
        !quizPassed
      ) {
        setShowQuizTrigger(true);
        video.pause();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [hasCompleted]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select(
          `
 *,
 module:modules (
 id,
 title,
 track:tracks (
 id,
 title
 )
 ),
 lesson_progress (
 status,
 completion_date
 )
 `,
        )
        .eq("id", lessonId)
        .single();

      if (error) throw error;
      setLesson(data);
      setHasCompleted(data.lesson_progress?.[0]?.status === "completed");

      // Fetch quiz if exists
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (quizData) {
        setQuiz(quizData);

        // Check if user has passed the quiz
        const { data: user } = await supabase.auth.getUser();
        if (user?.user) {
          const { data: attempts } = await supabase
            .from("quiz_attempts")
            .select("passed")
            .eq("quiz_id", quizData.id)
            .eq("user_id", user.user.id)
            .eq("passed", true)
            .limit(1);

          setQuizPassed(!!attempts && attempts.length > 0);
        }
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast({
        title: "Error",
        description: "Failed to load lesson",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    if (hasCompleted) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user.user.id,
        lesson_id: lessonId,
        status: "completed",
        completion_date: new Date().toISOString(),
      });

      if (error) throw error;

      setHasCompleted(true);
      toast({
        title: "Lesson completed! 🎉",
        description: "Great job on finishing this lesson",
      });
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleStartQuiz = () => {
    setShowQuizTrigger(false);
    setShowQuizModal(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  const handleSkipQuiz = () => {
    setShowQuizTrigger(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < mockQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      const correctAnswers = mockQuizQuestions.filter(
        (q, i) => newAnswers[i] === q.correctAnswer,
      ).length;
      const score = Math.round(
        (correctAnswers / mockQuizQuestions.length) * 100,
      );
      setQuizScore(score);
      setShowQuizModal(false);
      setShowResultsModal(true);

      // Mark as passed if score >= 70%
      if (score >= 70) {
        setQuizPassed(true);
        markAsComplete();
      }
    }
  };

  const handleRetakeQuiz = () => {
    setShowResultsModal(false);
    setShowQuizModal(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  const handleNextLesson = () => {
    setShowResultsModal(false);
    toast({
      title: "Great job!",
      description: "Moving to next lesson...",
    });
    // Navigate to next lesson logic here
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <p>Loading lesson...</p>
        </div>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Lesson not found</p>
            <Button onClick={() => navigate("/feed")}>Back to Feed</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/feed")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>

            {/* Video Player */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative aspect-video bg-black group">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  src={
                    lesson.content_url ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                  poster="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200"
                />

                {/* Video Controls Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={togglePlayPause}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="h-10 w-10 text-white" fill="white" />
                    ) : (
                      <Play
                        className="h-10 w-10 text-white ml-1"
                        fill="white"
                      />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription>
                      {lesson.module?.track?.title} • {lesson.module?.title}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={hasCompleted ? "default" : "outline"}
                      onClick={markAsComplete}
                      disabled={hasCompleted}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {hasCompleted ? "Completed" : "Mark Complete"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList
                className={`grid w-full ${quiz ? "grid-cols-5" : "grid-cols-4"}`}
              >
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {quiz && (
                  <TabsTrigger value="quiz" className="relative">
                    Quiz
                    {quizPassed && (
                      <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                )}
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {lesson.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {quiz && (
                <TabsContent value="quiz" className="mt-6">
                  <QuizPlayer
                    quizId={quiz.id}
                    quizTitle={quiz.title}
                    passThreshold={quiz.pass_threshold}
                    onComplete={(passed, score) => {
                      setQuizPassed(passed);
                      toast({
                        title: passed ? "Quiz Passed!" : "Quiz Completed",
                        description: `Your score: ${score}%`,
                      });
                    }}
                  />
                </TabsContent>
              )}

              <TabsContent value="comments" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Comments coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Note-taking feature coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Transcript coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Quiz Trigger Modal */}
      <Dialog open={showQuizTrigger} onOpenChange={setShowQuizTrigger}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Time for a Quick Quiz!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Test your understanding of what you just learned. You need 70% to
              pass.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleSkipQuiz}
              className="flex-1"
            >
              Skip
            </Button>
            <Button onClick={handleStartQuiz} className="flex-1">
              Take Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Lesson Quiz - {lesson?.title}
            </DialogTitle>
            <DialogDescription>
              Question {currentQuestionIndex + 1} of {mockQuizQuestions.length}
            </DialogDescription>
          </DialogHeader>

          <Progress
            value={
              ((currentQuestionIndex + 1) / mockQuizQuestions.length) * 100
            }
            className="mb-4"
          />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              {mockQuizQuestions[currentQuestionIndex].question}
            </h3>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            >
              {mockQuizQuestions[currentQuestionIndex].options.map(
                (option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ),
              )}
            </RadioGroup>

            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              {currentQuestionIndex < mockQuizQuestions.length - 1
                ? "Next"
                : "Complete Quiz"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {quizScore >= 70 ? "Great job! 🎉" : "Almost there!"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            {quizScore >= 70 ? (
              <div className="w-20 h-20 rounded-full bg-green-100/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-yellow-100/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-yellow-600" />
              </div>
            )}

            <div className="text-center">
              <p className="text-3xl font-bold mb-2">You scored {quizScore}%</p>
              <p className="text-muted-foreground">
                {quizScore >= 70
                  ? "You passed! Ready for the next lesson."
                  : "You need 70% to pass. Try again!"}
              </p>
            </div>

            {quizScore >= 70 ? (
              <Button onClick={handleNextLesson} className="w-full">
                Next Lesson
              </Button>
            ) : (
              <Button onClick={handleRetakeQuiz} className="w-full">
                Try Again
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
