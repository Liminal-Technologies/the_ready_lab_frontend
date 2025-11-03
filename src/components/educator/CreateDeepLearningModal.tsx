import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen, Plus, X, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoUploadRecorder } from './VideoUploadRecorder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CreateDeepLearningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const roadmapTags = [
  'Nonprofit Management',
  'Fundraising',
  'Grant Writing',
  'Program Development',
  'Marketing & Branding',
  'Finance & Accounting',
  'Leadership',
  'Volunteer Management',
];

const categories = [
  'Business',
  'Technology',
  'Design',
  'Marketing',
  'Leadership',
  'Nonprofit',
  'Finance',
  'Other',
];

interface Lesson {
  title: string;
  description: string;
  video_url: string;
  video_duration_seconds: number;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export const CreateDeepLearningModal = ({ open, onOpenChange, onSuccess }: CreateDeepLearningModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    roadmap_tags: [] as string[],
    estimated_hours: 1,
    price: 0,
    thumbnail_url: '',
  });
  const [modules, setModules] = useState<Module[]>([{ title: '', description: '', lessons: [] }]);
  const [currentStep, setCurrentStep] = useState<'course-info' | 'modules' | 'lessons'>('course-info');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const [educatorId, setEducatorId] = useState<string>('');

  useState(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEducatorId(user.id);
    };
    fetchUser();
  });

  const addModule = () => {
    setModules([...modules, { title: '', description: '', lessons: [] }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: keyof Omit<Module, 'lessons'>, value: string) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const addLessonToModule = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({
      title: '',
      description: '',
      video_url: '',
      video_duration_seconds: 0,
    });
    setModules(updated);
  };

  const removeLessonFromModule = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(updated);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    const updated = [...modules];
    (updated[moduleIndex].lessons[lessonIndex] as any)[field] = value;
    setModules(updated);
  };

  const handleVideoUploaded = (moduleIndex: number, lessonIndex: number, videoUrl: string, duration: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].video_url = videoUrl;
    updated[moduleIndex].lessons[lessonIndex].video_duration_seconds = duration;
    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate modules
    const validModules = modules.filter(m => m.title.trim() !== '');
    if (validModules.length === 0) {
      toast({
        title: "Modules required",
        description: "Please add at least one module.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create track
      const { data: track, error: trackError } = await supabase
        .from('tracks')
        .insert({
          ...formData,
          created_by: user.id,
          is_active: false, // Draft by default
        })
        .select()
        .single();

      if (trackError) throw trackError;

      // Create modules and lessons
      for (let i = 0; i < validModules.length; i++) {
        const module = validModules[i];
        
        const { data: createdModule, error: moduleError } = await supabase
          .from('modules')
          .insert({
            track_id: track.id,
            title: module.title,
            description: module.description,
            order_index: i,
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Create lessons for this module
        if (module.lessons.length > 0) {
          const lessonInserts = module.lessons.map((lesson, lessonIndex) => ({
            module_id: createdModule.id,
            title: lesson.title,
            description: lesson.description,
            content_type: 'video',
            content_url: lesson.video_url,
            video_duration_seconds: lesson.video_duration_seconds,
            duration_minutes: Math.ceil(lesson.video_duration_seconds / 60),
            order_index: lessonIndex,
            lesson_type: 'regular',
            is_standalone: false,
          }));

          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonInserts);

          if (lessonsError) throw lessonsError;
        }
      }

      toast({
        title: "Success",
        description: "Deep learning course created successfully with all modules and lessons!",
      });
      
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        roadmap_tags: [],
        estimated_hours: 1,
        price: 0,
        thumbnail_url: '',
      });
      setModules([{ title: '', description: '', lessons: [] }]);
      setCurrentStep('course-info');
      setSelectedModuleIndex(null);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create Deep Learning Course
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive multi-module course with structured learning paths.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course-info">Course Info</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons">Add Lessons</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <TabsContent value="course-info" className="space-y-4">
              <h3 className="text-lg font-semibold">Course Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Fundraising Masterclass"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the course..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Roadmap Tags (select multiple)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roadmapTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roadmap_tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, roadmap_tags: [...formData.roadmap_tags, tag] });
                          } else {
                            setFormData({
                              ...formData,
                              roadmap_tags: formData.roadmap_tags.filter((t) => t !== tag),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Estimated Hours *</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setCurrentStep('modules')}>
                  Next: Add Modules
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Course Modules</h3>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Module {index + 1}</CardTitle>
                        {modules.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeModule(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Module Title *</Label>
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(index, 'title', e.target.value)}
                          placeholder="e.g., Introduction to Fundraising"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={module.description}
                          onChange={(e) => updateModule(index, 'description', e.target.value)}
                          placeholder="What will students learn in this module?"
                          rows={2}
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedModuleIndex(index);
                            setCurrentStep('lessons');
                          }}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Add Lessons ({module.lessons.length})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setCurrentStep('course-info')}>
                  Back
                </Button>
                <Button type="button" onClick={() => setCurrentStep('lessons')}>
                  Next: Add Lessons
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-4">
              {selectedModuleIndex !== null ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Add Lessons to Module {selectedModuleIndex + 1}: {modules[selectedModuleIndex].title}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLessonToModule(selectedModuleIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {modules[selectedModuleIndex].lessons.map((lesson, lessonIndex) => (
                      <Card key={lessonIndex}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Lesson {lessonIndex + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLessonFromModule(selectedModuleIndex, lessonIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Lesson Title *</Label>
                            <Input
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(selectedModuleIndex, lessonIndex, 'title', e.target.value)
                              }
                              placeholder="e.g., Understanding Donor Psychology"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={lesson.description}
                              onChange={(e) =>
                                updateLesson(selectedModuleIndex, lessonIndex, 'description', e.target.value)
                              }
                              placeholder="Brief description of the lesson"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Video Content *</Label>
                            {lesson.video_url ? (
                              <div className="space-y-2">
                                <video src={lesson.video_url} controls className="w-full rounded-lg" />
                                <p className="text-sm text-muted-foreground">
                                  Duration: {Math.floor(lesson.video_duration_seconds / 60)}:
                                  {String(lesson.video_duration_seconds % 60).padStart(2, '0')}
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    updateLesson(selectedModuleIndex, lessonIndex, 'video_url', '');
                                    updateLesson(selectedModuleIndex, lessonIndex, 'video_duration_seconds', 0);
                                  }}
                                >
                                  Change Video
                                </Button>
                              </div>
                            ) : (
                              <VideoUploadRecorder
                                onVideoUploaded={(url, duration) =>
                                  handleVideoUploaded(selectedModuleIndex, lessonIndex, url, duration)
                                }
                                educatorId={educatorId}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedModuleIndex(null);
                        setCurrentStep('modules');
                      }}
                    >
                      Back to Modules
                    </Button>
                    <div className="flex gap-2">
                      {selectedModuleIndex < modules.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedModuleIndex(selectedModuleIndex + 1)}
                        >
                          Next Module
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Select a module from the previous step to add lessons, or create your course now.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep('modules')}>
                      Back to Modules
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Course'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {currentStep === 'lessons' && selectedModuleIndex !== null && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </div>
            )}
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
