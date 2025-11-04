import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Award,
  BookOpen,
  Users,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  created_by: string;
  price: number;
  is_active: boolean;
  estimated_hours: number;
  created_at: string;
  _count?: {
    enrollments: number;
    modules: number;
  };
}

export function AdminCourses() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/modules')) return 'modules';
    if (path.includes('/lessons')) return 'lessons';
    if (path.includes('/quizzes')) return 'quizzes';
    if (path.includes('/certificates')) return 'certificates';
    return 'tracks';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'tracks') {
      navigate('/admin/courses');
    } else {
      navigate(`/admin/courses/${value}`);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [tracks, searchTerm, categoryFilter, statusFilter]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          enrollments(count),
          modules(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTracks = () => {
    let filtered = tracks;

    if (searchTerm) {
      filtered = filtered.filter(track => 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(track => track.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(track => track.is_active === isActive);
    }

    setFilteredTracks(filtered);
  };

  const toggleTrackStatus = async (trackId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ is_active: !currentStatus })
        .eq('id', trackId);

      if (error) throw error;

      await supabase.rpc('log_admin_action', {
        _action: currentStatus ? 'unpublish_track' : 'publish_track',
        _entity_type: 'track',
        _entity_id: trackId
      });

      toast({
        title: "Success",
        description: `Track ${currentStatus ? 'unpublished' : 'published'} successfully`,
      });

      fetchTracks();
    } catch (error) {
      console.error('Error updating track:', error);
      toast({
        title: "Error",
        description: "Failed to update track status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Published" : "Draft"}
    </Badge>
  );

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            Manage learning tracks, modules, and certificates
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Track
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tracks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Published</SelectItem>
                    <SelectItem value="inactive">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tracks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Tracks ({filteredTracks.length})</CardTitle>
              <CardDescription>
                All learning tracks and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Track</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTracks.map((track) => (
                      <TableRow key={track.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {track.description}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {track.estimated_hours}h
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getLevelBadge(track.level)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{track.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(track.is_active)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {track._count?.enrollments || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {track.price > 0 ? `$${track.price}` : 'Free'}
                        </TableCell>
                        <TableCell>
                          {new Date(track.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Track
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleTrackStatus(track.id, track.is_active)}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                {track.is_active ? 'Unpublish' : 'Publish'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Track
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Module Management</h3>
              <p className="text-muted-foreground">Module management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lesson Management</h3>
              <p className="text-muted-foreground">Lesson management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quiz Management</h3>
              <p className="text-muted-foreground">Quiz management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Certificate Templates</h3>
              <p className="text-muted-foreground">Certificate management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}