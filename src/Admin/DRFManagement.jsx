import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  Filter,
  Mail,
  Phone,
  Plus,
  Download,
  Trash2,
  Edit,
} from 'lucide-react';
import { drfAPI } from '../utils/api';
import { useDebounce } from '../utils/useDebounce';
import ConfirmModal from '../components/ConfirmModal';

const DRFManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [drfs, setDrfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Filter and sort state - initialize from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');
  const [appliedStartDate, setAppliedStartDate] = useState(searchParams.get('start_date') || '');
  const [appliedEndDate, setAppliedEndDate] = useState(searchParams.get('end_date') || '');
  const [conferenceFilter, setConferenceFilter] = useState(searchParams.get('conference_filter') || '9th_conference');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(searchParams.get('payment_status') || 'all');
  const [pageInput, setPageInput] = useState('');

  // Fetch DRF records
  const fetchDRFs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await drfAPI.getDRFs({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        start_date: appliedStartDate,
        end_date: appliedEndDate,
        conference_filter: conferenceFilter,
        payment_status: paymentStatusFilter,
      });

      if (response.status) {
        setDrfs(response.data.drfs);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching DRFs:', error);
      toast.error('Failed to load DRF records');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, debouncedSearchTerm, sortBy, sortOrder, appliedStartDate, appliedEndDate, conferenceFilter, paymentStatusFilter]);

  // Handle view
  const handleView = (id) => {
    // Preserve query parameters when navigating to view/edit
    const params = new URLSearchParams();
    if (conferenceFilter && conferenceFilter !== '9th_conference') {
      params.set('conference_filter', conferenceFilter);
    }
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      params.set('payment_status', paymentStatusFilter);
    }
    if (appliedStartDate) {
      params.set('start_date', appliedStartDate);
    }
    if (appliedEndDate) {
      params.set('end_date', appliedEndDate);
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (sortBy && sortBy !== 'created_at') {
      params.set('sort_by', sortBy);
    }
    if (sortOrder && sortOrder !== 'desc') {
      params.set('sort_order', sortOrder);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    const queryString = params.toString();
    navigate(`/admin/drfs/${id}${queryString ? `?${queryString}` : ''}`);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await drfAPI.exportDRFs({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        start_date: appliedStartDate,
        end_date: appliedEndDate,
        conference_filter: conferenceFilter,
        payment_status: paymentStatusFilter,
        selected_ids: selectedIds.length > 0 ? selectedIds : undefined, // Export selected records if any, otherwise export filtered records
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      const contentDisposition = response.headers['content-disposition'] || '';
      const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
      const filename = (match && (decodeURIComponent(match[1] || match[2]))) || `drf_export_${ts}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export records');
    }
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === drfs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(drfs.map((d) => d.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // Clear selection when data changes
    setSelectedIds([]);
  }, [drfs]);

  const requestDelete = (ids) => {
    const count = Array.isArray(ids) ? ids.length : 1;
    const idsArr = Array.isArray(ids) ? ids : [ids];
    setConfirmState({
      open: true,
      ids: idsArr,
      message: `Delete ${count} record${count > 1 ? 's' : ''}? This action cannot be undone.`,
      confirming: false,
    });
  };

  const confirmDelete = async () => {
    const ids = confirmState.ids;
    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (ids.length === 1) {
        res = await drfAPI.deleteDRF(ids[0]);
      } else {
        res = await drfAPI.bulkDeleteDRFs(ids);
      }
      if (res.status) {
        toast.success(ids.length === 1 ? 'Deleted successfully' : 'Selected records deleted');
        setSelectedIds([]);
        fetchDRFs();
      } else {
        toast.error('Delete failed');
      }
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    } finally {
      setConfirmState({ open: false, ids: [], message: '', confirming: false });
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    requestDelete(selectedIds);
  };

  // Sync state from URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    const urlConferenceFilter = searchParams.get('conference_filter') || '9th_conference';
    const urlPaymentStatusFilter = searchParams.get('payment_status') || 'all';
    const urlStartDate = searchParams.get('start_date') || '';
    const urlEndDate = searchParams.get('end_date') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSortBy = searchParams.get('sort_by') || 'created_at';
    const urlSortOrder = searchParams.get('sort_order') || 'desc';
    const urlPage = parseInt(searchParams.get('page')) || 1;

    if (urlConferenceFilter !== conferenceFilter) {
      setConferenceFilter(urlConferenceFilter);
    }
    if (urlPaymentStatusFilter !== paymentStatusFilter) {
      setPaymentStatusFilter(urlPaymentStatusFilter);
    }
    if (urlStartDate !== appliedStartDate) {
      setAppliedStartDate(urlStartDate);
      setStartDate(urlStartDate);
    }
    if (urlEndDate !== appliedEndDate) {
      setAppliedEndDate(urlEndDate);
      setEndDate(urlEndDate);
    }
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    if (urlSortBy !== sortBy) {
      setSortBy(urlSortBy);
    }
    if (urlSortOrder !== sortOrder) {
      setSortOrder(urlSortOrder);
    }
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDRFs();
  }, [fetchDRFs]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (conferenceFilter && conferenceFilter !== '9th_conference') {
      params.set('conference_filter', conferenceFilter);
    }
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      params.set('payment_status', paymentStatusFilter);
    }
    if (appliedStartDate) {
      params.set('start_date', appliedStartDate);
    }
    if (appliedEndDate) {
      params.set('end_date', appliedEndDate);
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (sortBy && sortBy !== 'created_at') {
      params.set('sort_by', sortBy);
    }
    if (sortOrder && sortOrder !== 'desc') {
      params.set('sort_order', sortOrder);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    // Update URL without causing a navigation
    setSearchParams(params, { replace: true });
  }, [conferenceFilter, paymentStatusFilter, appliedStartDate, appliedEndDate, searchTerm, sortBy, sortOrder, currentPage, setSearchParams]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle date filter change
  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  // Apply date filters
  const applyDateFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setCurrentPage(1);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate('');
    setAppliedEndDate('');
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Handle page input change
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // Handle page input Enter key
  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        if (page !== currentPage) {
          setCurrentPage(page);
        }
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
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        setPageInput('');
      } else {
        toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
        setPageInput('');
      }
    } else {
      // If input is empty, just clear it
      setPageInput('');
    }
  };

  // Update getSortIcon to always show both icons, with the active one filled/dark and the inactive one light/outline
  const getSortIcon = (field) => {
    const active = sortBy === field;
    return (
      <span className="flex flex-col items-center">
        <ChevronUp size={16} className={active && sortOrder === 'asc' ? 'text-teal-600' : 'text-gray-300'} />
        <ChevronDown size={16} className={active && sortOrder === 'desc' ? 'text-teal-600' : 'text-gray-300'} />
      </span>
    );
  };

  // Pagination controls
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading && !drfs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">DRF Management</h1>
          <p className="text-sm text-gray-600">Manage Delegate Registration Form submissions</p>
        </div>
        <div className="flex items-center gap-3">

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded text-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={!selectedIds.length}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${selectedIds.length ? 'bg-red-600 hover:bg-red-700' : 'bg-red-400 cursor-not-allowed'}`}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, or institution..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={16} />
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={conferenceFilter}
                onChange={(e) => {
                  setConferenceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="9th_conference">9th Conference Only</option>
                <option value="all">All Conferences</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 sm:flex-none flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</label>
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <Calendar className="text-gray-400" size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  placeholder="Start Date"
                />
              </div>
              <span className="text-gray-500 text-sm">to</span>
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <Calendar className="text-gray-400" size={16} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  placeholder="End Date"
                />
              </div>
              <button
                onClick={applyDateFilters}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Search size={16} />
                Search
              </button>
              {(appliedStartDate || appliedEndDate) && (
                <button
                  onClick={clearDateFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={drfs.length > 0 && selectedIds.length === drfs.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th onClick={() => handleSort('created_at')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    Created Date
                    {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drfs.map((drf) => (
                <tr key={drf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(drf.id)}
                      onChange={() => toggleSelect(drf.id)}
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {drf.pre_title} {drf.name || 'N/A'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      <span>{drf.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      <span>+{drf.country_code || ''} {drf.phone_no || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      drf.payment_status === 'paid' || drf.payment_status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : drf.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : drf.payment_status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {drf.payment_status ? drf.payment_status.charAt(0).toUpperCase() + drf.payment_status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(drf.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(drf.id)}
                        title="View"
                        aria-label="View"
                        className="p-2 rounded hover:bg-gray-100 text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleView(drf.id)}
                        title="Edit"
                        aria-label="Edit"
                        className="p-2 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => requestDelete(drf.id)}
                        title="Delete"
                        aria-label="Delete"
                        className="p-2 rounded hover:bg-gray-100 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmModal
            open={confirmState.open}
            title="Confirm Delete"
            message={confirmState.message}
            confirmText="Delete"
            cancelText="Cancel"
            confirming={confirmState.confirming}
            onConfirm={confirmDelete}
            onCancel={() => setConfirmState({ open: false, ids: [], message: '', confirming: false })}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * perPage + 1}
                    </span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * perPage, totalRecords)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalRecords}</span> results
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        disabled={page === '...'}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                            ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-default'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={pageInput}
                      onChange={handlePageInputChange}
                      onKeyPress={handlePageInputKeyPress}
                      onBlur={handlePageInputBlur}
                      placeholder={currentPage.toString()}
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <span className="text-sm text-gray-500">of {totalPages}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {drfs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No DRF records</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No records match your search.' : 'Get started by viewing existing records.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DRFManagement;
