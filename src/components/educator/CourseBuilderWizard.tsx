import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Loader2, 
  CheckCircle2,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  X,
  Plus,
  Clock
} from "lucide-react";
import { saveEducatorCourse, type EducatorCourse, type CourseModule, type CourseLesson } from "@/utils/educatorCoursesStorage";
import { generateDemoCourse } from "@/utils/demoCourseTemplate";
import { getAutoDemoOrchestrator } from "@/utils/autoDemoOrchestrator";
import { autoEnrollStudent } from "@/utils/autoDemoManager";

interface CourseBuilderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated?: () => void;
  editingCourse?: EducatorCourse | null;
  autoDemo?: boolean; // Auto-demo mode flag
}

const CATEGORIES = [
  "Funding & Grants",
  "Legal & Compliance",
  "Marketing & Branding",
  "Infrastructure",
  "Finance & Accounting",
  "AI & Technology",
  "Operations",
  "Sales",
  "Product Development",
  "HR & Talent",
];

const COURSE_TYPES = [
  {
    id: "microlearning",
    title: "Microlearning",
    description: "Short, focused lessons (5-15 minutes) perfect for busy learners",
    icon: Sparkles,
  },
  {
    id: "deep",
    title: "Deep Learning",
    description: "Comprehensive courses (45-60 minutes) for in-depth knowledge",
    icon: BookOpen,
  },
  {
    id: "product",
    title: "Digital Product",
    description: "Templates, guides, and resources for instant download",
    icon: FileText,
  },
];

const LEARNING_STYLES = [
  { id: "visual", label: "Visual" },
  { id: "auditory", label: "Auditory" },
  { id: "kinesthetic", label: "Kinesthetic" },
  { id: "reading", label: "Reading/Writing" },
  { id: "project-based", label: "Project-Based" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "it", name: "Italian" },
];

