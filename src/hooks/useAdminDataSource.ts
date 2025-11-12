/**
 * Hook to select between real (Supabase) and mock (demo) admin data sources
 * Based on the demo mode toggle in useMockAuth
 */

import { useMockAuth } from './useMockAuth';
import { MockAdminDataSource } from '@/services/MockAdminService';
import type { IAdminDataSource } from '@/services/AdminDataService';

// TODO: Implement SupabaseAdminDataSource
// For now, create a passthrough that warns when trying to use real mode
const SupabaseAdminDataSourcePlaceholder: IAdminDataSource = {
  communities: {
    async getCommunities() {
      console.warn('Supabase implementation not yet migrated. Please use demo mode.');
      return [];
    },
    async getCommunity() { return null; },
    async updateCommunityStatus(id, status) {
      throw new Error('Supabase implementation not yet available');
    },
    async disableCommunities() {},
    async archiveCommunities() {},
  },
  users: {
    async getUsers() { return []; },
    async getUser() { return null; },
    async disableUser(id, reason) {
      throw new Error('Supabase implementation not yet available');
    },
    async enableUser(id) {
      throw new Error('Supabase implementation not yet available');
    },
    async resetPassword() {},
  },
  kpis: {
    async getKPIs() {
      return {
        activeStudents: 0,
        activeEducators: 0,
        newSubscriptions: 0,
        courseCompletions: 0,
        certificatesIssued: 0,
        monthlyRevenue: 0,
        activeCommunities: 0,
        pendingApprovals: 0,
        totalGMV: 0,
        stripeConnected: false,
        emailProviderConnected: false,
      };
    },
    async getAlerts() { return []; },
  },
  settings: {
    async getPlatformSettings() {
      return {
        platformFeePercent: 15,
        stripeConnected: false,
        emailProvider: null,
        payoutSchedule: 'weekly',
        minPayoutAmount: 50,
      };
    },
    async updatePlatformSettings(updates) {
      throw new Error('Supabase implementation not yet available');
    },
    async getCollaborators() { return []; },
    async inviteCollaborator(email, role) {
      throw new Error('Supabase implementation not yet available');
    },
  },
};

export function useAdminDataSource(): IAdminDataSource {
  const { isDemo } = useMockAuth();

  // Return mock data source in demo mode, otherwise use placeholder (preserves existing functionality)
  return isDemo ? MockAdminDataSource : SupabaseAdminDataSourcePlaceholder;
}
