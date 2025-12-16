/**
 * Mock Admin Service Implementation
 * Uses MockApi for demo mode data
 */

import { MockApi } from '@/mocks/MockApi';
import { StripeStub } from '@/mocks/StripeStub';
import { EmailCrmStub } from '@/mocks/EmailCrmStub';
import type {
  IAdminCommunityService,
  IAdminUserService,
  IAdminKPIService,
  IAdminSettingsService,
  IAdminDataSource,
  KPIData,
  Alert,
} from './AdminDataService';

class MockCommunityService implements IAdminCommunityService {
  async getCommunities() {
    return MockApi.getCommunities();
  }

  async getCommunity(id: string) {
    return MockApi.getCommunity(id);
  }

  async updateCommunityStatus(id: string, status: any) {
    return MockApi.updateCommunityStatus(id, status);
  }

  async disableCommunities(ids: string[]) {
    return MockApi.disableCommunities(ids);
  }

  async archiveCommunities(ids: string[]) {
    return MockApi.archiveCommunities(ids);
  }
}

class MockUserService implements IAdminUserService {
  async getUsers(roleFilter?: any) {
    return MockApi.getUsers(roleFilter);
  }

  async getUser(id: string) {
    return MockApi.getUser(id);
  }

  async disableUser(id: string, reason: string) {
    return MockApi.disableUser(id, reason);
  }

  async enableUser(id: string) {
    return MockApi.enableUser(id);
  }

  async resetPassword(id: string) {
    return MockApi.resetPassword(id);
  }
}

class MockKPIService implements IAdminKPIService {
  async getKPIs(): Promise<KPIData> {
    const [communities, users, courses, certificates] = await Promise.all([
      MockApi.getCommunities(),
      MockApi.getUsers(),
      MockApi.getCourses(),
      MockApi.getCertificates(),
    ]);

    const activeStudents = users.filter(u => u.role === 'student' && u.status === 'active').length;
    const activeEducators = users.filter(u => u.role === 'educator' && u.status === 'active').length;
    const activeCommunities = communities.filter(c => c.status === 'Active').length;
    
    // Calculate GMV from mock courses
    const totalGMV = courses.reduce((sum, course) => sum + course.price, 0);

    // Check integration statuses
    const stripeStatus = await StripeStub.getAccountStatus();
    const emailConfig = EmailCrmStub.getProviderConfig();

    return {
      activeStudents,
      activeEducators,
      newSubscriptions: Math.floor(activeStudents * 0.15), // Mock: 15% new this month
      courseCompletions: Math.floor(certificates.length * 0.8),
      certificatesIssued: certificates.length,
      monthlyRevenue: Math.floor(totalGMV * 0.25), // Mock: 25% of GMV this month
      activeCommunities,
      pendingApprovals: 3, // Mock pending items
      totalGMV,
      platformFeePercent: 15, // Mock: 15% platform fee
      stripeConnected: stripeStatus?.connected || false,
      emailProviderConnected: emailConfig?.connected || false,
      emailProvider: emailConfig?.provider,
    };
  }

  async getAlerts(): Promise<Alert[]> {
    const [users, communities, courses] = await Promise.all([
      MockApi.getUsers(),
      MockApi.getCommunities(),
      MockApi.getCourses(),
    ]);

    const alerts: Alert[] = [];

    // Check for disabled users
    const disabledUsers = users.filter(u => u.status === 'disabled');
    if (disabledUsers.length > 0) {
      alerts.push({
        id: 'disabled-users',
        type: 'warning',
        title: 'Disabled Users',
        description: `${disabledUsers.length} user(s) are currently disabled and require attention`,
        count: disabledUsers.length,
      });
    }

    // Check for pending approvals (mock)
    alerts.push({
      id: 'pending-approvals',
      type: 'info',
      title: 'Pending Approvals',
      description: '3 educator applications awaiting review',
      count: 3,
    });

    // Check Stripe status
    const stripeStatus = await StripeStub.getAccountStatus();
    if (!stripeStatus?.connected) {
      alerts.push({
        id: 'stripe-not-connected',
        type: 'error',
        title: 'Stripe Not Connected',
        description: 'Platform payments are disabled. Connect your Stripe account to enable transactions.',
      });
    }

    // Check Email/CRM status
    const emailConfig = EmailCrmStub.getProviderConfig();
    if (!emailConfig?.connected) {
      alerts.push({
        id: 'email-not-connected',
        type: 'warning',
        title: 'Email Provider Not Connected',
        description: 'Email notifications are disabled. Connect an email provider to send course updates and certificates.',
      });
    }

    return alerts;
  }
}

class MockSettingsService implements IAdminSettingsService {
  async getPlatformSettings() {
    return MockApi.getPlatformSettings();
  }

  async updatePlatformSettings(updates: any) {
    return MockApi.updatePlatformSettings(updates);
  }

  async getCollaborators() {
    return MockApi.getCollaborators();
  }

  async inviteCollaborator(email: string, role: any) {
    return MockApi.inviteCollaborator(email, role);
  }
}

export const MockAdminDataSource: IAdminDataSource = {
  communities: new MockCommunityService(),
  users: new MockUserService(),
  kpis: new MockKPIService(),
  settings: new MockSettingsService(),
};
