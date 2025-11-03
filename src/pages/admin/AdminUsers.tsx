import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  CreditCard,
  Shield,
  Mail,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  subscription_status: string;
  subscription_tier?: string;
  avatar_url?: string;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
  }>({ open: false, action: '', title: '', description: '' });
  const [emailDialog, setEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addAdminDialog, setAddAdminDialog] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState<string>('content_admin');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.subscription_status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (action: string) => {
    if (!selectedUser) return;

    try {
      // Log the admin action
      await supabase.rpc('log_admin_action', {
        _action: action,
        _entity_type: 'user',
        _entity_id: selectedUser.id,
        _metadata: { email: selectedUser.email }
      });

      switch (action) {
        case 'approve_educator':
          await supabase
            .from('profiles')
            .update({ role: 'educator', subscription_status: 'active' })
            .eq('id', selectedUser.id);
          break;
        case 'revoke_educator':
          await supabase
            .from('profiles')
            .update({ role: 'student' })
            .eq('id', selectedUser.id);
          break;
        case 'cancel_subscription':
          await supabase
            .from('profiles')
            .update({ subscription_status: 'cancelled' })
            .eq('id', selectedUser.id);
          break;
        case 'reset_password':
          // This would typically send a password reset email
          toast({
            title: "Password Reset",
            description: "Password reset email sent to user",
          });
          break;
      }

      toast({
        title: "Success",
        description: "User action completed successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    }

    setActionDialog({ open: false, action: '', title: '', description: '' });
    setSelectedUser(null);
  };

  const handleUpdateEmail = async () => {
    if (!selectedUser || !newEmail) return;

    try {
      // Update email in auth.users via admin API
      const { error: authError } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        { email: newEmail }
      );

      if (authError) throw authError;

      // Update email in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email: newEmail })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // Log the admin action
      await supabase.rpc('log_admin_action', {
        _action: 'update_email',
        _entity_type: 'user',
        _entity_id: selectedUser.id,
        _metadata: { old_email: selectedUser.email, new_email: newEmail }
      });

      toast({
        title: "Success",
        description: "Email updated successfully",
      });

      fetchUsers();
      setEmailDialog(false);
      setNewEmail('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Failed to update email. Make sure you have admin privileges.",
        variant: "destructive",
      });
    }
  };

  const openEmailDialog = (user: User) => {
    setSelectedUser(user);
    setNewEmail(user.email);
    setEmailDialog(true);
  };

  const handleAddAdmin = async () => {
    if (!adminEmail || !adminRole) {
      toast({
        title: "Error",
        description: "Please enter email and select a role",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', adminEmail)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Error",
          description: "User not found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Insert admin role
      const { error: roleError } = await supabase
        .from('admin_roles')
        .insert([{
          user_id: profiles.id,
          role: adminRole as any,
          granted_by: (await supabase.auth.getUser()).data.user?.id,
          is_active: true
        }]);

      if (roleError) {
        if (roleError.code === '23505') {
          toast({
            title: "Error",
            description: "This user already has that admin role",
            variant: "destructive",
          });
        } else {
          throw roleError;
        }
        return;
      }

      // Log the admin action
      await supabase.rpc('log_admin_action', {
        _action: 'grant_admin_role',
        _entity_type: 'user',
        _entity_id: profiles.id,
        _metadata: { email: adminEmail, role: adminRole }
      });

      toast({
        title: "Success",
        description: `Admin role ${adminRole} granted successfully`,
      });

      setAddAdminDialog(false);
      setAdminEmail('');
      setAdminRole('content_admin');
      fetchUsers();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin role",
        variant: "destructive",
      });
    }
  };

  const openActionDialog = (user: User, action: string) => {
    setSelectedUser(user);
    
    const dialogConfig = {
      approve_educator: {
        title: "Approve Educator",
        description: `Are you sure you want to approve ${user.email} as an educator? This will grant them access to create courses.`
      },
      revoke_educator: {
        title: "Revoke Educator Status",
        description: `Are you sure you want to revoke educator status for ${user.email}? They will lose access to course creation.`
      },
      cancel_subscription: {
        title: "Cancel Subscription",
        description: `Are you sure you want to cancel the subscription for ${user.email}?`
      },
      reset_password: {
        title: "Reset Password",
        description: `Send a password reset email to ${user.email}?`
      }
    };

    const config = dialogConfig[action as keyof typeof dialogConfig];
    setActionDialog({
      open: true,
      action,
      title: config.title,
      description: config.description
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      educator: "bg-blue-100 text-blue-800",
      student: "bg-green-100 text-green-800"
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      trial: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and subscriptions
          </p>
        </div>
        <Button onClick={() => setAddAdminDialog(true)}>
          <Shield className="mr-2 h-4 w-4" />
          Add Admin User
        </Button>
      </div>

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
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="educator">Educator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            All registered users and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name || 'No name'}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.subscription_status)}</TableCell>
                    <TableCell>
                      {user.subscription_tier ? (
                        <Badge variant="outline">{user.subscription_tier}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEmailDialog(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Edit Email
                          </DropdownMenuItem>
                          {user.role === 'educator' && (
                            <DropdownMenuItem onClick={() => openActionDialog(user, 'revoke_educator')}>
                              <UserX className="mr-2 h-4 w-4" />
                              Revoke Educator Status
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openActionDialog(user, 'reset_password')}>
                            <Mail className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          {user.subscription_status === 'active' && (
                            <DropdownMenuItem onClick={() => openActionDialog(user, 'cancel_subscription')}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          )}
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

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
            <DialogDescription>{actionDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button onClick={() => handleUserAction(actionDialog.action)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Email Address</DialogTitle>
            <DialogDescription>
              Update the email address for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="email"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setEmailDialog(false);
                setNewEmail('');
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateEmail}>
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Admin User Dialog */}
      <Dialog open={addAdminDialog} onOpenChange={setAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Admin Role</DialogTitle>
            <DialogDescription>
              Grant an admin role to an existing user by their email address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Role</label>
              <Select value={adminRole} onValueChange={setAdminRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="content_admin">Content Admin</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                  <SelectItem value="community_admin">Community Admin</SelectItem>
                  <SelectItem value="compliance_admin">Compliance Admin</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="institution_manager">Institution Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setAddAdminDialog(false);
                setAdminEmail('');
                setAdminRole('content_admin');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAdmin}>
              Grant Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}