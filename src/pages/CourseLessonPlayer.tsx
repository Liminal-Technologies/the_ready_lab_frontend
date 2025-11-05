import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ChevronDown, 
  ChevronRight,
  Check,
  Lock,
  Download,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Send,
  User,
  CheckCircle2,
  Award,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  current: boolean;
  isQuiz?: boolean;
  quizId?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface DiscussionPost {
  id: number;
  author: string;
  authorInitials: string;
  title: string;
  content: string;
  timeAgo: string;
  replies: number;
  likes: number;
  isLiked: boolean;
  showReplies?: boolean;
  replyText?: string;
}

const mockModules: Module[] = [
  {
    id: 1,
    title: "Getting Started",
    lessons: [
      { id: 1, title: "Introduction", duration: "12:30", completed: true, locked: false, current: false },
      { id: 2, title: "Core Concepts", duration: "18:45", completed: false, locked: false, current: true },
      { id: 3, title: "Best Practices", duration: "15:20", completed: false, locked: true, current: false },
      { id: 4, title: "Module 1 Quiz", duration: "15 mins", completed: false, locked: true, current: false, isQuiz: true, quizId: "quiz-module-1" },
    ],
  },
  {
    id: 2,
    title: "Advanced Topics",
    lessons: [
      { id: 5, title: "Implementation", duration: "25:10", completed: false, locked: true, current: false },
      { id: 6, title: "Case Studies", duration: "20:00", completed: false, locked: true, current: false },
      { id: 7, title: "Module 2 Quiz", duration: "15 mins", completed: false, locked: true, current: false, isQuiz: true, quizId: "quiz-module-2" },
    ],
  },
];

const mockResources = [
  { id: 1, name: "Course Introduction.pdf", size: "2.3 MB" },
  { id: 2, name: "Code Templates.zip", size: "1.8 MB" },
  { id: 3, name: "Cheat Sheet.pdf", size: "450 KB" },
];

const initialDiscussionPosts: DiscussionPost[] = [
  {
    id: 1,
    author: "Sarah J.",
    authorInitials: "SJ",
    title: "How do I apply this concept to my business?",
    content: "I run a small e-commerce business and I'm trying to understand how these principles can be applied in my specific context. Can anyone share real-world examples?",
    timeAgo: "2 days ago",
    replies: 3,
    likes: 5,
    isLiked: false,
    showReplies: false,
    replyText: "",
  },
  {
    id: 2,
    author: "Mike T.",
    authorInitials: "MT",
    title: "Can you clarify the example at 12:45?",
    content: "I watched this section multiple times but I'm still confused about the implementation details shown at the 12:45 mark. Could someone break it down?",
    timeAgo: "5 hours ago",
    replies: 1,
    likes: 2,
    isLiked: false,
    showReplies: false,
    replyText: "",
  },
  {
    id: 3,
    author: "Emma R.",
    authorInitials: "ER",
    title: "Best practices for implementation?",
    content: "What are some best practices you'd recommend when implementing this in a production environment? Any common pitfalls to avoid?",
    timeAgo: "1 day ago",
    replies: 4,
    likes: 8,
    isLiked: true,
    showReplies: false,
    replyText: "",
  },
  {
    id: 4,
    author: "James K.",
    authorInitials: "JK",
    title: "Additional resources on this topic?",
    content: "Does anyone have recommendations for books, articles, or other courses that complement what we're learning here? I'd love to dive deeper.",
    timeAgo: "3 days ago",
    replies: 2,
    likes: 4,
    isLiked: false,
    showReplies: false,
    replyText: "",
  },
];

