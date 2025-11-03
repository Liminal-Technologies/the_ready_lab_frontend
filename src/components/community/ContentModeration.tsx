import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Eye } from 'lucide-react';

interface Report {
  id: string;
  post_id: string | null;
  comment_id: string | null;
  reporter_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
}

interface ContentModerationProps {
  communityId: string;
}

export const ContentModeration = ({ communityId }: ContentModerationProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportsAndContent();
  }, [communityId]);

  const fetchReportsAndContent = async () => {
    try {
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('post_reports')
        .select('*')
        .or(`post_id.in.(select id from posts where community_id=${communityId}),comment_id.in.(select id from post_comments where post_id in (select id from posts where community_id=${communityId}))`)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Fetch all posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setReports(reportsData || []);
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      toast({
        title: "Error",
        description: "Failed to load moderation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "The post has been removed",
      });
      fetchReportsAndContent();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_reports')
        .update({
          status: 'resolved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report resolved",
        description: "The report has been marked as resolved",
      });
      fetchReportsAndContent();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: "Error",
        description: "Failed to resolve report",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-8 text-muted-foreground">Loading...</p>;
  }

  return (
    <Tabs defaultValue="reports">
      <TabsList>
        <TabsTrigger value="reports">Reports ({reports.filter(r => r.status === 'pending').length})</TabsTrigger>
        <TabsTrigger value="posts">All Posts ({posts.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="reports">
        {reports.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No reports</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="secondary">
                      {report.post_id ? 'Post' : 'Comment'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{report.reason}</p>
                    {report.details && (
                      <p className="text-sm text-muted-foreground">{report.details}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'pending' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveReport(report.id)}
                          >
                            Resolve
                          </Button>
                          {report.post_id && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePost(report.post_id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      <TabsContent value="posts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <p className="font-medium">{post.title || 'Untitled'}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.content}
                  </p>
                </TableCell>
                <TableCell>
                  {post.profiles?.full_name || post.profiles?.email || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{post.post_type}</Badge>
                </TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};
