import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MuxVideoUploader } from './MuxVideoUploader';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Headphones,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Settings2,
  X,
} from 'lucide-react';

// Types
interface Lesson {
  id: string;
  title: string;
  description?: string;
  lessonType: 'video' | 'reading' | 'quiz' | 'audio';
  orderIndex: number;
  duration?: number;
  isFreePreview?: boolean;
  isNew?: boolean; // For optimistic UI
  videoAssetId?: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  videoDurationSeconds?: number;
  contentMarkdown?: string;
  contentData?: Record<string, any>;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons: Lesson[];
  isNew?: boolean; // For optimistic UI
  isExpanded?: boolean;
}

interface Track {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  price: number;
  is_active: boolean;
  modules: Module[];
}

interface CourseBuilderProps {
  trackId?: string; // If provided, edit existing track
  onSave?: (track: Track) => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  { value: 'business', label: 'Business & Leadership' },
  { value: 'technology', label: 'Technology' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'education', label: 'Education' },
  { value: 'creative', label: 'Creative Arts' },
  { value: 'other', label: 'Other' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const LESSON_TYPES = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'reading', label: 'Reading', icon: FileText },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'audio', label: 'Audio', icon: Headphones },
];

export function CourseBuilder({ trackId, onSave, onCancel }: CourseBuilderProps) {
  const { auth } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'module' | 'lesson'; id: string; moduleId?: string } | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; moduleId: string } | null>(null);

  const [track, setTrack] = useState<Track>({
    id: '',
    title: '',
    description: '',
    category: 'business',
    level: 'beginner',
    price: 0,
    is_active: false,
    modules: [],
  });

  // Load existing track if editing
  useEffect(() => {
    if (trackId) {
      loadTrack(trackId);
    }
  }, [trackId]);

  const loadTrack = async (id: string) => {
    setLoading(true);
    try {
      const trackData = await api.tracks.get(id);
      const modulesData = await api.tracks.getModules(id);

      // Load lessons for each module
      const modulesWithLessons = await Promise.all(
        (modulesData.data || []).map(async (mod: any) => {
          const lessonsData = await api.modules.getLessons(mod.id);
          return {
            id: mod.id,
            title: mod.title,
            description: mod.description,
            orderIndex: mod.order_index,
            isExpanded: false,
            lessons: (lessonsData.data || []).map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              lessonType: lesson.lesson_type || lesson.lessonType,
              orderIndex: lesson.order_index || lesson.orderIndex,
              duration: lesson.duration,
              isFreePreview: lesson.is_free_preview || lesson.isFreePreview,
              videoAssetId: lesson.video_asset_id || lesson.videoAssetId,
              posterUrl: lesson.poster_url || lesson.posterUrl,
              thumbnailUrl: lesson.thumbnail_url || lesson.thumbnailUrl,
              videoDurationSeconds: lesson.video_duration_seconds || lesson.videoDurationSeconds,
              contentMarkdown: lesson.content_markdown || lesson.contentMarkdown,
              contentData: lesson.content_data || lesson.contentData,
            })),
          };
        })
      );

      setTrack({
        id: trackData.id,
        title: trackData.title,
        description: trackData.description || '',
        category: trackData.category,
        level: trackData.level,
        price: trackData.price || 0,
        is_active: trackData.is_active,
        modules: modulesWithLessons,
      });
    } catch (error) {
      console.error('Error loading track:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save track (create or update)
  const saveTrack = async () => {
    if (!auth.user?.id) return;
    if (!track.title.trim()) {
      toast({ title: 'Error', description: 'Course title is required.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      let savedTrack;

      if (track.id) {
        // Update existing track
        savedTrack = await api.tracks.update(track.id, {
          title: track.title,
          description: track.description,
          category: track.category,
          level: track.level,
          price: track.price,
          is_active: track.is_active,
        });
      } else {
        // Create new track
        savedTrack = await api.tracks.create({
          title: track.title,
          description: track.description,
          category: track.category,
          level: track.level,
          price: track.price,
          is_active: false,
          created_by: auth.user.id,
        });
        setTrack(prev => ({ ...prev, id: savedTrack.id }));
      }

      // Save modules and lessons
      for (const module of track.modules) {
        let savedModule;

        if (module.isNew) {
          // Create new module
          savedModule = await api.modules.create({
            track_id: savedTrack.id,
            title: module.title,
            description: module.description,
            order_index: module.orderIndex,
          });

          // Update local state with real ID
          setTrack(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
              m.id === module.id ? { ...m, id: savedModule.id, isNew: false } : m
            ),
          }));
        } else {
          // Update existing module
          savedModule = await api.modules.update(module.id, {
            title: module.title,
            description: module.description,
            order_index: module.orderIndex,
          });
        }

        // Save lessons for this module
        for (const lesson of module.lessons) {
          if (lesson.isNew) {
            const savedLesson = await api.lessons.create({
              moduleId: savedModule.id,
              title: lesson.title,
              description: lesson.description,
              lessonType: lesson.lessonType,
              orderIndex: lesson.orderIndex,
              duration: lesson.duration,
              isFreePreview: lesson.isFreePreview,
              posterUrl: lesson.posterUrl,
              thumbnailUrl: lesson.thumbnailUrl,
              videoDurationSeconds: lesson.videoDurationSeconds,
              contentMarkdown: lesson.contentMarkdown,
              contentData: lesson.contentData,
            });

            // Update local state with real ID
            setTrack(prev => ({
              ...prev,
              modules: prev.modules.map(m =>
                m.id === savedModule.id ? {
                  ...m,
                  lessons: m.lessons.map(l =>
                    l.id === lesson.id ? { ...l, id: savedLesson.id, isNew: false } : l
                  ),
                } : m
              ),
            }));
          } else {
            await api.lessons.update(lesson.id, {
              title: lesson.title,
              description: lesson.description,
              orderIndex: lesson.orderIndex,
              duration: lesson.duration,
              isFreePreview: lesson.isFreePreview,
            });
          }
        }
      }

      toast({ title: 'Saved', description: 'Course saved successfully.' });
      onSave?.(track);
    } catch (error) {
      console.error('Error saving track:', error);
      toast({
        title: 'Error',
        description: 'Failed to save course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Add new module
  const addModule = () => {
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: 'New Module',
      description: '',
      orderIndex: track.modules.length,
      lessons: [],
      isNew: true,
      isExpanded: true,
    };
    setTrack(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  // Add new lesson to module
  const addLesson = (moduleId: string) => {
    const module = track.modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: 'New Lesson',
      lessonType: 'video',
      orderIndex: module.lessons.length,
      isNew: true,
    };

    setTrack(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      ),
    }));
  };

  // Update module
  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setTrack(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? { ...m, ...updates } : m
      ),
    }));
  };

  // Update lesson
  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setTrack(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map(l =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : m
      ),
    }));
  };

  // Delete module
  const deleteModule = async (moduleId: string) => {
    const module = track.modules.find(m => m.id === moduleId);
    if (!module) return;

    // If not a new module, delete from API
    if (!module.isNew) {
      try {
        await api.modules.delete(moduleId);
      } catch (error) {
        console.error('Error deleting module:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete module.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Remove from local state
    setTrack(prev => ({
      ...prev,
      modules: prev.modules
        .filter(m => m.id !== moduleId)
        .map((m, idx) => ({ ...m, orderIndex: idx })),
    }));
    setDeleteTarget(null);
  };

  // Delete lesson
  const deleteLesson = async (moduleId: string, lessonId: string) => {
    const module = track.modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    if (!module || !lesson) return;

    // If not a new lesson, delete from API
    if (!lesson.isNew) {
      try {
        await api.lessons.delete(lessonId);
      } catch (error) {
        console.error('Error deleting lesson:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete lesson.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Remove from local state
    setTrack(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons
                .filter(l => l.id !== lessonId)
                .map((l, idx) => ({ ...l, orderIndex: idx })),
            }
          : m
      ),
    }));
    setDeleteTarget(null);
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    updateModule(moduleId, {
      isExpanded: !track.modules.find(m => m.id === moduleId)?.isExpanded,
    });
  };

  // Handle video upload for a lesson (Mux)
  const handleVideoUploaded = (data: {
    videoId: string;
    playbackId?: string;
    duration?: number;
    status: string;
  }) => {
    if (!selectedLesson) return;

    updateLesson(selectedLesson.moduleId, selectedLesson.lesson.id, {
      videoAssetId: data.videoId,
      videoDurationSeconds: data.duration,
    });

    // Update the selectedLesson state to reflect changes
    setSelectedLesson(prev => prev ? {
      ...prev,
      lesson: {
        ...prev.lesson,
        videoAssetId: data.videoId,
        videoDurationSeconds: data.duration,
      },
    } : null);

    toast({
      title: 'Video uploaded',
      description: 'Video has been uploaded and is being processed.',
    });
  };

  // Open lesson details panel
  const openLessonDetails = (lesson: Lesson, moduleId: string) => {
    setSelectedLesson({ lesson, moduleId });
  };

  // Close lesson details panel
  const closeLessonDetails = () => {
    setSelectedLesson(null);
  };

  // Update selected lesson field
  const updateSelectedLessonField = <K extends keyof Lesson>(field: K, value: Lesson[K]) => {
    if (!selectedLesson) return;

    updateLesson(selectedLesson.moduleId, selectedLesson.lesson.id, { [field]: value });

    setSelectedLesson(prev => prev ? {
      ...prev,
      lesson: { ...prev.lesson, [field]: value },
    } : null);
  };

  // Toggle publish status
  const togglePublish = async () => {
    if (!track.id) {
      toast({
        title: 'Save First',
        description: 'Please save your course before publishing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.tracks.update(track.id, { is_active: !track.is_active });
      setTrack(prev => ({ ...prev, is_active: !prev.is_active }));
      toast({
        title: track.is_active ? 'Unpublished' : 'Published',
        description: track.is_active ? 'Course is now a draft.' : 'Course is now live!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update publish status.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{track.id ? 'Edit Course' : 'New Course'}</span>
            <div className="flex items-center gap-2">
              {track.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePublish}
                >
                  {track.is_active ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
              )}
              <Button onClick={saveTrack} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
              {onCancel && (
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Course Title</label>
              <Input
                value={track.title}
                onChange={(e) => setTrack(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter course title..."
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={track.description}
                onChange={(e) => setTrack(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What will students learn?"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={track.category}
                onValueChange={(value) => setTrack(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Level</label>
              <Select
                value={track.level}
                onValueChange={(value) => setTrack(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Price ($)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={track.price}
                onChange={(e) => setTrack(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules & Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Curriculum</span>
            <Button variant="outline" size="sm" onClick={addModule}>
              <Plus className="h-4 w-4 mr-1" />
              Add Module
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {track.modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No modules yet. Click "Add Module" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {track.modules.map((module, moduleIdx) => (
                <Collapsible
                  key={module.id}
                  open={module.isExpanded}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2 p-3 hover:bg-muted/50 cursor-pointer">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {module.isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          Module {moduleIdx + 1}
                        </span>
                        <Input
                          value={module.title}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateModule(module.id, { title: e.target.value });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 h-8"
                          placeholder="Module title..."
                        />
                        <span className="text-xs text-muted-foreground">
                          {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget({ type: 'module', id: module.id });
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t p-3 bg-muted/20 space-y-2">
                        <Textarea
                          value={module.description || ''}
                          onChange={(e) => updateModule(module.id, { description: e.target.value })}
                          placeholder="Module description (optional)..."
                          rows={2}
                          className="text-sm"
                        />

                        {/* Lessons */}
                        <div className="space-y-2 mt-3">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const LessonIcon = LESSON_TYPES.find(t => t.value === lesson.lessonType)?.icon || Video;
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-2 p-2 bg-background rounded border"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <LessonIcon className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                  className="flex-1 h-8"
                                  placeholder="Lesson title..."
                                />
                                <Select
                                  value={lesson.lessonType}
                                  onValueChange={(value) => updateLesson(module.id, lesson.id, { lessonType: value as Lesson['lessonType'] })}
                                >
                                  <SelectTrigger className="w-28 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {LESSON_TYPES.map(type => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openLessonDetails(lesson, module.id)}
                                  title="Edit lesson details"
                                >
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteTarget({ type: 'lesson', id: lesson.id, moduleId: module.id })}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => addLesson(module.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Lesson
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{' '}
              {deleteTarget?.type}
              {deleteTarget?.type === 'module' && ' and all its lessons'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget?.type === 'module') {
                  deleteModule(deleteTarget.id);
                } else if (deleteTarget?.type === 'lesson' && deleteTarget.moduleId) {
                  deleteLesson(deleteTarget.moduleId, deleteTarget.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lesson Details Slide-in Panel */}
      <Sheet open={!!selectedLesson} onOpenChange={(open) => !open && closeLessonDetails()}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedLesson && (
                <>
                  {(() => {
                    const LessonIcon = LESSON_TYPES.find(t => t.value === selectedLesson.lesson.lessonType)?.icon || Video;
                    return <LessonIcon className="h-5 w-5" />;
                  })()}
                  Lesson Details
                </>
              )}
            </SheetTitle>
            <SheetDescription>
              Configure lesson content, video, and settings
            </SheetDescription>
          </SheetHeader>

          {selectedLesson && (
            <div className="mt-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Title</Label>
                <Input
                  id="lesson-title"
                  value={selectedLesson.lesson.title}
                  onChange={(e) => updateSelectedLessonField('title', e.target.value)}
                  placeholder="Lesson title..."
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="lesson-description">Description</Label>
                <Textarea
                  id="lesson-description"
                  value={selectedLesson.lesson.description || ''}
                  onChange={(e) => updateSelectedLessonField('description', e.target.value)}
                  placeholder="What will students learn in this lesson?"
                  rows={3}
                />
              </div>

              {/* Lesson Type */}
              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={selectedLesson.lesson.lessonType}
                  onValueChange={(value) => updateSelectedLessonField('lessonType', value as Lesson['lessonType'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Video Upload - only show for video lessons */}
              {selectedLesson.lesson.lessonType === 'video' && (
                <div className="space-y-2">
                  <Label>Video Content</Label>
                  {selectedLesson.lesson.videoAssetId ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">Video uploaded</p>
                          <p className="text-xs opacity-50">ID: {selectedLesson.lesson.videoAssetId}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Duration: {selectedLesson.lesson.videoDurationSeconds
                            ? `${Math.floor(selectedLesson.lesson.videoDurationSeconds / 60)}:${String(selectedLesson.lesson.videoDurationSeconds % 60).padStart(2, '0')}`
                            : 'Processing...'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateSelectedLessonField('videoAssetId', undefined);
                            updateSelectedLessonField('videoDurationSeconds', undefined);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <MuxVideoUploader
                      educatorId={auth.user?.id || ''}
                      lessonTitle={selectedLesson.lesson.title}
                      onVideoUploaded={handleVideoUploaded}
                    />
                  )}
                </div>
              )}

              {/* Reading Content - only show for reading lessons */}
              {selectedLesson.lesson.lessonType === 'reading' && (
                <div className="space-y-2">
                  <Label htmlFor="lesson-content">Content (Markdown)</Label>
                  <Textarea
                    id="lesson-content"
                    value={selectedLesson.lesson.contentMarkdown || ''}
                    onChange={(e) => updateSelectedLessonField('contentMarkdown', e.target.value)}
                    placeholder="Write your lesson content in Markdown..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {/* Duration (manual entry for non-video) */}
              {selectedLesson.lesson.lessonType !== 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                  <Input
                    id="lesson-duration"
                    type="number"
                    min="1"
                    value={selectedLesson.lesson.duration || ''}
                    onChange={(e) => updateSelectedLessonField('duration', parseInt(e.target.value) || undefined)}
                    placeholder="Estimated duration..."
                  />
                </div>
              )}

              {/* Free Preview Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="free-preview">Free Preview</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow non-enrolled students to preview this lesson
                  </p>
                </div>
                <Switch
                  id="free-preview"
                  checked={selectedLesson.lesson.isFreePreview || false}
                  onCheckedChange={(checked) => updateSelectedLessonField('isFreePreview', checked)}
                />
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t">
                <Button onClick={closeLessonDetails} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
