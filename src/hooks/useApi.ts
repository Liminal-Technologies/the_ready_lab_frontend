/**
 * React hooks for the TRL API client
 *
 * Provides convenient hooks for API operations with loading/error states.
 */

import { useState, useCallback } from 'react';
import { api } from '@/services/api';

// ============================================================================
// Types
// ============================================================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseMutationReturn<T, P extends unknown[]> {
  mutate: (...args: P) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

// ============================================================================
// useApiQuery Hook
// ============================================================================

/**
 * Hook for fetching data from the API
 *
 * @example
 * const { data, loading, error, refetch } = useApiQuery(
 *   () => api.profiles.get(userId),
 *   [userId]
 * );
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options?: { enabled?: boolean }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options?.enabled !== false,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (options?.enabled === false) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await queryFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, deps);

  // Initial fetch
  useState(() => {
    if (options?.enabled !== false) {
      fetch();
    }
  });

  return {
    ...state,
    refetch: fetch,
  };
}

// ============================================================================
// useMutation Hook
// ============================================================================

/**
 * Hook for mutating data via the API
 *
 * @example
 * const { mutate, loading, error } = useMutation(
 *   (data) => api.profiles.update(userId, data)
 * );
 *
 * // Usage
 * await mutate({ full_name: 'New Name' });
 */
export function useMutation<T, P extends unknown[]>(
  mutationFn: (...args: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseMutationReturn<T, P> {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (...args: P): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await mutationFn(...args);
      setState({ data, loading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, loading: false, error: err }));
      options?.onError?.(err);
      throw err;
    }
  }, [mutationFn, options?.onSuccess, options?.onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

// ============================================================================
// Pre-built Hooks for Common Operations
// ============================================================================

/**
 * Hook for fetching user profile
 */
export function useProfile(userId: string | undefined) {
  return useApiQuery(
    () => api.profiles.get(userId!),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile(userId: string) {
  return useMutation(
    (data: Parameters<typeof api.profiles.update>[1]) =>
      api.profiles.update(userId, data)
  );
}

/**
 * Hook for fetching user enrollments
 */
export function useEnrollments(userId: string | undefined) {
  return useApiQuery(
    () => api.enrollments.list(userId),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching tracks
 */
export function useTracks(params?: Parameters<typeof api.tracks.list>[0]) {
  return useApiQuery(
    () => api.tracks.list(params),
    [params?.category, params?.level, params?.is_active]
  );
}

/**
 * Hook for fetching a single track
 */
export function useTrack(trackId: string | undefined) {
  return useApiQuery(
    () => api.tracks.get(trackId!),
    [trackId],
    { enabled: !!trackId }
  );
}

/**
 * Hook for fetching modules for a track
 */
export function useModules(trackId: string | undefined) {
  return useApiQuery(
    () => api.modules.list(trackId!),
    [trackId],
    { enabled: !!trackId }
  );
}

/**
 * Hook for fetching lessons for a module
 */
export function useLessons(moduleId: string | undefined) {
  return useApiQuery(
    () => api.lessons.list(moduleId!),
    [moduleId],
    { enabled: !!moduleId }
  );
}

/**
 * Hook for fetching user certifications
 */
export function useCertifications(userId: string | undefined) {
  return useApiQuery(
    () => api.certifications.list(userId!),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching communities
 */
export function useCommunities(params?: Parameters<typeof api.communities.list>[0]) {
  return useApiQuery(
    () => api.communities.list(params),
    [params?.visibility]
  );
}

/**
 * Hook for fetching a single community
 */
export function useCommunity(communityId: string | undefined) {
  return useApiQuery(
    () => api.communities.get(communityId!),
    [communityId],
    { enabled: !!communityId }
  );
}

/**
 * Hook for fetching community members
 */
export function useCommunityMembers(communityId: string | undefined) {
  return useApiQuery(
    () => api.communities.members.list(communityId!),
    [communityId],
    { enabled: !!communityId }
  );
}

/**
 * Hook for fetching posts in a community
 */
export function usePosts(communityId: string | undefined) {
  return useApiQuery(
    () => api.posts.list(communityId!),
    [communityId],
    { enabled: !!communityId }
  );
}

/**
 * Hook for fetching live events
 */
export function useLiveEvents(params?: Parameters<typeof api.liveEvents.list>[0]) {
  return useApiQuery(
    () => api.liveEvents.list(params),
    [params?.host_id, params?.status]
  );
}

/**
 * Hook for fetching user bookmarks
 */
export function useBookmarks(userId: string | undefined) {
  return useApiQuery(
    () => api.bookmarks.list(userId!),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching user notifications
 */
export function useNotifications(userId: string | undefined, unreadOnly?: boolean) {
  return useApiQuery(
    () => api.notifications.list(userId!, unreadOnly),
    [userId, unreadOnly],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching user subscription
 */
export function useSubscription(userId: string | undefined) {
  return useApiQuery(
    () => api.subscriptions.get(userId!),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching subscription plans
 */
export function useSubscriptionPlans() {
  return useApiQuery(
    () => api.subscriptions.plans.list(),
    []
  );
}

/**
 * Hook for fetching user purchases
 */
export function usePurchases(userId: string | undefined) {
  return useApiQuery(
    () => api.purchases.list(userId!),
    [userId],
    { enabled: !!userId }
  );
}

/**
 * Hook for fetching products
 */
export function useProducts(params?: Parameters<typeof api.products.list>[0]) {
  return useApiQuery(
    () => api.products.list(params),
    [params?.created_by, params?.is_active]
  );
}

/**
 * Hook for checking API health
 */
export function useApiHealth() {
  return useApiQuery(() => api.health(), []);
}

// Re-export api for direct access when needed
export { api };
