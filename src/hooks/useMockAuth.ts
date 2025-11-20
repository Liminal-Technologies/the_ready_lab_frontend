import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/auth';
import { clearDemoStudentData } from '@/utils/clearDemoData';

export type MockUserRole = 'super_admin' | 'admin' | 'educator' | 'student';

interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: MockUserRole;
  avatarUrl?: string;
}

interface MockAuthStore {
  user: MockUser | null;
  isDemo: boolean;
  login: (role: MockUserRole) => void;
  logout: () => void;
  toggleDemo: () => void;
  clearDemoMode: () => void;
}

const mockUsers: Record<MockUserRole, MockUser> = {
  super_admin: {
    id: 'mock-super-admin',
    email: 'admin@thereadylab.com',
    fullName: 'Alex Admin',
    role: 'super_admin',
  },
  admin: {
    id: 'mock-admin',
    email: 'admin.user@thereadylab.com',
    fullName: 'Jamie Administrator',
    role: 'admin',
  },
  educator: {
    id: 'mock-educator',
    email: 'educator@thereadylab.com',
    fullName: 'Dr. Sarah Chen',
    role: 'educator',
  },
  student: {
    id: 'mock-student',
    email: 'student@thereadylab.com',
    fullName: 'John Student',
    role: 'student',
  },
};

export const convertMockUserToProfile = (mockUser: MockUser): UserProfile => {
  const baseRole = mockUser.role === 'super_admin' || mockUser.role === 'admin' ? 'admin' : mockUser.role;
  
  const profile: UserProfile = {
    id: mockUser.id,
    email: mockUser.email,
    role: baseRole as 'student' | 'educator' | 'admin',
    full_name: mockUser.fullName,
    created_at: new Date().toISOString(),
    subscription_status: 'active',
    subscription_tier: 'premium',
    avatar_url: mockUser.avatarUrl || null,
    admin_roles: []
  };

  if (mockUser.role === 'super_admin') {
    profile.admin_roles = [{
      id: 'mock-admin-role-1',
      role: 'super_admin' as const,
      granted_by: null,
      granted_at: new Date().toISOString(),
      is_active: true,
      feature_flags: {}
    }];
  }

  return profile;
};

export const useMockAuth = create<MockAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isDemo: false,
      login: (role: MockUserRole) => {
        // Clear all student-specific data on student login for fresh demo experience
        if (role === 'student') {
          clearDemoStudentData();
        }
        set({ user: mockUsers[role], isDemo: true });
      },
      logout: () => {
        // Clear demo mode flag and reset all state on logout
        localStorage.removeItem('demo-mode');
        set({ user: null, isDemo: false });
      },
      toggleDemo: () => {
        set((state) => ({ isDemo: !state.isDemo }));
      },
      clearDemoMode: () => {
        // Clear demo mode flag and reset all store state
        localStorage.removeItem('demo-mode');
        set({ user: null, isDemo: false });
      },
    }),
    {
      name: 'mock-auth-storage',
    }
  )
);
