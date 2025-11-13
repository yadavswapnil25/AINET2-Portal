import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, Trash2, Upload, Image as ImageIcon, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play, Eye
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { newsAPI } from '../utils/api';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);

  // Pagination/filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isActive, setIsActive] = useState('');
  const [pageInput, setPageInput] = useState('');

  // Create/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    location: '', 
    publisher_name: '', 
    conference_name: '', 
    title: '', 
    summary: '', 
    has_video: false, 
    view_count: 0, 
    link_url: '', 
    published_date: '', 
    is_active: true, 
    sort_order: 0 
  });
  const [publisherLogoFile, setPublisherLogoFile] = useState(null);
  const [publisherLogoPreview, setPublisherLogoPreview] = useState('');

  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await newsAPI.getNews({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        is_active: isActive === '' ? undefined : isActive === '1'
      });
      if (response.status) {
        setNews(response.data.news);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [currentPage, perPage, searchTerm, sortBy, sortOrder, isActive]);

  useEffect(() => {
    return () => {
      if (publisherLogoPreview && publisherLogoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(publisherLogoPreview);
      }
    };
  }, [publisherLogoPreview]);
 
  // Ensure file input ref is ready when modal opens
  useEffect(() => {
    if (modalOpen && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [modalOpen]);

  const openCreate = () => {
    setEditing(null);
    setForm({ 
      location: '', 
      publisher_name: '', 
      conference_name: '', 
      title: '', 
      summary: '', 
      has_video: false, 
      view_count: 0, 
      link_url: '', 
      published_date: '', 
      is_active: true, 
      sort_order: 0 
    });
    setPublisherLogoFile(null);
    setPublisherLogoPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return '';
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setModalOpen(true);
  };

  const openEdit = (newsItem) => {
    setEditing(newsItem);
    setForm({
      location: newsItem.location || '',
      publisher_name: newsItem.publisher_name || '',
      conference_name: newsItem.conference_name || '',
      title: newsItem.title || '',
      summary: newsItem.summary || '',
      has_video: !!newsItem.has_video,
      view_count: newsItem.view_count ?? 0,
      link_url: newsItem.link_url || '',
      published_date: newsItem.published_date ? newsItem.published_date.substring(0, 10) : '',
      is_active: !!newsItem.is_active,
      sort_order: newsItem.sort_order ?? 0,
    });
    setPublisherLogoFile(null);
    setPublisherLogoPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return newsItem.publisher_logo_url || '';
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setModalOpen(true);
  };

  const saveNews = async () => {
    try {
      if (!form.publisher_name) {
        toast.error('Publisher name is required');
        return;
      }
      if (!form.title) {
        toast.error('Title is required');
        return;
      }
      if (!form.summary) {
        toast.error('Summary is required');
        return;
      }
      let res;
      if (editing) {
        res = await newsAPI.updateNews(editing.id, {
          location: form.location,
          publisher_name: form.publisher_name,
          publisherLogoFile,
          conference_name: form.conference_name,
          title: form.title,
          summary: form.summary,
          has_video: form.has_video,
          view_count: Number(form.view_count) || 0,
          link_url: form.link_url,
          published_date: form.published_date || undefined,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        });
      } else {
        res = await newsAPI.createNews({
          location: form.location,
          publisher_name: form.publisher_name,
          publisherLogoFile,
          conference_name: form.conference_name,
          title: form.title,
          summary: form.summary,
          has_video: form.has_video,
          view_count: Number(form.view_count) || 0,
          link_url: form.link_url,
          published_date: form.published_date || undefined,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        });
      }
      if (res.status) {
        toast.success(editing ? 'News updated' : 'News created');
        setModalOpen(false);
        fetchNews();
      } else {
        toast.error('Save failed');
      }
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    }
  };

  const requestDelete = (ids) => {
    const count = Array.isArray(ids) ? ids.length : 1;
    const idsArr = Array.isArray(ids) ? ids : [ids];
    setConfirmState({ open: true, ids: idsArr, message: `Delete ${count} news item${count>1?'s':''}?`, confirming: false });
  };

  const confirmDelete = async () => {
    const ids = confirmState.ids;
    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (ids.length === 1) {
        res = await newsAPI.deleteNews(ids[0]);
      } else {
        res = await newsAPI.bulkDeleteNews(ids);
      }
      if (res.status) {
        toast.success('Deleted');
        setSelectedIds([]);
        fetchNews();
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
    if (selectedIds.length === news.length) setSelectedIds([]);
    else setSelectedIds(news.map(n => n.id));
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
        <p className="text-gray-500">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AINET In News</h1>
          <p className="text-sm text-gray-600">Manage news articles</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded text-sm">
            <Plus size={16} />
            New News
          </button>
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
            placeholder="Search by title, publisher, conference..."
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <div className="flex items-center gap-2">
            <select
              value={isActive}
              onChange={(e) => { setIsActive(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
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
                  <input type="checkbox" checked={news.length>0 && selectedIds.length===news.length} onChange={toggleSelectAll} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                <th onClick={() => { setSortBy('title'); setSortOrder(sortBy==='title' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conference</th>
                <th onClick={() => { setSortBy('sort_order'); setSortOrder(sortBy==='sort_order' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Order {getSortIcon('sort_order')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map(n => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input type="checkbox" checked={selectedIds.includes(n.id)} onChange={() => toggleSelect(n.id)} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {n.publisher_logo_url ? (
                        <img src={n.publisher_logo_url} alt={n.publisher_name} className="h-8 w-8 object-contain rounded" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs font-bold">{n.publisher_name?.substring(0, 2).toUpperCase() || 'N/A'}</div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{n.publisher_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">{n.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{n.location || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 max-w-xs truncate">{n.conference_name || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{n.sort_order ?? 0}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {n.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 size={16} /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500"><XCircle size={16} /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button onClick={() => openEdit(n)} className="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">Edit</button>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{editing ? 'Edit News' : 'New News'}</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Publisher Name *</label>
                  <input type="text" value={form.publisher_name} onChange={(e)=>setForm(f=>({ ...f, publisher_name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., TOI, The Times of India" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" value={form.location} onChange={(e)=>setForm(f=>({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., MUMBAI" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Publisher Logo {editing && '(leave empty to keep existing)'}</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm"
                  >
                    <Upload size={16} />
                    <span>Choose file</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setPublisherLogoFile(file);
                      setPublisherLogoPreview((prev) => {
                        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
                        if (!file) return editing?.publisher_logo_url || '';
                        return URL.createObjectURL(file);
                      });
                    }}
                  />
                  <div className="h-16 w-16 rounded border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 text-gray-400">
                    {publisherLogoPreview ? (
                      <img src={publisherLogoPreview} alt="Selected logo preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-[10px]">
                        <ImageIcon size={16} />
                        <span>No logo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conference Name</label>
                <input type="text" value={form.conference_name} onChange={(e)=>setForm(f=>({ ...f, conference_name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., 'TH AINET INTERNATIONAL CONFERENCE'" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e)=>setForm(f=>({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Article title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Summary *</label>
                <textarea value={form.summary} onChange={(e)=>setForm(f=>({ ...f, summary: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows="4" placeholder="Article summary/body" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Link URL</label>
                  <input type="url" value={form.link_url} onChange={(e)=>setForm(f=>({ ...f, link_url: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Published Date</label>
                  <input type="date" value={form.published_date} onChange={(e)=>setForm(f=>({ ...f, published_date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Has Video</label>
                  <select value={form.has_video? '1':'0'} onChange={(e)=>setForm(f=>({ ...f, has_video: e.target.value==='1' }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">View Count</label>
                  <input type="number" value={form.view_count} onChange={(e)=>setForm(f=>({ ...f, view_count: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e)=>setForm(f=>({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Active</label>
                <select value={form.is_active? '1':'0'} onChange={(e)=>setForm(f=>({ ...f, is_active: e.target.value==='1' }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={()=> setModalOpen(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
              <button onClick={saveNews} className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;