export function CourseBuilderWizard({ open, onOpenChange, onCourseCreated, editingCourse }: CourseBuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Step 1: Course Type
  const [courseType, setCourseType] = useState("microlearning");
  
  // Step 2: Course Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [learningStyles, setLearningStyles] = useState<string[]>([]);
  const [courseLanguage, setCourseLanguage] = useState("en");
  const [microlearningDuration, setMicrolearningDuration] = useState(5);
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState<string[]>(["", "", ""]);
  
  // Step 3: Pricing
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("99");
  
  // Step 4: Content Upload
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [thumbnailGenerated, setThumbnailGenerated] = useState(false);
  const [captionsGenerated, setCaptionsGenerated] = useState(false);
  const [modules, setModules] = useState<any[]>([{ name: "Module 1", lessons: [] }]);

  // Pre-populate form when editing or reset when creating new
  useEffect(() => {
    if (open) {
      if (editingCourse) {
        // Editing mode - populate all fields and preserve lesson metadata
        setTitle(editingCourse.title);
        setCategory(editingCourse.category);
        setLevel(editingCourse.level);
        setDescription(editingCourse.description);
        setIsPaid(editingCourse.pricing.type === "paid");
        setPrice(editingCourse.pricing.amount?.toString() || "99");
        setModules(editingCourse.modules.map((m) => ({
          id: m.id,
          name: m.title,
          description: m.description,
          lessons: m.lessons.map((lesson) => ({
            ...lesson,
            name: lesson.title,
          })) || []
        })));
        // Reset other fields that might not be in EducatorCourse
        setLearningStyles([]);
        setCourseLanguage("en");
        setMicrolearningDuration(5);
        setObjectives(["", "", ""]);
        setCourseType("microlearning");
      } else {
        // Create mode - reset everything
        resetForm();
      }
    }
  }, [editingCourse, open]);

  // Auto-demo mode: Listen for orchestrator events and auto-fill/advance
  // Cache demo data to maintain consistent IDs across steps
  const [cachedDemoData, setCachedDemoData] = useState<any>(null);

  useEffect(() => {
    if (!open) return;

    const handleAutoDemoStep = (event: CustomEvent) => {
      const { step } = event.detail;
      
      // Generate demo data once and cache it
      if (step === 'COURSE_STEP_1' && !cachedDemoData) {
        const demoData = generateDemoCourse();
        setCachedDemoData(demoData);
      }

      const demoData = cachedDemoData || generateDemoCourse();
      
      // Auto-fill form data when entering course builder steps
      if (step === 'COURSE_STEP_1') {
        setTitle(demoData.title);
        setCategory(demoData.category);
        setLevel(demoData.difficulty.toLowerCase());
        setDescription(demoData.description);
        setObjectives(demoData.learningObjectives);
        setCourseLanguage(demoData.language.toLowerCase());
        setCurrentStep(1);
        
        // Auto-advance after delay
        setTimeout(() => setCurrentStep(2), 1500);
      } else if (step === 'COURSE_STEP_2') {
        // Load curriculum from cached demo data
        const formattedModules = demoData.modules.map((module: any) => ({
          id: module.id,
          name: module.title,
          description: module.description,
          lessons: module.lessons.map((lesson: any) => ({
            id: lesson.id,
            name: lesson.title,
            type: lesson.type,
            duration: lesson.duration,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            resources: lesson.resources,
            quizQuestions: lesson.quizQuestions,
          })),
        }));
        setModules(formattedModules);
        setCurrentStep(2);
        
        // Auto-advance after delay
        setTimeout(() => setCurrentStep(3), 2000);
      } else if (step === 'COURSE_STEP_3') {
        setIsPaid(true);
        setPrice(demoData.pricing.amount.toString());
        setCurrentStep(3);
        
        // Auto-advance after delay
        setTimeout(() => setCurrentStep(4), 1500);
      } else if (step === 'COURSE_STEP_4') {
        setCurrentStep(4);
        
        // Auto-advance after delay
        setTimeout(() => setCurrentStep(5), 1500);
      } else if (step === 'COURSE_STEP_5') {
        setCurrentStep(5);
      } else if (step === 'PUBLISHING') {
        // Auto-submit the course
        setTimeout(() => {
          try {
            const course = buildCourseData(true);
            saveEducatorCourse(course);
            
            // Notify orchestrator of course ID
            const orchestrator = getAutoDemoOrchestrator();
            orchestrator.setCourseId(course.id);
            
            // Auto-enroll demo student
            await autoEnrollStudent(course.id);
            
            // Show success screen
            setCurrentStep(6);
            
            // Close wizard and clean up after demo completes
            setTimeout(() => {
              onOpenChange(false);
              onCourseCreated?.();
              setCachedDemoData(null);
            }, 3000);
          } catch (error) {
            console.error('Auto-demo course creation failed:', error);
          }
        }, 1000);
      }
    };

    // Listen for auto-demo events
    window.addEventListener('autoDemo:step', handleAutoDemoStep as EventListener);
    
    return () => {
      window.removeEventListener('autoDemo:step', handleAutoDemoStep as EventListener);
    };
  }, [open, onOpenChange, onCourseCreated, cachedDemoData]);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Get selected plan for fee calculation
  const selectedPlan = localStorage.getItem('selectedPlan') || 'free';
  const platformFeePercentage = selectedPlan === 'free' ? 50 : selectedPlan === 'pro' ? 20 : 10;
  const yourEarningsPercentage = 100 - platformFeePercentage;
  
  const priceNumber = parseFloat(price) || 0;
  const platformFee = (priceNumber * platformFeePercentage) / 100;
  const yourEarnings = priceNumber - platformFee;

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      duration: Math.floor(Math.random() * 30) + 5, // Random duration 5-35 min
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const generateThumbnails = async () => {
    setIsProcessing(true);
    // TODO: Replace with actual thumbnail generation API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setThumbnailGenerated(true);
    setIsProcessing(false);
    toast({
      title: "Thumbnails generated! 🎨",
      description: "AI-generated thumbnails are ready for your lessons.",
    });
  };

  const generateCaptions = async () => {
    setIsProcessing(true);
    // TODO: Replace with actual caption generation API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCaptionsGenerated(true);
    setIsProcessing(false);
    toast({
      title: "Captions generated! 📝",
      description: "Captions in EN and ES are ready.",
    });
  };

  const assignToModule = (fileId: number, moduleIndex: number) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      const newModules = [...modules];
      newModules[moduleIndex].lessons.push(file);
      setModules(newModules);
      setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    }
  };

  const addModule = () => {
    setModules([...modules, { name: `Module ${modules.length + 1}`, lessons: [] }]);
  };

  const toggleLearningStyle = (styleId: string) => {
    setLearningStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(s => s !== styleId)
        : [...prev, styleId]
    );
  };

  const buildCourseData = (published: boolean): EducatorCourse => {
    // Get educator profile from localStorage
    const educatorProfile = JSON.parse(localStorage.getItem("educatorProfile") || "{}");
    const educatorName = educatorProfile.name || "Dr. Sarah Chen";
    
    // Convert modules to proper structure, filtering out empty ones
    // Preserve existing IDs when editing, generate new IDs only for new content
    const courseModules: CourseModule[] = modules
      .filter((module) => module.lessons && module.lessons.length > 0)
      .map((module, index) => ({
        id: module.id || `module-${Date.now()}-${index}`,
        title: module.name,
        description: module.description || "",
        lessons: module.lessons.map((lesson: any, lessonIndex: number) => ({
          id: lesson.id || `lesson-${Date.now()}-${index}-${lessonIndex}`,
          title: lesson.name || lesson.title,
          type: (lesson.type as "video" | "quiz" | "reading") || "video",
          duration: lesson.duration || 10,
          videoUrl: lesson.videoUrl || "https://example.com/video.mp4",
          content: lesson.content,
          quiz: lesson.quiz,
          order: lessonIndex,
        })),
        order: index,
      }));

    // Calculate totals
    const totalLessons = courseModules.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalDuration = courseModules.reduce(
      (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + l.duration, 0),
      0
    );

    // Validation: ensure at least one module with lessons for published courses
    if (published && totalLessons === 0) {
      throw new Error("Cannot publish a course without any lessons. Please add lessons to your modules.");
    }

    return {
      id: editingCourse?.id || `course-${Date.now()}`,
      title,
      description,
      category,
      level: level as "beginner" | "intermediate" | "advanced",
      modules: courseModules,
      totalLessons,
      totalDuration,
      pricing: {
        type: isPaid ? "paid" : "free",
        amount: isPaid ? priceNumber : undefined,
      },
      published,
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      educatorId: editingCourse?.educatorId || "mock-educator",
      educatorName,
      enrollmentCount: editingCourse?.enrollmentCount || 0,
      revenue: editingCourse?.revenue || 0,
    };
  };

  const handleSaveDraft = () => {
    try {
      const course = buildCourseData(false);
      saveEducatorCourse(course);
      
      toast({
        title: "Draft saved! 💾",
        description: "Your course has been saved as a draft.",
      });
      
      onCourseCreated?.();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForReview = () => {
    try {
      const course = buildCourseData(true);
      saveEducatorCourse(course);
      
      // Show success screen
      setCurrentStep(6);
    } catch (error) {
      toast({
        title: "Error submitting course",
        description: "There was a problem submitting your course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCourseType("microlearning");
    setTitle("");
    setCategory("");
    setLevel("beginner");
    setLearningStyles([]);
    setCourseLanguage("en");
    setMicrolearningDuration(5);
    setDescription("");
    setObjectives(["", "", ""]);
    setIsPaid(false);
    setPrice("99");
    setUploadedFiles([]);
    setThumbnailGenerated(false);
    setCaptionsGenerated(false);
    setModules([{ name: "Module 1", lessons: [] }]);
  };

  const handleNext = () => {
    // Validation
    if (currentStep === 2) {
      if (!title.trim() || !category || !description.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Select Course Type</Label>
              <RadioGroup value={courseType} onValueChange={setCourseType}>
                <div className="grid gap-4">
                  {COURSE_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.id}
                        className={`flex items-start p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          courseType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={type.id} className="mt-1" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="font-semibold">{type.title}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Grant Writing Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-course-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level *</Label>
              <RadioGroup value={level} onValueChange={setLevel}>
                <div className="flex gap-4">
                  {["beginner", "intermediate", "advanced"].map((l) => (
                    <label key={l} className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value={l} data-testid={`radio-level-${l}`} />
                      <span className="capitalize">{l}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Microlearning Duration Slider */}
            {courseType === "microlearning" && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="microlearning-duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Microlearning Duration
                  </Label>
                  <Badge variant="outline">{microlearningDuration} min</Badge>
                </div>
                <Slider
                  id="microlearning-duration"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={[microlearningDuration]}
                  onValueChange={(value) => setMicrolearningDuration(value[0])}
                  data-testid="slider-microlearning-duration"
                />
                <p className="text-xs text-muted-foreground">
                  Set the target duration for each microlearning lesson (30 seconds to 10 minutes)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Learning Style Tags (Multi-select)</Label>
              <div className="flex flex-wrap gap-2">
                {LEARNING_STYLES.map((style) => (
                  <Badge
                    key={style.id}
                    variant={learningStyles.includes(style.id) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleLearningStyle(style.id)}
                    data-testid={`badge-learning-style-${style.id}`}
                  >
                    {learningStyles.includes(style.id) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {style.label}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select all learning styles that apply to this course
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-language">Course Language *</Label>
              <Select value={courseLanguage} onValueChange={setCourseLanguage}>
                <SelectTrigger data-testid="select-course-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                data-testid="textarea-description"
              />
            </div>

            <div className="space-y-2">
              <Label>Learning Objectives</Label>
              {objectives.map((obj, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Objective ${index + 1}`}
                    value={obj}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    data-testid={`input-objective-${index}`}
                  />
                  {objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeObjective(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="paid-toggle" className="text-base font-semibold">
                  Paid Course
                </Label>
                <p className="text-sm text-muted-foreground">Charge students for access</p>
              </div>
              <Switch
                id="paid-toggle"
                checked={isPaid}
                onCheckedChange={setIsPaid}
                data-testid="switch-paid"
              />
            </div>

            {isPaid && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    data-testid="input-price"
                  />
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                    <CardDescription>Based on your {localStorage.getItem('selectedPlan') || 'free'} plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Course Price</span>
                      <span className="font-semibold">${priceNumber.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Platform Fee ({platformFeePercentage}%)</span>
                      <span className="text-destructive">-${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-semibold">Your Earnings ({yourEarningsPercentage}%)</span>
                      <span className="text-2xl font-bold text-green-600">${yourEarnings.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <input
                type="file"
                id="file-upload"
                multiple
                accept="video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild data-testid="button-upload-files">
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video Files
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Supports MP4, MOV, AVI (max 500MB per file)
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files ({uploadedFiles.length})</Label>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{file.duration} min • {file.size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={generateThumbnails}
                disabled={isProcessing || uploadedFiles.length === 0}
                data-testid="button-generate-thumbnails"
                className="flex-1"
              >
                {isProcessing && !thumbnailGenerated ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : thumbnailGenerated ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Thumbnails
              </Button>
              <Button
                variant="outline"
                onClick={generateCaptions}
                disabled={isProcessing || uploadedFiles.length === 0}
                data-testid="button-generate-captions"
                className="flex-1"
              >
                {isProcessing && thumbnailGenerated && !captionsGenerated ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : captionsGenerated ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Generate Captions (EN/ES)
              </Button>
            </div>

            {modules.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Organize into Modules</Label>
                  <Button variant="outline" size="sm" onClick={addModule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Module
                  </Button>
                </div>
                {modules.map((module, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons assigned
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{title || "Untitled Course"}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge>{category || "Uncategorized"}</Badge>
                      <Badge variant="outline" className="capitalize">{level}</Badge>
                      {isPaid && <Badge variant="secondary">${priceNumber}</Badge>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Description</div>
                  <p className="text-sm text-muted-foreground">{description || "No description"}</p>
                </div>
                {objectives.filter(o => o.trim()).length > 0 && (
                  <div>
                    <div className="font-medium mb-2">Learning Objectives</div>
                    <ul className="list-disc list-inside space-y-1">
                      {objectives.filter(o => o.trim()).map((obj, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <div className="font-medium mb-2">Content</div>
                  <p className="text-sm text-muted-foreground">
                    {modules.length} modules • {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSaveDraft}
                data-testid="button-save-draft"
              >
                Save Draft
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitForReview}
                data-testid="button-submit-review"
              >
                Submit for Review
              </Button>
            </div>
          </div>
        );

      case 6:
        // Success screen
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Submitted for Review!</h3>
            <p className="text-muted-foreground mb-6">
              Your course "{title}" has been submitted for review.<br />
              We'll notify you within 24-48 hours.
            </p>
            <Button
              onClick={() => {
                onCourseCreated?.();
                onOpenChange(false);
                resetForm();
              }}
              data-testid="button-view-dashboard"
            >
              View Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {currentStep <= totalSteps && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Create New Course</span>
                <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
              </DialogTitle>
            </DialogHeader>

            <Progress value={progressPercentage} className="h-2" />

            <div className="py-6">{renderStep()}</div>

            {currentStep < 6 && (
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  data-testid="button-back"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === totalSteps}
                  data-testid="button-next"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
