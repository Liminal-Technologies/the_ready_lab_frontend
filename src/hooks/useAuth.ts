import { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile, AuthState } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useMockAuth, convertMockUserToProfile } from './useMockAuth';

const AuthContext = createContext<{
  auth: AuthState;
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
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
        full_name: (profile as any).full_name,
        created_at: (profile as any).created_at,
        subscription_status: (profile as any).subscription_status,
        subscription_tier: (profile as any).subscription_tier,
        avatar_url: (profile as any).avatar_url,
        admin_roles: (adminRoles || []).map((role: any) => ({
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
        
        // If email confirmation is required, data.session will be null
        // Profile will be created after email confirmation
        // Just set loading to false and let the SignupForm show the confirmation screen
        setAuth({
          user: null,
          loading: false,
          error: null
        });
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

  return {
    auth,
    signUp,
    signIn,
    signOut,
    clearError
  };
};

export { AuthContext };