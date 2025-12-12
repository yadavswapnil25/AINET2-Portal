import React, { useState, useMemo, useEffect } from 'react';
import { useMemberships, useExportMemberships, useDeleteMembership, useBulkDeleteMemberships, useUpdateMembership } from '../hooks/useMemberships';
import { membershipService } from '../services/membershipService';
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
  Ban,
  Edit,
  Save
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [pageInput, setPageInput] = useState('');

  const { data, isLoading, isError, error, refetch } = useMemberships(appliedFilters);
  const { mutate: exportMemberships, isLoading: isExporting } = useExportMemberships();
  const { mutate: deleteMembership, isLoading: isDeleting } = useDeleteMembership();
  const { mutate: bulkDeleteMemberships, isLoading: isBulkDeleting } = useBulkDeleteMemberships();
  const { mutate: updateMembership, isLoading: isUpdating } = useUpdateMembership();

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

  // Handle page input change
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // Handle page input Enter key
  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput);
      const totalPages = data?.data?.pagination?.last_page || 1;
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        handlePageChange(page);
        setPageInput('');
      } else {
        toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
        setPageInput('');
      }
    }
  };

  // Handle page input blur (click outside)
  const handlePageInputBlur = () => {
    if (pageInput.trim() !== '') {
      const page = parseInt(pageInput);
      const totalPages = data?.data?.pagination?.last_page || 1;
      const currentPage = data?.data?.pagination?.current_page || 1;
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        if (page !== currentPage) {
          handlePageChange(page);
        }
        setPageInput('');
      } else {
        toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
        setPageInput('');
      }
    } else {
      setPageInput('');
    }
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

  const normalizeMembershipData = (membership) => {
    if (!membership) return {};
    
    // Normalize gender value to match dropdown options (capitalize first letter)
    const normalizeGender = (gender) => {
      if (!gender) return null;
      const genderStr = String(gender).toLowerCase();
      if (genderStr === 'male') return 'Male';
      if (genderStr === 'female') return 'Female';
      if (genderStr === 'other') return 'Other';
      // If already capitalized or different format, capitalize first letter
      return genderStr.charAt(0).toUpperCase() + genderStr.slice(1);
    };
    
    // Normalize field names to ensure consistency
    return {
      ...membership,
      // Normalize addMonths field (handle both addMonths and add_months)
      addMonths: membership.addMonths ?? membership.add_months ?? null,
      // Ensure all fields exist even if null/undefined
      m_id: membership.m_id || membership.id || null,
      ref: membership.ref || null,
      title: membership.title || null,
      name: membership.name || null,
      first_name: membership.first_name || null,
      last_name: membership.last_name || null,
      gender: normalizeGender(membership.gender),
      age_groups: membership.age_groups || null,
      email: membership.email || null,
      mobile: membership.mobile || null,
      whatsapp_no: membership.whatsapp_no || null,
      address: membership.address || null,
      state: membership.state || null,
      district: membership.district || null,
      pin: membership.pin || null,
      teaching_exp: membership.teaching_exp || null,
      qualification: membership.qualification || null,
      area_of_work: membership.area_of_work || null,
      membership_type: membership.membership_type || null,
      membership_plan: membership.membership_plan || null,
      member_date: membership.member_date || null,
      has_member_any: membership.has_member_any ?? false,
      name_association: membership.name_association || null,
      expectation: membership.expectation || null,
      has_newsletter: membership.has_newsletter ?? false,
      name_institution: membership.name_institution || null,
      address_institution: membership.address_institution || null,
      type_institution: membership.type_institution || null,
      other_institution: membership.other_institution || null,
      contact_person: membership.contact_person || null,
      status: membership.status !== undefined ? membership.status : 1,
    };
  };

  const handleViewDetails = async (membership) => {
    try {
      // Fetch full membership data to ensure all fields are available
      const response = await membershipService.getMembership(membership.id);
      const fullMembership = response.data?.membership || membership;
      const normalizedMembership = normalizeMembershipData(fullMembership);
      
      setViewDetails(normalizedMembership);
      setFormData(normalizedMembership);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching membership details:', error);
      // Fallback to using the membership from list if API call fails
      const normalizedMembership = normalizeMembershipData(membership);
      setViewDetails(normalizedMembership);
      setFormData(normalizedMembership);
      setIsEditing(false);
      toast.error('Failed to load full membership details. Some fields may be missing.');
    }
  };

  const closeDetailsModal = () => {
    setViewDetails(null);
    setIsEditing(false);
    setFormData({});
  };

  const handleEdit = async () => {
    try {
      // Ensure we have the latest data before editing
      if (viewDetails?.id) {
        const response = await membershipService.getMembership(viewDetails.id);
        const fullMembership = response.data?.membership || viewDetails;
        const normalizedMembership = normalizeMembershipData(fullMembership);
        setViewDetails(normalizedMembership);
        setFormData(normalizedMembership);
      } else {
        const normalizedMembership = normalizeMembershipData(viewDetails);
        setFormData(normalizedMembership);
      }
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching membership for edit:', error);
      // Fallback to using existing viewDetails
      const normalizedMembership = normalizeMembershipData(viewDetails);
      setFormData(normalizedMembership);
      setIsEditing(true);
      toast.error('Failed to load membership data. Some fields may be missing.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(viewDetails);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    updateMembership(
      { id: viewDetails.id, data: formData },
      {
        onSuccess: (response) => {
          toast.success(response.message || 'Membership updated successfully!');
          setViewDetails(response.data?.membership || formData);
          setIsEditing(false);
          refetch();
        },
        onError: (err) => {
          const errorMessage = err?.response?.data?.message || err?.response?.data?.errors?.message || 'Failed to update membership';
          toast.error(errorMessage);
          console.error(err);
        },
      }
    );
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

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === memberships.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(memberships.map((m) => m.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk delete handlers
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one membership to delete');
      return;
    }
    setBulkDeleteConfirm({
      ids: selectedIds,
      count: selectedIds.length
    });
  };

  const confirmBulkDelete = () => {
    if (!bulkDeleteConfirm) return;
    
    bulkDeleteMemberships(bulkDeleteConfirm.ids, {
      onSuccess: (response) => {
        const deletedCount = response.data?.deleted_count || 0;
        const skippedCount = response.data?.skipped_ids?.length || 0;
        let message = `${deletedCount} membership record(s) deleted successfully`;
        if (skippedCount > 0) {
          message += `. ${skippedCount} record(s) were skipped (admin users or your own account cannot be deleted).`;
        }
        toast.success(message);
        setBulkDeleteConfirm(null);
        setSelectedIds([]);
        refetch();
      },
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || 'Failed to delete memberships';
        toast.error(errorMessage);
        console.error(err);
      },
    });
  };

  const cancelBulkDelete = () => {
    setBulkDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Normalize any date value to an ISO yyyy-mm-dd string for <input type="date">
  const formatDateInput = (dateValue) => {
    if (!dateValue) return '';
    const dateObj = new Date(dateValue);
    if (Number.isNaN(dateObj.getTime())) return '';
    // Adjust to local date without time offset affecting the day
    const tzAdjusted = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    return tzAdjusted.toISOString().split('T')[0];
  };

  // Calculate membership status for table display
  const getMembershipStatus = (membership) => {
    if (!membership) return { status: 'inactive', label: 'Inactive' };

    // Check if member is blocked (status = 0)
    const isBlocked = membership.status === 0 || membership.status === '0' || membership.status === false;
    if (isBlocked) {
      return { status: 'disabled', label: 'Disabled' };
    }

    // Check if member has membership ID
    if (!membership.m_id) {
      return { status: 'inactive', label: 'Inactive' };
    }

    // Calculate expiry date: member_date + addMonths (requires member_date)
    const memberDate = membership.member_date ? new Date(membership.member_date) : null;

    if (!memberDate) {
      return { status: 'inactive', label: 'Inactive' };
    }

    const addMonths = membership.addMonths ?? membership.add_months ?? 12;
    
    // Calculate expiry date
    const expiryDate = new Date(memberDate);
    expiryDate.setMonth(expiryDate.getMonth() + addMonths);
    
    // Get the last day of the expiry month
    const lastDayOfMonth = new Date(expiryDate.getFullYear(), expiryDate.getMonth() + 1, 0).getDate();
    expiryDate.setDate(lastDayOfMonth);
    expiryDate.setHours(memberDate.getHours(), memberDate.getMinutes(), memberDate.getSeconds());
    
    // Check if membership is still valid
    const now = new Date();
    const isValid = now <= expiryDate;
    
    return {
      status: isValid ? 'active' : 'inactive',
      label: isValid ? 'Active' : 'Inactive'
    };
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

    const { formattedDate, months } = calculateMembershipValidity(viewDetails.member_date, monthsValue);
    if (!formattedDate) return '-';

    if (months !== null && Number.isFinite(months) && months > 0) {
      const roundedMonths = Number.isInteger(months) ? months : Number(months.toFixed(2));
      return `${formattedDate} (${roundedMonths} month${roundedMonths === 1 ? '' : 's'})`;
    }

    return formattedDate;
  }, [viewDetails]);

  // Calculate membership status based on member_date + addMonths (same logic as DRF discount validation)
  const calculateMembershipStatus = useMemo(() => {
    // Use formData when editing, otherwise use viewDetails
    const data = isEditing && Object.keys(formData).length > 0 ? formData : viewDetails;
    
    if (!data) return { status: 'inactive', label: 'Inactive', expiryDate: null };

    // Check if member is blocked (status = 0)
    const isBlocked = data.status === 0 || data.status === '0' || data.status === false;
    if (isBlocked) {
      return { status: 'blocked', label: 'Blocked', expiryDate: null };
    }

    // Check if member has membership ID
    if (!data.m_id) {
      return { status: 'inactive', label: 'Inactive', expiryDate: null };
    }

    // Calculate expiry date: member_date + addMonths (requires member_date)
    const memberDate = data.member_date ? new Date(data.member_date) : null;

    if (!memberDate) {
      return { status: 'inactive', label: 'Inactive', expiryDate: null };
    }

    const addMonths = data.addMonths ?? data.add_months ?? 12; // Default to 12 months if not set
    
    // Calculate expiry date: add months and set to last day of that month with original time
    const expiryDate = new Date(memberDate);
    expiryDate.setMonth(expiryDate.getMonth() + addMonths);
    
    // Get the last day of the expiry month
    const lastDayOfMonth = new Date(expiryDate.getFullYear(), expiryDate.getMonth() + 1, 0).getDate();
    
    // Set to last day of month but keep original time
    expiryDate.setDate(lastDayOfMonth);
    expiryDate.setHours(memberDate.getHours(), memberDate.getMinutes(), memberDate.getSeconds());
    
    // Check if membership is still valid
    const now = new Date();
    const isValid = now <= expiryDate;
    
    return {
      status: isValid ? 'active' : 'inactive',
      label: isValid ? 'Active' : 'Inactive',
      expiryDate: expiryDate
    };
  }, [viewDetails, formData, isEditing]);

  const statusIconMap = {
    active: { icon: CheckCircle2, color: 'text-green-300', bg: 'bg-green-500/10' },
    inactive: { icon: XCircle, color: 'text-yellow-300', bg: 'bg-yellow-500/10' },
    blocked: { icon: Ban, color: 'text-red-300', bg: 'bg-red-500/10' },
  };

  const statusMeta = statusIconMap[calculateMembershipStatus.status] || statusIconMap.inactive;
  const StatusIcon = statusMeta.icon;
  const statusLabel = calculateMembershipStatus.label;

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

  // Clear selection when memberships change
  useEffect(() => {
    setSelectedIds([]);
  }, [memberships]);

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
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 shadow-md"
              >
                <Trash2 className="mr-2" size={18} />
                Delete Selected ({selectedIds.length})
              </button>
            )}
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
                        <input
                          type="checkbox"
                          checked={memberships.length > 0 && selectedIds.length === memberships.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </th>
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberships.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(membership.id)}
                              onChange={() => toggleSelect(membership.id)}
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {membership.m_id || membership.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewDetails(membership)}
                              className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                            >
                              {membership.name || `${membership.first_name || ''} ${membership.last_name || ''}`.trim() || '-'}
                            </button>
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
                            {(() => {
                              const membershipStatus = getMembershipStatus(membership);
                              return (
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  membershipStatus.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : membershipStatus.status === 'disabled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {membershipStatus.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(membership.member_date)}
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
                    <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Go to page:</span>
                        <input
                          type="number"
                          min="1"
                          max={pagination?.last_page || 1}
                          value={pageInput}
                          onChange={handlePageInputChange}
                          onKeyPress={handlePageInputKeyPress}
                          onBlur={handlePageInputBlur}
                          placeholder={pagination?.current_page?.toString() || '1'}
                          className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <span className="text-sm text-gray-500">of {pagination?.last_page || 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bulk Delete Confirmation Modal */}
        {bulkDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Memberships</h3>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete {bulkDeleteConfirm.count} membership record(s)?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This will move the selected memberships to trash. You can restore them later if needed.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelBulkDelete}
                  disabled={isBulkDeleting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  disabled={isBulkDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400 flex items-center"
                >
                  {isBulkDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete {bulkDeleteConfirm.count} Record(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
                        {(isEditing ? formData.name : viewDetails.name) || `${(isEditing ? formData.first_name : viewDetails.first_name) || ''} ${(isEditing ? formData.last_name : viewDetails.last_name) || ''}`.trim()}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                          calculateMembershipStatus.status === 'active'
                            ? 'bg-green-500/20 text-green-100 border border-green-300/30'
                            : calculateMembershipStatus.status === 'blocked'
                            ? 'bg-red-500/20 text-red-100 border border-red-300/30'
                            : 'bg-yellow-500/20 text-yellow-100 border border-yellow-300/30'
                        }`}>
                          <StatusIcon size={14} className={
                            calculateMembershipStatus.status === 'active'
                              ? 'text-green-200'
                              : calculateMembershipStatus.status === 'blocked'
                              ? 'text-red-200'
                              : 'text-yellow-200'
                          } />
                          {statusLabel}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeDetailsModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Member ID</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="m_id"
                          value={formData.m_id || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.m_id || viewDetails.id || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Reference ID</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="ref"
                          value={formData.ref || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.ref || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.title || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.first_name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.last_name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{formatTitleCase(viewDetails.gender) || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Age Groups</label>
                      {isEditing ? (
                        <select
                          name="age_groups"
                          value={formData.age_groups || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Age Group</option>
                          <option value="up to 25">up to 25</option>
                          <option value="26-30">26-30</option>
                          <option value="31-35">31-35</option>
                          <option value="36-40">36-40</option>
                          <option value="41-45">41-45</option>
                          <option value="46-50">46-50</option>
                          <option value="Over 50">Over 50</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.age_groups || '-'}</p>
                      )}
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 flex items-center">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {viewDetails.email || '-'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Mobile</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="mobile"
                          value={formData.mobile || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {viewDetails.mobile || '-'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">WhatsApp</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="whatsapp_no"
                          value={formData.whatsapp_no || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {viewDetails.whatsapp_no || '-'}
                        </p>
                      )}
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Address</label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.address || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.state || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">District</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="district"
                          value={formData.district || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.district || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">PIN Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pin"
                          value={formData.pin || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.pin || '-'}</p>
                      )}
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Membership Type</label>
                      {isEditing ? (
                        <select
                          name="membership_type"
                          value={formData.membership_type || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Type</option>
                          <option value="Individual">Individual</option>
                          <option value="Institutional">Institutional</option>
                        </select>
                      ) : (
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
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Membership Plan</label>
                      {isEditing ? (
                        <select
                          name="membership_plan"
                          value={formData.membership_plan || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Plan</option>
                          <option value="Annual">Annual</option>
                          <option value="LongTerm">Long Term</option>
                          <option value="Overseas">Overseas</option>
                        </select>
                      ) : (
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
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Membership Renewal Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="member_date"
                          value={formatDateInput(formData.member_date)}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.member_date ? formatDate(viewDetails.member_date) : '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Add Months</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="addMonths"
                          value={formData.addMonths ?? formData.add_months ?? ''}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.addMonths ?? viewDetails.add_months ?? '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Status (Block/Unblock)</label>
                      {isEditing ? (
                        <select
                          name="status"
                          value={formData.status !== undefined ? formData.status : 1}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value={1}>Active (Unblocked)</option>
                          <option value={0}>Blocked</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">
                          {viewDetails.status === 0 || viewDetails.status === '0' ? 'Blocked' : 'Active'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Membership Status (Calculated)</label>
                      <p className="text-sm">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          calculateMembershipStatus.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : calculateMembershipStatus.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <StatusIcon size={14} className={
                            calculateMembershipStatus.status === 'active'
                              ? 'text-green-600'
                              : calculateMembershipStatus.status === 'blocked'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          } />
                          {statusLabel}
                        </span>
                      </p>
                      {calculateMembershipStatus.expiryDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {formatDate(calculateMembershipStatus.expiryDate.toISOString())}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Member of Other Association</label>
                      {isEditing ? (
                        <select
                          name="has_member_any"
                          value={formData.has_member_any ? '1' : '0'}
                          onChange={(e) => setFormData(prev => ({ ...prev, has_member_any: e.target.value === '1' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.has_member_any ? 'Yes' : 'No'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Association Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name_association"
                          value={formData.name_association || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.name_association || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Newsletter Subscription</label>
                      {isEditing ? (
                        <select
                          name="has_newsletter"
                          value={formData.has_newsletter ? '1' : '0'}
                          onChange={(e) => setFormData(prev => ({ ...prev, has_newsletter: e.target.value === '1' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.has_newsletter ? 'Yes' : 'No'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Expectations</label>
                      {isEditing ? (
                        <textarea
                          name="expectation"
                          value={formData.expectation || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.expectation || '-'}</p>
                      )}
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Teaching Experience (Years)</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="teaching_exp"
                          value={formData.teaching_exp || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{viewDetails.teaching_exp || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Qualification</label>
                      {isEditing ? (
                        <select
                          name="qualification"
                          value={(() => {
                            // Handle array format - get first value if array, otherwise use string value
                            if (Array.isArray(formData.qualification)) {
                              return formData.qualification[0] || '';
                            }
                            if (typeof formData.qualification === 'string') {
                              try {
                                const parsed = JSON.parse(formData.qualification);
                                return Array.isArray(parsed) ? (parsed[0] || '') : formData.qualification;
                              } catch {
                                return formData.qualification;
                              }
                            }
                            return formData.qualification || '';
                          })()}
                          onChange={(e) => {
                            // Store as array format for consistency with API
                            setFormData(prev => ({
                              ...prev,
                              qualification: e.target.value ? [e.target.value] : []
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Qualification</option>
                          <option value="B.Ed">B.Ed</option>
                          <option value="D.Ed">D.Ed</option>
                          <option value="M.Ed">M.Ed</option>
                          <option value="CELTA/DELTA/TTS">CELTA/DELTA/TTS</option>
                          <option value="PGCTE">PGCTE</option>
                          <option value="PGDTE">PGDTE</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{formatQualification(viewDetails.qualification)}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Area of Work</label>
                      {isEditing ? (
                        <select
                          name="area_of_work"
                          value={(() => {
                            // Handle array format - get first value if array, otherwise use string value
                            if (Array.isArray(formData.area_of_work)) {
                              return formData.area_of_work[0] || '';
                            }
                            if (typeof formData.area_of_work === 'string') {
                              try {
                                const parsed = JSON.parse(formData.area_of_work);
                                return Array.isArray(parsed) ? (parsed[0] || '') : formData.area_of_work;
                              } catch {
                                return formData.area_of_work;
                              }
                            }
                            return formData.area_of_work || '';
                          })()}
                          onChange={(e) => {
                            // Store as array format for consistency with API
                            setFormData(prev => ({
                              ...prev,
                              area_of_work: e.target.value ? [e.target.value] : []
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="">Select Area of Work</option>
                          <option value="Primary School">Primary School</option>
                          <option value="Secondary School">Secondary School</option>
                          <option value="Junior College (+2)">Junior College (+2)</option>
                          <option value="Senior College/University">Senior College/University</option>
                          <option value="Teacher Education">Teacher Education</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">{formatAreaOfWork(viewDetails.area_of_work)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Institution Information (if Institutional) */}
                {(viewDetails.membership_type === 'Institutional' || (isEditing && formData.membership_type === 'Institutional')) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="mr-2 text-teal-600" size={20} />
                      Institution Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Institution Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name_institution"
                            value={formData.name_institution || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{viewDetails.name_institution || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Institution Type</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="type_institution"
                            value={formData.type_institution || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{viewDetails.type_institution || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Other Type</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="other_institution"
                            value={formData.other_institution || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{viewDetails.other_institution || '-'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Institution Address</label>
                        {isEditing ? (
                          <textarea
                            name="address_institution"
                            value={formData.address_institution || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{viewDetails.address_institution || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Contact Person</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="contact_person"
                            value={formData.contact_person || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{viewDetails.contact_person || '-'}</p>
                        )}
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Created At</label>
                      <p className="text-sm text-gray-900">{formatDate(viewDetails.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Last Updated</label>
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