export default function CourseLessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [captions, setCaptions] = useState<string>("english");
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [openModules, setOpenModules] = useState<number[]>([1, 2]);
  const [notes, setNotes] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Discussion state
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(initialDiscussionPosts);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  
  // Progress tracking state
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]); // Lesson 1 is already complete
  const [currentLessonComplete, setCurrentLessonComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const totalLessons = mockModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);
  
  const allLessons = mockModules.flatMap(m => m.lessons);
  const currentLessonId = lessonId ? parseInt(lessonId) : 2;
  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[1];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLessonClick = (clickedLessonId: number, locked: boolean) => {
    if (locked) {
      toast.error("Lesson Locked", {
        description: "Complete previous lessons to unlock this one",
      });
    } else {
      navigate(`/courses/${courseId}/lessons/${clickedLessonId}`);
      setMobileSheetOpen(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setOpenModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSaveNote = () => {
    toast.success("Note Saved ✍️", {
      description: "Your note has been saved successfully",
    });
  };

  const handlePostQuestion = () => {
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) {
      toast.error("Error", {
        description: "Please fill in both title and content",
      });
      return;
    }

    const newPost: DiscussionPost = {
      id: discussionPosts.length + 1,
      author: "You",
      authorInitials: "YO",
      title: newQuestionTitle,
      content: newQuestionContent,
      timeAgo: "Just now",
      replies: 0,
      likes: 0,
      isLiked: false,
      showReplies: false,
      replyText: "",
    };

    setDiscussionPosts([newPost, ...discussionPosts]);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setQuestionModalOpen(false);

    toast.success("Question Posted! 💬", {
      description: "Your question has been added to the discussion",
    });
  };

  const handleLikePost = (postId: number) => {
    setDiscussionPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleReplyClick = (postId: number) => {
    setDiscussionPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, showReplies: !post.showReplies } : post
      )
    );
  };

  const handleReplySubmit = (postId: number) => {
    const post = discussionPosts.find(p => p.id === postId);
    if (!post?.replyText?.trim()) return;

    setDiscussionPosts(posts =>
      posts.map(p =>
        p.id === postId
          ? { ...p, replies: p.replies + 1, replyText: "", showReplies: false }
          : p
      )
    );

    toast.success("Reply Posted! 💬", {
      description: "Your reply has been added",
    });
  };

  const handleReplyTextChange = (postId: number, text: string) => {
    setDiscussionPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, replyText: text } : post
      )
    );
  };

  const toggleExpandPost = (postId: number) => {
    setExpandedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleMarkComplete = () => {
    if (!completedLessons.includes(currentLessonId)) {
      setCompletedLessons([...completedLessons, currentLessonId]);
      setCurrentLessonComplete(true);
      
      toast.success("Lesson completed! 🎉", {
        description: "Great job! You're making excellent progress",
      });

      // Check if this was the last lesson
      if (completedLessons.length + 1 === totalLessons) {
        setTimeout(() => setShowCelebration(true), 1000);
      }
    }
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    const nextLessonToNav = allLessons[currentIndex + 1];
    
    if (nextLessonToNav) {
      navigate(`/courses/${courseId}/lessons/${nextLessonToNav.id}`);
      setMobileSheetOpen(false);
    }
  };

  const handleViewCertificate = () => {
    toast.success("📧 Certificate Email Sent!", {
      description: "We've emailed your certificate to your registered email address. You can also download it from your dashboard.",
    });
    setTimeout(() => {
      navigate("/certificates");
    }, 1500);
  };

  // Auto-complete when video reaches 95%
  const handleProgress = (state: any) => {
    setPlayed(state.played);
    
    if (state.played >= 0.95 && !currentLessonComplete && !completedLessons.includes(currentLessonId)) {
      handleMarkComplete();
    }
  };

  // Get next lesson for navigation
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const nextLesson = allLessons[currentIndex + 1];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Course</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4 mr-2" />
                  Lessons
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Course Content</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {mockModules.map((module) => (
                    <Collapsible
                      key={module.id}
                      open={openModules.includes(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-2">
                          {openModules.includes(module.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-semibold text-sm">
                            Module {module.id}: {module.title}
                          </span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-1">
                        {module.lessons.map((lesson) => {
                          const isLocked = lesson.locked && !completedLessons.includes(lesson.id - 1);
                          const isCurrent = lesson.id === currentLessonId;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson.id, isLocked)}
                              className={`w-full text-left p-3 rounded-lg transition-colors ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent"
                              } ${isLocked ? "opacity-60" : ""}`}
                              disabled={isLocked}
                              data-testid={`lesson-button-${lesson.id}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-xs font-medium">
                                    L{lesson.id}:
                                  </span>
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(lesson.completed || completedLessons.includes(lesson.id)) && (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                  {isLocked && (
                                    <Lock className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {lesson.duration}
                              </div>
                            </button>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Side - Video Player */}
          <div className="w-full lg:w-[70%] space-y-4">
            <Card className="p-6">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completedCount} of {totalLessons} lessons complete ({progressPercentage}%)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Keep going! 🚀
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-muted [&>div]:bg-primary"
                />
              </div>

              <h1 className="text-2xl font-bold mb-4">{currentLesson?.title || "Core Concepts"}</h1>
              
              {/* Quiz or Video Player */}
              {currentLesson?.isQuiz ? (
                <div className="mb-4">
                  <QuizPlayer
                    quizId={currentLesson.quizId || ""}
                    quizTitle={currentLesson.title}
                    passThreshold={70}
                    onComplete={(passed, score) => {
                      if (passed) {
                        handleMarkComplete();
                        toast.success(`Quiz passed with ${score}%! 🎉`);
                      } else {
                        toast.error(`Score: ${score}%. You need 70% to pass. Try again!`);
                      }
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Video Player */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                    <ReactPlayer
                      ref={playerRef}
                      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      playing={playing}
                      volume={volume}
                      muted={muted}
                      playbackRate={playbackRate}
                      onProgress={handleProgress}
                      onDuration={(dur: number) => setDuration(dur)}
                      width="100%"
                      height="100%"
                      {...({} as any)}
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Slider
                      value={[played * 100]}
                      max={100}
                      step={0.1}
                      onValueChange={(value) => setPlayed(value[0] / 100)}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{formatTime(played * duration)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPlaying(!playing)}
                      data-testid="button-play-pause"
                    >
                      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setMuted(!muted)}
                        data-testid="button-mute"
                      >
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={(value) => setVolume(value[0] / 100)}
                        className="w-24"
                      />
                    </div>

                    <Select value={playbackRate.toString()} onValueChange={(val) => setPlaybackRate(parseFloat(val))}>
                      <SelectTrigger className="w-24" data-testid="select-playback-rate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={captions} onValueChange={setCaptions}>
                      <SelectTrigger className="w-32" data-testid="select-captions">
                        <SelectValue placeholder="Captions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Español</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" data-testid="button-fullscreen">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {/* Completion and Next Lesson Buttons */}
              <div className="mt-4 flex gap-3">
                {!currentLessonComplete && !completedLessons.includes(currentLessonId) && (
                  <Button onClick={handleMarkComplete} variant="outline" className="flex-1">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
                {(currentLessonComplete || completedLessons.includes(currentLessonId)) && (
                  <>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Complete
                    </div>
                    <Button onClick={handleNextLesson} className="ml-auto">
                      Next Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Tabs Below Video */}
            <Card className="p-4 md:p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                {/* Desktop Tabs */}
                <TabsList className="hidden md:grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>
                
                {/* Mobile Dropdown */}
                <div className="md:hidden mb-4">
                  <Select value={selectedTab} onValueChange={setSelectedTab}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsContent value="overview" className="space-y-4">
                  <h3 className="text-lg font-semibold">Lesson Description</h3>
                  <p className="text-muted-foreground">
                    In this lesson, we'll dive deep into the core concepts that form the foundation 
                    of our subject matter. You'll learn about the fundamental principles, best practices, 
                    and real-world applications that will set you up for success in the following modules.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What you'll learn:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Understanding the fundamental principles</li>
                      <li>Applying concepts in practical scenarios</li>
                      <li>Building a strong foundation for advanced topics</li>
                      <li>Common pitfalls and how to avoid them</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <h3 className="text-lg font-semibold">Downloadable Resources</h3>
                  <p className="text-sm text-muted-foreground">Download these helpful resources to enhance your learning experience</p>
                  <div className="space-y-2">
                    {mockResources.map((resource) => (
                      <Card 
                        key={resource.id} 
                        className="p-4 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          toast.success("Download started!", {
                            description: `Downloading ${resource.name}...`
                          });
                        }}
                        data-testid={`resource-${resource.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                            <Download className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-muted-foreground">{resource.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" data-testid={`button-download-${resource.id}`}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    💡 Tip: These files are available for download anytime, even after completing the course
                  </p>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <h3 className="text-lg font-semibold">My Notes</h3>
                  <Textarea
                    placeholder="Take notes while you watch..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button onClick={handleSaveNote}>Save Note</Button>
                </TabsContent>

                <TabsContent value="discussion" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Discussion</h3>
                    <Dialog open={questionModalOpen} onOpenChange={setQuestionModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Ask a Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Ask a Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Question Title</label>
                            <Input
                              placeholder="What's your question about?"
                              value={newQuestionTitle}
                              onChange={(e) => setNewQuestionTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Question Details</label>
                            <Textarea
                              placeholder="Provide more context about your question..."
                              value={newQuestionContent}
                              onChange={(e) => setNewQuestionContent(e.target.value)}
                              className="min-h-[150px]"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setQuestionModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handlePostQuestion}>
                              Post Question
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {discussionPosts.map((post) => (
                      <Card key={post.id} className="p-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{post.author}</span>
                              <span className="text-sm text-muted-foreground">• {post.timeAgo}</span>
                            </div>
                            <h4 className="font-bold text-base mb-2">{post.title}</h4>
                            <p className="text-muted-foreground text-sm mb-3">
                              {expandedPosts.includes(post.id) || post.content.length < 150
                                ? post.content
                                : `${post.content.substring(0, 150)}...`}
                              {post.content.length > 150 && (
                                <button
                                  onClick={() => toggleExpandPost(post.id)}
                                  className="text-primary hover:underline ml-1"
                                >
                                  {expandedPosts.includes(post.id) ? "Show less" : "Read more"}
                                </button>
                              )}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <button
                                onClick={() => handleReplyClick(post.id)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <MessageSquare className="h-4 w-4" />
                                {post.replies} {post.replies === 1 ? "reply" : "replies"}
                              </button>
                              <button
                                onClick={() => handleLikePost(post.id)}
                                className={`flex items-center gap-1 text-sm transition-colors ${
                                  post.isLiked 
                                    ? "text-primary" 
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <ThumbsUp className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                                {post.likes} {post.likes === 1 ? "like" : "likes"}
                              </button>
                            </div>

                            {post.showReplies && (
                              <div className="mt-3 pl-4 border-l-2 border-border">
                                <div className="flex gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      <User className="h-4 w-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <Textarea
                                      placeholder="Write your reply..."
                                      value={post.replyText || ""}
                                      onChange={(e) => handleReplyTextChange(post.id, e.target.value)}
                                      className="min-h-[80px] mb-2"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleReplySubmit(post.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        Reply
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReplyClick(post.id)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar - Course Content (Desktop Only) */}
          <div className="hidden lg:block lg:w-[30%]">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <div className="space-y-2">
                {mockModules.map((module) => (
                  <Collapsible
                    key={module.id}
                    open={openModules.includes(module.id)}
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-2">
                        {openModules.includes(module.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          Module {module.id}: {module.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {module.lessons.map((lesson) => {
                        const isLocked = lesson.locked && !completedLessons.includes(lesson.id - 1);
                        const isCurrent = lesson.id === currentLessonId;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson.id, isLocked)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            } ${isLocked ? "opacity-60" : ""}`}
                            disabled={isLocked}
                            data-testid={`mobile-lesson-button-${lesson.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm font-medium">
                                  Lesson {lesson.id}:
                                </span>
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {(lesson.completed || completedLessons.includes(lesson.id)) && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                {isLocked && (
                                  <Lock className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {lesson.duration}
                            </div>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Next Lesson Button (Mobile) */}
      {nextLesson && (currentLessonComplete || completedLessons.includes(currentLessonId)) && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-20">
          <Button onClick={handleNextLesson} className="w-full" size="lg">
            Next: {nextLesson.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Celebration Modal */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-500" />
              </div>
              Congratulations! You completed the course! 🎓
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-base">
                You've successfully completed all {totalLessons} lessons!
              </p>
              <p className="text-muted-foreground">
                Your certificate is being generated...
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowCelebration(false)}>
              Close
            </Button>
            <Button onClick={handleViewCertificate}>
              <Award className="mr-2 h-4 w-4" />
              View Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
