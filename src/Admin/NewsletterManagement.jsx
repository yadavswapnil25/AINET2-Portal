import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Trash2, Mail, Phone, User, ChevronLeft, ChevronRight, ChevronUp, ChevronDown
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { newsletterAPI } from '../utils/api';

const NewsletterManagement = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination/filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageInput, setPageInput] = useState('');

  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });

  const fetchNewsletters = async () => {
    try {
      setIsLoading(true);
      const response = await newsletterAPI.getNewsletters({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      if (response.status) {
        setNewsletters(response.data.newsletters);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load newsletters');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNewsletters(); }, [currentPage, perPage, searchTerm, sortBy, sortOrder]);

  const requestDelete = (ids) => {
    const count = Array.isArray(ids) ? ids.length : 1;
    const idsArr = Array.isArray(ids) ? ids : [ids];
    setConfirmState({ open: true, ids: idsArr, message: `Delete ${count} newsletter subscription${count>1?'s':''}?`, confirming: false });
  };

  const confirmDelete = async () => {
    const ids = confirmState.ids;
    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (ids.length === 1) {
        res = await newsletterAPI.deleteNewsletter(ids[0]);
      } else {
        res = await newsletterAPI.bulkDeleteNewsletters(ids);
      }
      if (res.status) {
        toast.success('Deleted');
        setSelectedIds([]);
        fetchNewsletters();
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

  const toggleSelectAll = () => {
    if (selectedIds.length === newsletters.length) setSelectedIds([]);
    else setSelectedIds(newsletters.map(n => n.id));
  };
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getSortIcon = (field) => {
    const active = sortBy === field;
    return (
      <span className="flex flex-col items-center">
        <ChevronUp size={16} className={active && sortOrder === 'asc' ? 'text-teal-600' : 'text-gray-300'} />
        <ChevronDown size={16} className={active && sortOrder === 'desc' ? 'text-teal-600' : 'text-gray-300'} />
      </span>
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
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
    return pages;
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
      setPageInput('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading newsletters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Newsletter Subscriptions</h1>
          <p className="text-sm text-gray-600">Manage newsletter subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => selectedIds.length && requestDelete(selectedIds)}
            disabled={!selectedIds.length}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${selectedIds.length ? 'bg-red-600 hover:bg-red-700' : 'bg-red-400 cursor-not-allowed'}`}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, email, or WhatsApp..."
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <div className="flex items-center gap-2">
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input type="checkbox" checked={newsletters.length>0 && selectedIds.length===newsletters.length} onChange={toggleSelectAll} />
                </th>
                <th onClick={() => { setSortBy('name'); setSortOrder(sortBy==='name' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Name {getSortIcon('name')}</div>
                </th>
                <th onClick={() => { setSortBy('email'); setSortOrder(sortBy==='email' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Email {getSortIcon('email')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th onClick={() => { setSortBy('created_at'); setSortOrder(sortBy==='created_at' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Subscribed Date {getSortIcon('created_at')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsletters.map(n => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input type="checkbox" checked={selectedIds.includes(n.id)} onChange={() => toggleSelect(n.id)} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{n.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{n.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {n.whatsapp_no ? (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{n.whatsapp_no}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {n.created_at ? new Date(n.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button onClick={() => requestDelete(n.id)} className="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
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

        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">{Math.min(currentPage * perPage, totalRecords)}</span>
                  {' '}of{' '}
                  <span className="font-medium">{totalRecords}</span> results
                </p>
              </div>
              <div className="flex items-center gap-3">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <ChevronLeft size={20} />
                  </button>
                  {getPageNumbers().map((page, idx) => (
                    <button key={idx} onClick={() => typeof page==='number' && setCurrentPage(page)} disabled={page==='...'} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page===currentPage? 'z-10 bg-teal-50 border-teal-500 text-teal-600':'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 disabled:cursor-default'}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
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
        )}
      </div>
    </div>
  );
};

export default NewsletterManagement;

