import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  Shield,
  Settings,
} from "lucide-react";
import { MemberManagement } from "./MemberManagement";
import { ContentModeration } from "./ContentModeration";
import { EditCommunityModal } from "./EditCommunityModal";

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  visibility: string;
  rules: string | null;
  cover_photo: string | null;
  created_at: string;
}

export const CommunityManager = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null,
  );
  const [showMembers, setShowMembers] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(
    null,
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to archive this community? It will be hidden from members but data will be preserved.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("communities")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Community archived",
        description: "The community has been archived",
      });
      fetchCommunities();
    } catch (error) {
      console.error("Error archiving community:", error);
      toast({
        title: "Error",
        description: "Failed to archive community",
        variant: "destructive",
      });
    }
  };

  if (showMembers && selectedCommunity) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Member Management</CardTitle>
            <Button variant="outline" onClick={() => setShowMembers(false)}>
              Back to Communities
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MemberManagement communityId={selectedCommunity} />
        </CardContent>
      </Card>
    );
  }

  if (showModeration && selectedCommunity) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Moderation</CardTitle>
            <Button variant="outline" onClick={() => setShowModeration(false)}>
              Back to Communities
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ContentModeration communityId={selectedCommunity} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Communities Manager</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : communities.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No communities yet</p>
              <Button onClick={() => navigate("/community/create")}>
                Create Your First Community
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map((community) => (
                  <TableRow key={community.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => navigate(`/community/${community.id}`)}
                        className="hover:text-primary transition-colors"
                      >
                        {community.name}
                      </button>
                    </TableCell>
                    <TableCell>{community.member_count}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{community.visibility}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/community/${community.id}`)
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingCommunity(community)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommunity(community.id);
                              setShowMembers(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Manage Members
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommunity(community.id);
                              setShowModeration(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Moderate Content
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(community.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editingCommunity && (
        <EditCommunityModal
          community={editingCommunity}
          open={!!editingCommunity}
          onOpenChange={(open) => !open && setEditingCommunity(null)}
          onSuccess={() => {
            setEditingCommunity(null);
            fetchCommunities();
          }}
        />
      )}
    </>
  );
};
