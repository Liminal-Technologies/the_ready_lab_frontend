import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useMockAuth = create<MockAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isDemo: false,
      login: (role: MockUserRole) => {
        set({ user: mockUsers[role], isDemo: true });
      },
      logout: () => {
        set({ user: null, isDemo: false });
      },
      toggleDemo: () => {
        set((state) => ({ isDemo: !state.isDemo }));
      },
    }),
    {
      name: 'mock-auth-storage',
    }
  )
);
