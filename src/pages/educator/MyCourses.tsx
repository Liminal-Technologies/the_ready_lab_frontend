import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CourseBuilder } from '@/components/educator/CourseBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  price: number;
  is_active: boolean;
  created_at: string;
  thumbnail_url?: string;
}

export default function MyCourses() {
  const { auth } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Track | null>(null);

  // Check if we're on the /my-courses/create path
  const isCreatePath = location.pathname === '/my-courses/create';

  useEffect(() => {
    if (auth.user?.id) {
      loadCourses();
    }
  }, [auth.user?.id]);

  // Auto-show CourseBuilder when on /my-courses/create
  useEffect(() => {
    if (isCreatePath && !isCreating && !editingCourseId) {
      setIsCreating(true);
    }
  }, [isCreatePath]);

  const loadCourses = async () => {
    if (!auth.user?.id) return;

    setLoading(true);
    try {
      const response = await api.tracks.list({ created_by: auth.user.id });
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (course: Track) => {
    try {
      await api.tracks.update(course.id, { is_active: !course.is_active });
      setCourses(prev =>
        prev.map(c =>
          c.id === course.id ? { ...c, is_active: !c.is_active } : c
        )
      );
      toast({
        title: course.is_active ? 'Unpublished' : 'Published',
        description: course.is_active
          ? 'Course is now a draft.'
          : 'Course is now live!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update publish status.',
        variant: 'destructive',
      });
    }
  };

  const deleteCourse = async () => {
    if (!deleteTarget) return;

    try {
      await api.tracks.delete(deleteTarget.id);
      setCourses(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast({ title: 'Deleted', description: 'Course deleted successfully.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course.',
        variant: 'destructive',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = () => {
    setEditingCourseId(null);
    setIsCreating(false);
    loadCourses();
    // Navigate back to list if on create path
    if (isCreatePath) {
      navigate('/my-courses');
    }
  };

  const handleCancel = () => {
    setEditingCourseId(null);
    setIsCreating(false);
    // Navigate back to list if on create path
    if (isCreatePath) {
      navigate('/my-courses');
    }
  };

  // Show course builder if creating or editing
  if (isCreating || editingCourseId) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Courses
        </Button>
        <CourseBuilder
          trackId={editingCourseId || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Course list view
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            Create and manage your courses
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first course to start teaching.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {course.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={course.is_active ? 'default' : 'secondary'}>
                          {course.is_active ? 'Published' : 'Draft'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingCourseId(course.id)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublish(course)}>
                              {course.is_active ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(course)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="capitalize">{course.category}</span>
                      <span className="capitalize">{course.level}</span>
                      <span>{course.price > 0 ? `$${course.price}` : 'Free'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.title}" and all its
              modules and lessons. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
