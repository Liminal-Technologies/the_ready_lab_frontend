import { useState } from "react";
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
  Plus
} from "lucide-react";

interface CourseBuilderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated?: () => void;
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

export function CourseBuilderWizard({ open, onOpenChange, onCourseCreated }: CourseBuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Step 1: Course Type
  const [courseType, setCourseType] = useState("microlearning");
  
  // Step 2: Course Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
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

  const handleSaveDraft = () => {
    const draft = {
      courseType,
      title,
      category,
      level,
      description,
      objectives: objectives.filter(o => o.trim()),
      pricing: { isPaid, price: isPaid ? priceNumber : 0 },
      modules,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem('createdCourses') || '[]');
    existing.push(draft);
    localStorage.setItem('createdCourses', JSON.stringify(existing));
    
    toast({
      title: "Draft saved! 💾",
      description: "Your course has been saved as a draft.",
    });
    
    onCourseCreated?.();
    onOpenChange(false);
    resetForm();
  };

  const handleSubmitForReview = () => {
    const course = {
      courseType,
      title,
      category,
      level,
      description,
      objectives: objectives.filter(o => o.trim()),
      pricing: { isPaid, price: isPaid ? priceNumber : 0 },
      modules,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem('createdCourses') || '[]');
    existing.push(course);
    localStorage.setItem('createdCourses', JSON.stringify(existing));
    
    // Show success screen
    setCurrentStep(6); // Success screen
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCourseType("microlearning");
    setTitle("");
    setCategory("");
    setLevel("beginner");
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
              <Label>Level *</Label>
              <RadioGroup value={level} onValueChange={setLevel}>
                <div className="flex gap-4">
                  {["beginner", "intermediate", "advanced"].map((l) => (
                    <label key={l} className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value={l} />
                      <span className="capitalize">{l}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
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
