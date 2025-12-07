import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { ppfAPI } from '../utils/api';
import { useDebounce } from '../utils/useDebounce';
import ConfirmModal from '../components/ConfirmModal';

const PPFManagement = () => {
  const navigate = useNavigate();
  const [ppfs, setPpfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [pageInput, setPageInput] = useState('');

  // Fetch PPF records
  const fetchPPFs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ppfAPI.getPPFs({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        start_date: appliedStartDate,
        end_date: appliedEndDate,
      });

      if (response.status) {
        setPpfs(response.data.ppfs);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching PPFs:', error);
      toast.error('Failed to load PPF records');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, debouncedSearchTerm, sortBy, sortOrder, appliedStartDate, appliedEndDate]);

  // Handle view
  const handleView = (id) => {
    window.location.href = `/admin/ppfs/${id}`;
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await ppfAPI.exportPPFs({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        start_date: appliedStartDate,
        end_date: appliedEndDate,
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); 
      link.href = url;
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
      const contentDisposition = response.headers['content-disposition'] || '';
      const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
      const filename = (match && (decodeURIComponent(match[1] || match[2]) )) || `ppf_export_${ts}.csv`;
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
    if (selectedIds.length === ppfs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ppfs.map((p) => Number(p.id)).filter((id) => Number.isFinite(id)));
    }
  };

  const toggleSelect = (id) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;

    setSelectedIds((prev) =>
      prev.includes(numericId) ? prev.filter((x) => x !== numericId) : [...prev, numericId]
    );
  };

  useEffect(() => {
    // Clear selection when data changes
    setSelectedIds([]);
  }, [ppfs]);

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
    const normalizedIds = (confirmState.ids || [])
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (!normalizedIds.length) {
      toast.error('No valid PPF records selected');
      setConfirmState({ open: false, ids: [], message: '', confirming: false });
      return;
    }

    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (normalizedIds.length === 1) {
        res = await ppfAPI.deletePPF(normalizedIds[0]);
      } else {
        res = await ppfAPI.bulkDeletePPFs(normalizedIds);
      }
      if (res.status) {
        toast.success(normalizedIds.length === 1 ? 'Deleted successfully' : 'Selected records deleted');
        setSelectedIds([]);
        fetchPPFs();
      } else {
        toast.error('Delete failed');
      }
    } catch (e) {
      console.error(e);
      const apiMessage = e?.response?.data?.message || e?.response?.data?.errors?.message;
      if (apiMessage && apiMessage.toLowerCase().includes('not found')) {
        toast('Some records were already deleted. Refreshing list...', { icon: 'ℹ️' });
        fetchPPFs();
      } else {
        toast.error(apiMessage || 'Delete failed');
      }
    } finally {
      setConfirmState({ open: false, ids: [], message: '', confirming: false });
    }
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    requestDelete(selectedIds);
  };

  useEffect(() => {
    fetchPPFs();
  }, [fetchPPFs]);

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
        setCurrentPage(page);
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

  // Update getSortIcon
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

  if (isLoading && !ppfs.length) {
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
          <h1 className="text-2xl font-semibold text-gray-900">PPF Management</h1>
          <p className="text-sm text-gray-600">Manage Paper/Presentation Form submissions</p>
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
                placeholder="Search by name, email, or title..."
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
                    checked={ppfs.length > 0 && selectedIds.length === ppfs.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th
                  onClick={() => handleSort('id')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presenter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th
                  onClick={() => handleSort('pr_title')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Title
                    {getSortIcon('pr_title')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theme
                </th>
                <th
                  onClick={() => handleSort('pr_nature')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Type
                    {getSortIcon('pr_nature')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Created
                    {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ppfs.map((ppf) => (
                <tr key={ppf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ppf.id)}
                      onChange={() => toggleSelect(ppf.id)}
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ppf.id}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {ppf.main_name || 'N/A'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {ppf.main_work || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-xs">{ppf.main_email || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        <span className="text-xs">{ppf.main_phone || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-xs">
                    <div className="font-medium text-gray-900">
                      {truncateText(ppf.pr_title, 50)}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {ppf.sub_theme_other || ppf.sub_theme || '-'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ppf.pr_nature || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {formatDate(ppf.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/ppfs/${ppf.id}`)}
                        title="View"
                        aria-label="View"
                        className="p-2 rounded hover:bg-gray-100 text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => requestDelete(ppf.id)}
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
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

        {ppfs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No PPF records</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No records match your search.' : 'Get started by viewing existing records.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPFManagement;
     