import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyContent } from '@/components/empty-states/EmptyContent';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, Eye, Video } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  metrics?: {
    enrollments?: number;
    downloads?: number;
    attendees?: number;
    members?: number;
  };
}

export const MyContentTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<ContentItem[]>([]);
  const [microlearning, setMicrolearning] = useState<ContentItem[]>([]);
  const [products, setProducts] = useState<ContentItem[]>([]);
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [communities, setCommunities] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchContent();
  }, []); // This will run on mount and when key changes

  const fetchContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch courses
      const { data: coursesData } = await supabase
        .from('tracks')
        .select('id, title, created_at, is_active')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (coursesData) {
        setCourses(
          coursesData.map((c) => ({
            id: c.id,
            title: c.title,
            type: 'Deep Learning Course',
            status: c.is_active ? 'published' : 'draft',
            created_at: c.created_at,
          }))
        );
      }

      // Fetch microlearning lessons
      const { data: microlearningData } = await supabase
        .from('lessons')
        .select('id, title, created_at, lesson_type, is_standalone')
        .eq('is_standalone', true)
        .eq('lesson_type', 'microlearning')
        .order('created_at', { ascending: false });

      if (microlearningData) {
        setMicrolearning(
          microlearningData.map((l) => ({
            id: l.id,
            title: l.title,
            type: 'Microlearning',
            status: 'published',
            created_at: l.created_at,
          }))
        );
      }

      // Fetch digital products
      const { data: productsData } = await supabase
        .from('digital_products')
        .select('id, title, created_at, status, downloads_count')
        .eq('educator_id', user.id)
        .order('created_at', { ascending: false });

      if (productsData) {
        setProducts(
          productsData.map((p) => ({
            id: p.id,
            title: p.title,
            type: 'Digital Product',
            status: p.status,
            created_at: p.created_at,
            metrics: { downloads: p.downloads_count },
          }))
        );
      }

      // Fetch live events
      const { data: eventsData } = await supabase
        .from('live_events')
        .select('id, title, created_at, status, attendee_count')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (eventsData) {
        setEvents(
          eventsData.map((e) => ({
            id: e.id,
            title: e.title,
            type: 'Live Streaming',
            status: e.status,
            created_at: e.created_at,
            metrics: { attendees: e.attendee_count },
          }))
        );
      }

      // Fetch communities
      const { data: communitiesData } = await supabase
        .from('communities')
        .select('id, name, created_at, member_count')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (communitiesData) {
        setCommunities(
          communitiesData.map((c) => ({
            id: c.id,
            title: c.name,
            type: 'Community',
            status: 'active',
            created_at: c.created_at,
            metrics: { members: c.member_count },
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      published: 'default',
      draft: 'secondary',
      pending: 'secondary',
      scheduled: 'default',
      live: 'default',
      completed: 'secondary',
      active: 'default',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const handleViewContent = (item: ContentItem) => {
    if (item.type === 'Live Streaming') {
      navigate(`/live/${item.id}`);
    } else if (item.type === 'Deep Learning Course') {
      navigate(`/courses/${item.id}`);
    } else if (item.type === 'Community') {
      navigate(`/community/${item.id}`);
    }
    // Add other navigation as needed
  };

  const ContentTable = ({ items }: { items: ContentItem[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Metrics</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.metrics?.enrollments && `${item.metrics.enrollments} enrolled`}
                {item.metrics?.downloads && `${item.metrics.downloads} downloads`}
                {item.metrics?.attendees && `${item.metrics.attendees} attendees`}
                {item.metrics?.members && `${item.metrics.members} members`}
              </TableCell>
              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {item.type === 'Live Streaming' ? (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleViewContent(item)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    {item.status === 'scheduled' ? 'Go Live' : 'View'}
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewContent(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-12">
              <EmptyContent 
                message="No content in this section"
                description="Create content to see it appear here"
                showAction={false}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Content</CardTitle>
        <CardDescription>Manage all your uploaded content in one place</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({courses.length + microlearning.length + products.length + events.length + communities.length})</TabsTrigger>
            <TabsTrigger value="micro">Micro ({microlearning.length})</TabsTrigger>
            <TabsTrigger value="courses">Deep ({courses.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="communities">Groups ({communities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ContentTable items={[...microlearning, ...courses, ...products, ...events, ...communities]} />
          </TabsContent>

          <TabsContent value="micro" className="mt-4">
            <ContentTable items={microlearning} />
          </TabsContent>

          <TabsContent value="courses" className="mt-4">
            <ContentTable items={courses} />
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <ContentTable items={products} />
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <ContentTable items={events} />
          </TabsContent>

          <TabsContent value="communities" className="mt-4">
            <ContentTable items={communities} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
