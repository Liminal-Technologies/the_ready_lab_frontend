import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Users,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Archive,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAdminDataSource } from "@/hooks/useAdminDataSource";
import { useMockAuth } from "@/hooks/useMockAuth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { Community } from "@/services/AdminDataService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AdminCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCommunities, setSelectedCommunities] = useState<Set<string>>(new Set());
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
    fetchCommunities();
  }, []);

  useEffect(() => {
    filterCommunities();
  }, [communities, searchTerm, statusFilter]);

  useEffect(() => {
    // Clear selection when filters change
    setSelectedCommunities(new Set());
  }, [searchTerm, statusFilter]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const data = await dataSource.communities.getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCommunities = () => {
    let filtered = communities;

    if (searchTerm) {
      filtered = filtered.filter(community => 
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(community => community.status === statusFilter);
    }

    setFilteredCommunities(filtered);
  };

  const handleDisableCommunity = (community: Community) => {
    setConfirmDialog({
      open: true,
      title: `Disable ${community.name}?`,
      description: `This will prevent new posts and hide the community from discovery. Members will still have read-only access. This action can be reversed.`,
      variant: 'warning',
      action: async () => {
        await dataSource.communities.updateCommunityStatus(community.id, 'Disabled');
        toast({
          title: "Success",
          description: `${community.name} has been disabled`,
        });
        fetchCommunities();
      },
    });
  };

  const handleArchiveCommunity = (community: Community) => {
    setConfirmDialog({
      open: true,
      title: `Archive ${community.name}?`,
      description: `This will permanently archive the community. All content will be preserved but the community will no longer be accessible. Type "${community.name}" to confirm.`,
      variant: 'danger',
      requireTypedConfirmation: community.name,
      action: async () => {
        await dataSource.communities.updateCommunityStatus(community.id, 'Archived');
        toast({
          title: "Success",
          description: `${community.name} has been archived`,
        });
        fetchCommunities();
      },
    });
  };

  const handleEnableCommunity = async (community: Community) => {
    await dataSource.communities.updateCommunityStatus(community.id, 'Active');
    toast({
      title: "Success",
      description: `${community.name} has been enabled`,
    });
    fetchCommunities();
  };

  const handleBulkDisable = () => {
    if (selectedCommunities.size === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Disable ${selectedCommunities.size} communities?`,
      description: `This will disable ${selectedCommunities.size} selected communities and prevent new posts. Type "DISABLE" to confirm.`,
      variant: 'warning',
      requireTypedConfirmation: 'DISABLE',
      action: async () => {
        await dataSource.communities.disableCommunities(Array.from(selectedCommunities));
        toast({
          title: "Success",
          description: `${selectedCommunities.size} communities disabled`,
        });
        setSelectedCommunities(new Set());
        fetchCommunities();
      },
    });
  };

  const handleBulkArchive = () => {
    if (selectedCommunities.size === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Archive ${selectedCommunities.size} communities?`,
      description: `This will permanently archive ${selectedCommunities.size} selected communities. Type "ARCHIVE" to confirm.`,
      variant: 'danger',
      requireTypedConfirmation: 'ARCHIVE',
      action: async () => {
        await dataSource.communities.archiveCommunities(Array.from(selectedCommunities));
        toast({
          title: "Success",
          description: `${selectedCommunities.size} communities archived`,
        });
        setSelectedCommunities(new Set());
        fetchCommunities();
      },
    });
  };

  const toggleSelectAll = () => {
    if (selectedCommunities.size === filteredCommunities.length) {
      setSelectedCommunities(new Set());
    } else {
      setSelectedCommunities(new Set(filteredCommunities.map(c => c.id)));
    }
  };

  const toggleSelectCommunity = (id: string) => {
    const newSelected = new Set(selectedCommunities);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCommunities(newSelected);
  };

  const getStatusBadge = (status: Community['status'], communityId: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-500" data-testid={`badge-status-active-${communityId}`}>Active</Badge>;
      case 'Disabled':
        return <Badge variant="destructive" data-testid={`badge-status-disabled-${communityId}`}>Disabled</Badge>;
      case 'Archived':
        return <Badge variant="secondary" data-testid={`badge-status-archived-${communityId}`}>Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-muted-foreground">
            Manage learning communities and moderate discussions
          </p>
        </div>
        <Button data-testid="button-create-community">
          <Plus className="mr-2 h-4 w-4" />
          Create TRL Community
        </Button>
      </div>

      {/* Demo Mode Required Alert */}
      {!isDemo && communities.length === 0 && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Community management features are currently only available in demo mode. Please enable demo mode to explore this functionality.</span>
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
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communities.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Communities</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communities.filter(c => c.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communities.reduce((sum, c) => sum + c.members, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all communities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Require moderation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Filters</CardTitle>
            {selectedCommunities.size > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDisable}
                  data-testid="button-bulk-disable"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Disable ({selectedCommunities.size})
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkArchive}
                  data-testid="button-bulk-archive"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive ({selectedCommunities.size})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-communities"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchCommunities}
              disabled={loading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Communities ({filteredCommunities.length})</CardTitle>
          <CardDescription>
            All learning communities and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCommunities.size === filteredCommunities.length && filteredCommunities.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading communities...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredCommunities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No communities found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommunities.map((community) => (
                    <TableRow key={community.id} data-testid={`row-community-${community.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCommunities.has(community.id)}
                          onCheckedChange={() => toggleSelectCommunity(community.id)}
                          data-testid={`checkbox-community-${community.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{community.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {community.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(community.status, community.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {community.members}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(community.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`button-actions-${community.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem data-testid={`action-view-${community.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Community
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-edit-${community.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-moderate-${community.id}`}>
                              <Settings className="mr-2 h-4 w-4" />
                              Moderate Posts
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {community.status === 'Active' ? (
                              <DropdownMenuItem 
                                onClick={() => handleDisableCommunity(community)}
                                data-testid={`action-disable-${community.id}`}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Disable Community
                              </DropdownMenuItem>
                            ) : community.status === 'Disabled' ? (
                              <DropdownMenuItem 
                                onClick={() => handleEnableCommunity(community)}
                                data-testid={`action-enable-${community.id}`}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Enable Community
                              </DropdownMenuItem>
                            ) : null}
                            {community.status !== 'Archived' && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleArchiveCommunity(community)}
                                data-testid={`action-archive-${community.id}`}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Community
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
        variant={confirmDialog.variant}
        requireTypedConfirmation={confirmDialog.requireTypedConfirmation}
      />
    </div>
  );
}