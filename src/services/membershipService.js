import apiClient from '../utils/api';

export const membershipService = {
  /**
   * Get paginated membership list with filters
   */
  getMembershipList: async (params = {}) => {
    try {
      const response = await apiClient.get('/client/admin/memberships', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    }
  },

  /**
   * Export membership data as CSV
   */
  exportMemberships: async (params = {}) => {
    try {
      const response = await apiClient.get('/client/admin/memberships/export', {
        params,
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `memberships_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error('Error exporting memberships:', error);
      throw error;
    }
  },

  /**
   * Soft delete membership record
   */
  deleteMembership: async (id) => {
    try {
      const response = await apiClient.delete(`/client/admin/memberships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership:', error);
      throw error;
    }
  },

  /**
   * Bulk delete membership records (soft delete)
   */
  bulkDeleteMemberships: async (ids = []) => {
    try {
      const response = await apiClient.post('/client/admin/memberships/bulk', {
        data: { ids }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting memberships:', error);
      throw error;
    }
  },

  /**
   * Restore soft deleted membership record
   */
  restoreMembership: async (id) => {
    try {
      const response = await apiClient.post(`/client/admin/memberships/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring membership:', error);
      throw error;
    }
  },

  /**
   * Get trashed (soft deleted) memberships
   */
  getTrashedMemberships: async (params = {}) => {
    try {
      const response = await apiClient.get('/client/admin/memberships/trashed', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trashed memberships:', error);
      throw error;
    }
  },
};

