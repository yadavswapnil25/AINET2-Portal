import { useQuery, useMutation, useQueryClient } from 'react-query';
import { membershipService } from '../services/membershipService';

/**
 * Hook to fetch membership list with filters
 */
export const useMemberships = (filters = {}) => {
  return useQuery(
    ['memberships', filters],
    () => membershipService.getMembershipList(filters),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error in useMemberships:', error);
      },
    }
  );
};

/**
 * Hook to export memberships
 */
export const useExportMemberships = () => {
  return useMutation(
    (filters) => membershipService.exportMemberships(filters),
    {
      onSuccess: () => {
        console.log('Export successful');
      },
      onError: (error) => {
        console.error('Export failed:', error);
      },
    }
  );
};

/**
 * Hook to update membership
 */
export const useUpdateMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => membershipService.updateMembership(id, data),
    {
      onSuccess: () => {
        // Invalidate and refetch memberships
        queryClient.invalidateQueries('memberships');
      },
      onError: (error) => {
        console.error('Update failed:', error);
      },
    }
  );
};

/**
 * Hook to delete membership (soft delete)
 */
export const useDeleteMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => membershipService.deleteMembership(id),
    {
      onSuccess: () => {
        // Invalidate and refetch memberships
        queryClient.invalidateQueries('memberships');
      },
      onError: (error) => {
        console.error('Delete failed:', error);
      },
    }
  );
};

/**
 * Hook to bulk delete memberships (soft delete)
 */
export const useBulkDeleteMemberships = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (ids) => membershipService.bulkDeleteMemberships(ids),
    {
      onSuccess: () => {
        // Invalidate and refetch memberships
        queryClient.invalidateQueries('memberships');
      },
      onError: (error) => {
        console.error('Bulk delete failed:', error);
      },
    }
  );
};

/**
 * Hook to restore membership
 */
export const useRestoreMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => membershipService.restoreMembership(id),
    {
      onSuccess: () => {
        // Invalidate and refetch memberships and trashed items
        queryClient.invalidateQueries('memberships');
        queryClient.invalidateQueries('trashedMemberships');
      },
      onError: (error) => {
        console.error('Restore failed:', error);
      },
    }
  );
};

/**
 * Hook to fetch trashed memberships
 */
export const useTrashedMemberships = (filters = {}) => {
  return useQuery(
    ['trashedMemberships', filters],
    () => membershipService.getTrashedMemberships(filters),
    {
      keepPreviousData: true,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error in useTrashedMemberships:', error);
      },
    }
  );
};

