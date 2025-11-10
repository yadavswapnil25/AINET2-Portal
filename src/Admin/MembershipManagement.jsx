import React, { useState, useMemo } from 'react';
import { useMemberships, useExportMemberships, useDeleteMembership } from '../hooks/useMemberships';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Trash2,
  Eye,
  X,
  User,
  CreditCard,
  Building,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Ban
} from 'lucide-react';
import { formatTitleCase, calculateMembershipValidity, formatQualification, formatAreaOfWork } from '../utils/formatters';

const MembershipManagement = () => {
  // API filters (triggers refetch when changed)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    membership_type: '',
    membership_plan: '',
    state: '',
    start_date: '',
    end_date: '',
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
  });

  // Local form state (doesn't trigger API calls)
  const [filters, setFilters] = useState({ ...appliedFilters });

  const [showFilters, setShowFilters] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  const { data, isLoading, isError, error, refetch } = useMemberships(appliedFilters);
  const { mutate: exportMemberships, isLoading: isExporting } = useExportMemberships();
  const { mutate: deleteMembership, isLoading: isDeleting } = useDeleteMembership();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update local form state only (no API call)
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Apply filters to trigger API call
    setAppliedFilters({ ...filters, page: 1 });
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      membership_type: '',
      membership_plan: '',
      state: '',
      start_date: '',
      end_date: '',
      per_page: 15,
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const handlePageChange = (page) => {
    setAppliedFilters(prev => ({ ...prev, page }));
  };

  const handleExport = () => {
    const exportFilters = { ...appliedFilters };
    delete exportFilters.page;
    delete exportFilters.per_page;
    
    exportMemberships(exportFilters, {
      onSuccess: () => {
        toast.success('Memberships exported successfully!');
      },
      onError: (err) => {
        toast.error('Failed to export memberships');
        console.error(err);
      },
    });
  };

  const handleDelete = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const handleViewDetails = (membership) => {
    setViewDetails(membership);
  };

  const closeDetailsModal = () => {
    setViewDetails(null);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    
    deleteMembership(deleteConfirm.id, {
      onSuccess: (response) => {
        toast.success(response.message || 'Membership deleted successfully!');
        setDeleteConfirm(null);
      },
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.errors?.message || 'Failed to delete membership';
        toast.error(errorMessage);
        console.error(err);
      },
    });
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const membershipValidityText = useMemo(() => {
    if (!viewDetails) return '-';

    const monthsValue =
      viewDetails.addMonths ??
      viewDetails.add_months ??
      viewDetails.membership_validity_months ??
      viewDetails.membership_duration_months ??
      viewDetails.validity_months ??
      viewDetails.duration_months;

    const { formattedDate, months } = calculateMembershipValidity(viewDetails.created_at, monthsValue);
    if (!formattedDate) return '-';

    if (months !== null && Number.isFinite(months) && months > 0) {
      const roundedMonths = Number.isInteger(months) ? months : Number(months.toFixed(2));
      return `${formattedDate} (${roundedMonths} month${roundedMonths === 1 ? '' : 's'})`;
    }

    return formattedDate;
  }, [viewDetails]);

  const statusIconMap = {
    active: { icon: CheckCircle2, color: 'text-green-300', bg: 'bg-green-500/10' },
    inactive: { icon: XCircle, color: 'text-yellow-300', bg: 'bg-yellow-500/10' },
    blocked: { icon: Ban, color: 'text-red-300', bg: 'bg-red-500/10' },
  };
 
  const rawStatus = viewDetails?.status ?? viewDetails?.membership_status ?? '';
  const normalizedStatus = typeof rawStatus === 'string' ? rawStatus : String(rawStatus ?? '');
  const resolvedStatus = normalizedStatus.trim().toLowerCase();

  const statusMeta = statusIconMap[resolvedStatus] || statusIconMap.inactive;
  const StatusIcon = statusMeta.icon;

  const statusLabel = resolvedStatus
    ? resolvedStatus.charAt(0).toUpperCase() + resolvedStatus.slice(1)
    : 'Inactive';

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800">Error Loading Memberships</h3>
              <p className="text-sm text-red-700 mt-2">
                {error?.response?.data?.message || error?.message || 'Unable to load membership data. Please try again.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberships = data?.data?.memberships || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 text-teal-600" size={32} />
              Membership Management
            </h1>
            <p className="text-gray-600 mt-2">View and manage all membership records</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 shadow-md"
            >
              <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={18} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 shadow-md"
            >
              <Download className="mr-2" size={18} />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {pagination.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pagination.total}</p>
                </div>
                <div className="p-3 rounded-full bg-teal-100">
                  <Users className="text-teal-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Current Page</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pagination.current_page}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pagination.last_page}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Filter className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Per Page</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pagination.per_page}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Download className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="mr-2 text-teal-600" size={20} />
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleInputChange}
                      placeholder="Name, email, mobile..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Membership Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Type
                  </label>
                  <select
                    name="membership_type"
                    value={filters.membership_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Types</option>
                    <option value="Individual">Individual</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>

                {/* Membership Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Plan
                  </label>
                  <select
                    name="membership_plan"
                    value={filters.membership_plan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Plans</option>
                    <option value="Annual">Annual</option>
                    <option value="LongTerm">Long Term</option>
                    <option value="Overseas">Overseas</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={filters.state}
                    onChange={handleInputChange}
                    placeholder="e.g., Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Per Page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Page
                  </label>
                  <select
                    name="per_page"
                    value={filters.per_page}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    name="sort_by"
                    value={filters.sort_by}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="membership_type">Type</option>
                    <option value="state">State</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading memberships...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberships.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Users className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-500">No memberships found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      memberships.map((membership) => (
                        <tr key={membership.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {membership.m_id || membership.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {membership.name || `${membership.first_name || ''} ${membership.last_name || ''}`.trim() || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail size={14} className="mr-2 text-gray-400" />
                              {membership.email || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone size={14} className="mr-2 text-gray-400" />
                              {membership.mobile || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              membership.membership_type === 'Individual' 
                                ? 'bg-blue-100 text-blue-800' 
                                : membership.membership_type === 'Institutional'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {membership.membership_type || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              membership.membership_plan === 'Annual' 
                                ? 'bg-green-100 text-green-800' 
                                : membership.membership_plan === 'LongTerm'
                                ? 'bg-teal-100 text-teal-800'
                                : membership.membership_plan === 'Overseas'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {membership.membership_plan || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin size={14} className="mr-2 text-gray-400" />
                              {membership.state || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(membership.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(membership)}
                                className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium"
                                title="View details"
                              >
                                <Eye size={16} className="mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(membership.id, membership.name || membership.email)}
                                className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
                                title="Delete membership"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total > 0 && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
                        <span className="font-medium">{pagination.to || 0}</span> of{' '}
                        <span className="font-medium">{pagination.total || 0}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Membership</h3>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this membership?
              </p>
              <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded mb-4">
                {deleteConfirm.name}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This will move the membership to trash. You can restore it later if needed.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {viewDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Membership Details</h2>
                    <p className="text-teal-100 text-sm mt-1">
                      <span className="flex items-center gap-2">
                        {viewDetails.name || `${viewDetails.first_name || ''} ${viewDetails.last_name || ''}`.trim()}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusMeta.bg} text-white`}>
                          <StatusIcon size={14} className={statusMeta.color} />
                          {statusLabel}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2 text-teal-600" size={20} />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Member ID</label>
                      <p className="text-sm text-gray-900 font-medium">{viewDetails.m_id || viewDetails.id || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Reference ID</label>
                      <p className="text-sm text-gray-900 font-medium">{viewDetails.ref || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Title</label>
                      <p className="text-sm text-gray-900">{viewDetails.title || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900 font-medium">{viewDetails.name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">First Name</label>
                      <p className="text-sm text-gray-900">{viewDetails.first_name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Last Name</label>
                      <p className="text-sm text-gray-900">{viewDetails.last_name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{formatTitleCase(viewDetails.gender) || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                      <p className="text-sm text-gray-900">{viewDetails.dob || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="mr-2 text-teal-600" size={20} />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900 font-medium flex items-center">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {viewDetails.email || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Mobile</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {viewDetails.mobile || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">WhatsApp</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {viewDetails.whatsapp_no || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="mr-2 text-teal-600" size={20} />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{viewDetails.address || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">State</label>
                      <p className="text-sm text-gray-900">{viewDetails.state || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">District</label>
                      <p className="text-sm text-gray-900">{viewDetails.district || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">PIN Code</label>
                      <p className="text-sm text-gray-900">{viewDetails.pin || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Membership Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="mr-2 text-teal-600" size={20} />
                    Membership Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Membership Type</label>
                      <p className="text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          viewDetails.membership_type === 'Individual' 
                            ? 'bg-blue-100 text-blue-800' 
                            : viewDetails.membership_type === 'Institutional'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {viewDetails.membership_type || '-'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Membership Plan</label>
                      <p className="text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          viewDetails.membership_plan === 'Annual' 
                            ? 'bg-green-100 text-green-800' 
                            : viewDetails.membership_plan === 'LongTerm'
                            ? 'bg-teal-100 text-teal-800'
                            : viewDetails.membership_plan === 'Overseas'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {viewDetails.membership_plan || '-'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Membership Validity</label>
                      <p className="text-sm text-gray-900">{membershipValidityText}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Member of Other Association</label>
                      <p className="text-sm text-gray-900">{viewDetails.has_member_any ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Association Name</label>
                      <p className="text-sm text-gray-900">{viewDetails.name_association || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Newsletter Subscription</label>
                      <p className="text-sm text-gray-900">{viewDetails.has_newsletter ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Expectations</label>
                      <p className="text-sm text-gray-900">{viewDetails.expectation || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="mr-2 text-teal-600" size={20} />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Teaching Experience (Years)</label>
                      <p className="text-sm text-gray-900">{viewDetails.teaching_exp || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Qualification</label>
                      <p className="text-sm text-gray-900">{formatQualification(viewDetails.qualification)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500">Area of Work</label>
                      <p className="text-sm text-gray-900">{formatAreaOfWork(viewDetails.area_of_work)}</p>
                    </div>
                  </div>
                </div>

                {/* Institution Information (if Institutional) */}
                {viewDetails.membership_type === 'Institutional' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="mr-2 text-teal-600" size={20} />
                      Institution Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Institution Name</label>
                        <p className="text-sm text-gray-900 font-medium">{viewDetails.name_institution || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Institution Type</label>
                        <p className="text-sm text-gray-900">{viewDetails.type_institution || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Other Type</label>
                        <p className="text-sm text-gray-900">{viewDetails.other_institution || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Institution Address</label>
                        <p className="text-sm text-gray-900">{viewDetails.address_institution || '-'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Contact Person</label>
                        <p className="text-sm text-gray-900">{viewDetails.contact_person || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="mr-2 text-teal-600" size={20} />
                    Registration Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Created At</label>
                      <p className="text-sm text-gray-900">{formatDate(viewDetails.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">{formatDate(viewDetails.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeDetailsModal();
                    handleDelete(viewDetails.id, viewDetails.name || viewDetails.email);
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipManagement;

