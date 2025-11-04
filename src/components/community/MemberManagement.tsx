import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, UserX, Ban, Shield } from 'lucide-react';

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface MemberManagementProps {
  communityId: string;
}

export const MemberManagement = ({ communityId }: MemberManagementProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, [communityId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "The member has been removed from the community",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleBanMember = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this member? They will not be able to rejoin.')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Remove from community
      await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      // Add to ban list
      const { error } = await supabase
        .from('community_bans')
        .insert({
          community_id: communityId,
          user_id: userId,
          banned_by: user.id,
          reason: 'Banned by moderator',
          ban_type: 'permanent',
        });

      if (error) throw error;

      toast({
        title: "Member banned",
        description: "The member has been banned from the community",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error banning member:', error);
      toast({
        title: "Error",
        description: "Failed to ban member",
        variant: "destructive",
      });
    }
  };

  const handlePromoteModerator = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'moderator' ? 'member' : 'moderator';
      
      const { error } = await supabase
        .from('community_members')
        .update({ role: newRole })
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: newRole === 'moderator' ? "Member promoted" : "Moderator demoted",
        description: `Role changed to ${newRole}`,
      });
      fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-8 text-muted-foreground">Loading members...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {(member.profiles?.full_name || member.profiles?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.profiles?.full_name || member.profiles?.email || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={member.role === 'admin' || member.role === 'moderator' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </TableCell>
            <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              {member.role !== 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePromoteModerator(member.user_id, member.role)}>
                      <Shield className="h-4 w-4 mr-2" />
                      {member.role === 'moderator' ? 'Demote to Member' : 'Promote to Moderator'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveMember(member.user_id)}>
                      <UserX className="h-4 w-4 mr-2" />
                      Remove Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBanMember(member.user_id)}
                      className="text-destructive"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
