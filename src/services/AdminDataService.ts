/**
 * Admin Data Service Interface
 * Defines contracts for admin dashboard data operations
 * Implementations: Supabase (real) and Mock (demo)
 */

// Domain Types (not tied to any specific implementation)
export interface Community {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  members: number;
  status: 'Active' | 'Disabled' | 'Archived';
  createdAt: string;
  description: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'educator' | 'student';
  status: 'active' | 'disabled';
  createdAt: string;
  lastActive: string;
  avatarUrl?: string;
  disabledReason?: string;
  disabledAt?: string;
}

export interface PlatformSettings {
  platformFeePercent: number;
  stripeConnected: boolean;
  emailProvider: string | null;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minPayoutAmount: number;
}

// KPI Data Types
export interface KPIData {
  activeStudents: number;
  activeEducators: number;
  newSubscriptions: number;
  courseCompletions: number;
  certificatesIssued: number;
  monthlyRevenue: number;
  activeCommunities: number;
  pendingApprovals: number;
  totalGMV: number;
  stripeConnected: boolean;
  emailProviderConnected: boolean;
  emailProvider?: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  count?: number;
}

// Service Interfaces
export interface IAdminCommunityService {
  getCommunities(): Promise<Community[]>;
  getCommunity(id: string): Promise<Community | null>;
  updateCommunityStatus(id: string, status: Community['status']): Promise<Community>;
  disableCommunities(ids: string[]): Promise<void>;
  archiveCommunities(ids: string[]): Promise<void>;
}

export interface IAdminUserService {
  getUsers(roleFilter?: User['role']): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  disableUser(id: string, reason: string): Promise<User>;
  enableUser(id: string): Promise<User>;
  resetPassword(id: string): Promise<void>;
}

export interface IAdminKPIService {
  getKPIs(): Promise<KPIData>;
  getAlerts(): Promise<Alert[]>;
}

export interface IAdminSettingsService {
  getPlatformSettings(): Promise<PlatformSettings>;
  updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings>;
  getCollaborators(): Promise<Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    status: 'active' | 'pending';
    addedAt: string;
  }>>;
  inviteCollaborator(email: string, role: 'super_admin' | 'admin'): Promise<{
    id: string;
    email: string;
    role: string;
    status: 'pending' | 'accepted';
    invitedAt: string;
  }>;
}

/**
 * Admin Data Source - aggregates all admin services
 */
export interface IAdminDataSource {
  communities: IAdminCommunityService;
  users: IAdminUserService;
  kpis: IAdminKPIService;
  settings: IAdminSettingsService;
}
