import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Eye,
  AlertCircle,
  RefreshCw,
  Key,
  Users,
  Shield,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminDataSource } from "@/hooks/useAdminDataSource";
import { useMockAuth } from "@/hooks/useMockAuth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { User } from "@/services/AdminDataService";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailDialog, setUserDetailDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    variant?: 'danger' | 'warning';
    requireTypedConfirmation?: string;
  }>({
    open: false,
    title: '',
    description: '',
    action: async () => {},
  });
  const { toast } = useToast();
  const { isDemo, toggleDemo } = useMockAuth();
  const dataSource = useAdminDataSource();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await dataSource.users.getUsers();
      setUsers(data);
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
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setUserDetailDialog(true);
  };

  const handleDisableUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: `Disable ${user.fullName}?`,
      description: `This will prevent ${user.email} from accessing the platform. Type "${user.email}" to confirm.`,
      variant: 'danger',
      requireTypedConfirmation: user.email,
      action: async () => {
        await dataSource.users.disableUser(user.id, 'Disabled by admin');
        toast({
          title: "Success",
          description: `${user.fullName} has been disabled`,
        });
        fetchUsers();
      },
    });
  };

  const handleEnableUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: `Enable ${user.fullName}?`,
      description: `This will restore full access for ${user.fullName}. Type "${user.email}" to confirm.`,
      variant: 'warning',
      requireTypedConfirmation: user.email,
      action: async () => {
        await dataSource.users.enableUser(user.id);
        toast({
          title: "Success",
          description: `${user.fullName} has been enabled`,
        });
        fetchUsers();
      },
    });
  };

  const handleResetPassword = (user: User) => {
    setConfirmDialog({
      open: true,
      title: `Reset Password for ${user.fullName}?`,
      description: `In demo mode, this will only show a notification. In production, this would send a password reset email to ${user.email}.`,
      variant: 'warning',
      action: async () => {
        await dataSource.users.resetPassword(user.id);
        toast({
          title: "Demo Mode",
          description: `Password reset email would be sent to ${user.email} in production`,
        });
      },
    });
  };

  const getRoleBadge = (role: User['role'], userId: string) => {
    const roleConfig = {
      super_admin: { color: "bg-purple-100 text-purple-800", label: "Super Admin" },
      admin: { color: "bg-red-100 text-red-800", label: "Admin" },
      educator: { color: "bg-blue-100 text-blue-800", label: "Educator" },
      student: { color: "bg-green-100 text-green-800", label: "Student" },
    };
    const config = roleConfig[role];
    return (
      <Badge className={config.color} data-testid={`badge-role-${role}-${userId}`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: User['status'], userId: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500" data-testid={`badge-status-active-${userId}`}>Active</Badge>;
      case 'disabled':
        return <Badge variant="destructive" data-testid={`badge-status-disabled-${userId}`}>Disabled</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and access permissions
          </p>
        </div>
      </div>

      {/* Demo Mode Required Alert */}
      {!isDemo && users.length === 0 && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>User management features are currently only available in demo mode. Please enable demo mode to explore this functionality.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDemo}
              className="ml-4"
              data-testid="button-enable-demo"
            >
              Enable Demo Mode
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Educators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'educator').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Content creators
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'disabled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
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
                  data-testid="input-search-users"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-role-filter">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="educator">Educator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={fetchUsers}
              disabled={loading}
              data-testid="button-refresh-users"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback data-testid={`avatar-${user.id}`}>
                              {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium" data-testid={`text-name-${user.id}`}>
                              {user.fullName || 'No name'}
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`text-email-${user.id}`}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role, user.id)}</TableCell>
                      <TableCell>{getStatusBadge(user.status, user.id)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground" data-testid={`text-joined-${user.id}`}>
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground" data-testid={`text-last-active-${user.id}`}>
                          {formatDateTime(user.lastActive)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`button-actions-${user.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(user)}
                              data-testid={`menuitem-view-details-${user.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={() => handleDisableUser(user)}
                                data-testid={`menuitem-disable-${user.id}`}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Disable User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleEnableUser(user)}
                                data-testid={`menuitem-enable-${user.id}`}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Enable User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleResetPassword(user)}
                              data-testid={`menuitem-reset-password-${user.id}`}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={userDetailDialog} onOpenChange={setUserDetailDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-user-details">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedUser?.fullName || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatarUrl} />
                  <AvatarFallback className="text-xl">
                    {selectedUser.fullName?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold" data-testid="detail-name">
                    {selectedUser.fullName || 'No name provided'}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="detail-email">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <div data-testid="detail-role">{getRoleBadge(selectedUser.role, selectedUser.id)}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div data-testid="detail-status">{getStatusBadge(selectedUser.status, selectedUser.id)}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm" data-testid="detail-joined">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                  <p className="text-sm" data-testid="detail-last-active">{formatDateTime(selectedUser.lastActive)}</p>
                </div>
              </div>

              {selectedUser.status === 'disabled' && selectedUser.disabledReason && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>User Disabled</AlertTitle>
                  <AlertDescription data-testid="detail-disabled-reason">
                    <p className="font-medium">Reason: {selectedUser.disabledReason}</p>
                    {selectedUser.disabledAt && (
                      <p className="text-sm mt-1">Disabled on: {formatDateTime(selectedUser.disabledAt)}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setUserDetailDialog(false)}
                  data-testid="button-close-details"
                >
                  Close
                </Button>
                {selectedUser.status === 'active' ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setUserDetailDialog(false);
                      handleDisableUser(selectedUser);
                    }}
                    data-testid="button-disable-from-details"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Disable User
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      setUserDetailDialog(false);
                      handleEnableUser(selectedUser);
                    }}
                    data-testid="button-enable-from-details"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Enable User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
        variant={confirmDialog.variant}
        requireTypedConfirmation={confirmDialog.requireTypedConfirmation}
      />
    </div>
  );
}
