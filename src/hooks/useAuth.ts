import { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile, AuthState } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useMockAuth, convertMockUserToProfile } from './useMockAuth';
import { authApi, AuthUser } from '@/services/api';

// Helper to convert API auth user to UserProfile
const convertApiUserToProfile = (apiUser: AuthUser): UserProfile => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    fullName: apiUser.fullName,
    createdAt: apiUser.createdAt,
    subscriptionStatus: (apiUser.subscriptionStatus as 'active' | 'inactive' | 'trial' | 'cancelled') || 'trial',
    subscriptionTier: apiUser.subscriptionTier as 'basic' | 'pro' | 'premium' | undefined,
    avatarUrl: apiUser.avatarUrl,
    adminRoles: []
  };
};

const AuthContext = createContext<{
  auth: AuthState;
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<UserProfile>) => () => void; // Returns rollback function
  refreshUser: () => Promise<void>; // Refresh user data from API
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const mockAuth = useMockAuth();
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const fetchUserProfile = async (user: User, retries = 3, delay = 1000): Promise<UserProfile | null> => {
    try {
      // Fetch user profile with retry logic for new signups
      let profile = null;
      let profileError = null;
      
      for (let i = 0; i < retries; i++) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        profile = result.data;
        profileError = result.error;
        
        if (profile && !profileError) {
          break; // Profile found, exit retry loop
        }
        
        // If this is a new signup (profile not found), wait for trigger to complete
        if (i < retries - 1) {
          console.log(`Profile not found, retrying in ${delay}ms... (attempt ${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (profileError || !profile) {
        console.error('Error fetching profile after retries:', profileError);
        throw new Error('Failed to create user profile. Please contact support or try again.');
      }

      // Fetch user role from user_roles table using RPC
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (roleError) {
        console.error('Error fetching user role:', roleError);
      }

      // Fetch admin roles if any
      const { data: adminRoles, error: rolesError } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (rolesError) {
        console.error('Error fetching admin roles:', rolesError);
      }

      return {
        id: (profile as any).id,
        email: (profile as any).email,
        role: roleData || 'student', // Default to student if no role found
        fullName: (profile as any).full_name,
        createdAt: (profile as any).created_at,
        subscriptionStatus: (profile as any).subscription_status,
        subscriptionTier: (profile as any).subscription_tier,
        avatarUrl: (profile as any).avatar_url,
        adminRoles: (adminRoles || []).map((role: any) => ({
          id: role.id,
          role: role.role,
          granted_by: role.granted_by,
          granted_at: role.granted_at,
          is_active: role.is_active,
          feature_flags: typeof role.feature_flags === 'object' ? role.feature_flags : {}
        }))
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Rethrow error so it propagates to signUp
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string, fullName: string) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('Attempting signup with:', { email, role, fullName });
      console.log('Supabase URL:', 'https://ibxhnlcbsqkrkwbfmxto.supabase.co');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        
        // Check if we have a session (email confirmation disabled or auto-confirmed)
        if (data.session) {
          console.log('Session established, logging user in immediately');
          // Profile is created automatically by Supabase trigger (on_auth_user_created)

          // Fetch user profile and set auth state
          const userProfile = await fetchUserProfile(data.user);
          setAuth({
            user: userProfile,
            loading: false,
            error: null
          });
        } else {
          // Email confirmation required - show confirmation screen
          console.log('Email confirmation required');
          setAuth({
            user: null,
            loading: false,
            error: null
          });
        }
      }
    } catch (error: any) {
      console.error('SignUp function error:', error);
      setAuth(prev => ({ ...prev, error: error.message, loading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        setAuth({
          user: userProfile,
          loading: false,
          error: null
        });
      }
    } catch (error: any) {
      setAuth(prev => ({ ...prev, error: error.message, loading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));

      // Clear API auth token
      authApi.logout();

      if (mockAuth.isDemo) {
        mockAuth.logout();
        setAuth({
          user: null,
          loading: false,
          error: null
        });
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setAuth({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setAuth(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    console.log('useAuth useEffect: Setting up auth state listener');

    // Check demo mode FIRST - if active, bypass Supabase entirely
    if (mockAuth.isDemo && mockAuth.user) {
      console.log('Demo mode active, using mock user:', mockAuth.user);
      const demoProfile = convertMockUserToProfile(mockAuth.user);
      setAuth({
        user: demoProfile,
        loading: false,
        error: null
      });
      return; // Exit early, no Supabase subscription needed
    }

    // If demo mode but no user, show logged out state
    if (mockAuth.isDemo && !mockAuth.user) {
      console.log('Demo mode active but no mock user selected');
      setAuth({
        user: null,
        loading: false,
        error: null
      });
      return;
    }

    // Check for API auth token (from our custom auth system)
    // ALWAYS fetch fresh user data from API - don't rely on localStorage cache
    if (authApi.isAuthenticated()) {
      console.log('API auth token found, fetching fresh user data from API');
      setAuth(prev => ({ ...prev, loading: true }));

      authApi.getCurrentUser().then(apiUser => {
        if (apiUser) {
          console.log('Fresh user data fetched:', apiUser);
          const apiProfile = convertApiUserToProfile(apiUser);
          setAuth({
            user: apiProfile,
            loading: false,
            error: null
          });
        } else {
          // Token invalid or expired, clear auth
          console.log('Token invalid, clearing auth');
          authApi.logout();
          setAuth({
            user: null,
            loading: false,
            error: null
          });
        }
      }).catch(error => {
        console.error('Error fetching user from API:', error);
        setAuth({
          user: null,
          loading: false,
          error: error.message
        });
      });
      return; // Exit early, user is authenticated via API
    }

    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', { event, hasUser: !!session?.user });
        // Only synchronous state updates in the callback
        if (session?.user) {
          setAuth(prev => ({ ...prev, loading: true }));
          // Defer the async profile fetch to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user).then(profile => {
              console.log('Profile fetched successfully:', profile);
              setAuth({
                user: profile,
                loading: false,
                error: null
              });
            }).catch(error => {
              console.error('Error fetching profile:', error);
              setAuth({
                user: null,
                loading: false,
                error: error.message
              });
            });
          }, 0);
        } else {
          console.log('No user session, setting loading to false');
          setAuth(prev => ({
            user: null,
            loading: false,
            error: prev.error  // Preserve existing error instead of clearing it
          }));
        }
      }
    );

    // THEN check for existing session
    console.log('useAuth useEffect: Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Get session result:', { hasSession: !!session, error });
      if (session?.user) {
        setAuth(prev => ({ ...prev, loading: true }));
        fetchUserProfile(session.user).then(profile => {
          console.log('Initial profile fetch successful:', profile);
          setAuth({
            user: profile,
            loading: false,
            error: null
          });
        }).catch(error => {
          console.error('Error fetching initial profile:', error);
          setAuth({
            user: null,
            loading: false,
            error: error.message
          });
        });
      } else {
        console.log('No existing session, setting loading to false');
        setAuth(prev => ({ ...prev, loading: false }));
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setAuth({
        user: null,
        loading: false,
        error: error.message
      });
    });

    return () => subscription.unsubscribe();
  }, [mockAuth.isDemo, mockAuth.user]);

  const clearError = () => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  /**
   * Optimistically update user profile data in React state.
   * Returns a rollback function to revert changes if the API call fails.
   *
   * This follows the same pattern as CommunityFeed - just update React state directly.
   * On page refresh, fresh data is always fetched from the API.
   *
   * Usage:
   * const rollback = updateUser({ full_name: 'New Name' });
   * try {
   *   await api.profiles.update(userId, { full_name: 'New Name' });
   *   toast.success('Profile updated!');
   * } catch (error) {
   *   rollback(); // Revert to previous state
   *   toast.error('Update failed');
   * }
   */
  const updateUser = (updates: Partial<UserProfile>): (() => void) => {
    // Store previous state for rollback
    const previousUser = auth.user;

    if (!previousUser) {
      return () => {}; // No-op if no user
    }

    // Create updated user
    const updatedUser: UserProfile = {
      ...previousUser,
      ...updates
    };

    // Update React state only - no localStorage sync needed
    // Fresh data is fetched from API on page load
    setAuth(prev => ({
      ...prev,
      user: updatedUser
    }));

    // Return rollback function
    return () => {
      setAuth(prev => ({
        ...prev,
        user: previousUser
      }));
    };
  };

  /**
   * Refresh user data from the API and update auth state.
   * Call this after profile updates to ensure data is in sync.
   */
  const refreshUser = async (): Promise<void> => {
    // Only works for API-authenticated users
    if (!authApi.isAuthenticated()) {
      return;
    }

    try {
      const apiUser = await authApi.refreshUser();
      if (apiUser) {
        const profile = convertApiUserToProfile(apiUser);
        setAuth(prev => ({
          ...prev,
          user: profile
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return {
    auth,
    signUp,
    signIn,
    signOut,
    clearError,
    updateUser,
    refreshUser
  };
};

export { AuthContext };