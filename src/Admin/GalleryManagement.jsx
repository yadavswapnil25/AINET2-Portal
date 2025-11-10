import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, Trash2, Upload, Image as ImageIcon, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { galleryAPI } from '../utils/api';

const GalleryManagement = () => {
  const [galleries, setGalleries] = useState([]);
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

  // Create/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', is_active: true, sort_order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const response = await galleryAPI.getGalleries({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        is_active: isActive === '' ? undefined : isActive === '1'
      });
      if (response.status) {
        setGalleries(response.data.galleries);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load galleries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchGalleries(); }, [currentPage, perPage, searchTerm, sortBy, sortOrder, isActive]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
 
  // Ensure file input ref is ready when modal opens
  useEffect(() => {
    if (modalOpen && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [modalOpen]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', is_active: true, sort_order: 0 });
    setImageFile(null);
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return '';
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setModalOpen(true);
  };

  const openEdit = (gallery) => {
    setEditing(gallery);
    setForm({
      title: gallery.title || '',
      is_active: !!gallery.is_active,
      sort_order: gallery.sort_order ?? 0,
    });
    setImageFile(null);
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return gallery.image_url || '';
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setModalOpen(true);
  };

  const saveGallery = async () => {
    try {
      if (!form.title) {
        toast.error('Title is required');
        return;
      }
      if (!editing && !imageFile) {
        toast.error('Image is required');
        return;
      }
      let res;
      if (editing) {
        res = await galleryAPI.updateGallery(editing.id, {
          title: form.title,
          imageFile,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        });
      } else {
        res = await galleryAPI.createGallery({
          title: form.title,
          imageFile,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        });
      }
      if (res.status) {
        toast.success(editing ? 'Gallery updated' : 'Gallery created');
        setModalOpen(false);
        fetchGalleries();
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
    setConfirmState({ open: true, ids: idsArr, message: `Delete ${count} gallery${count>1?'s':''}?`, confirming: false });
  };

  const confirmDelete = async () => {
    const ids = confirmState.ids;
    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (ids.length === 1) {
        res = await galleryAPI.deleteGallery(ids[0]);
      } else {
        res = await galleryAPI.bulkDeleteGalleries(ids);
      }
      if (res.status) {
        toast.success('Deleted');
        setSelectedIds([]);
        fetchGalleries();
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
    if (selectedIds.length === galleries.length) setSelectedIds([]);
    else setSelectedIds(galleries.map(g => g.id));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading galleries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gallery Management</h1>
          <p className="text-sm text-gray-600">Manage gallery images</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded text-sm">
            <Plus size={16} />
            New Gallery
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
            placeholder="Search by title..."
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
                  <input type="checkbox" checked={galleries.length>0 && selectedIds.length===galleries.length} onChange={toggleSelectAll} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th onClick={() => { setSortBy('title'); setSortOrder(sortBy==='title' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
                </th>
                <th onClick={() => { setSortBy('sort_order'); setSortOrder(sortBy==='sort_order' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Order {getSortIcon('sort_order')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleries.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input type="checkbox" checked={selectedIds.includes(g.id)} onChange={() => toggleSelect(g.id)} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {g.image_url ? (
                      <img src={g.image_url} alt={g.title} className="h-24 w-24 object-cover rounded" />
                    ) : (
                      <div className="h-24 w-24 bg-gray-100 rounded flex items-center justify-center text-gray-400"><ImageIcon size={18} /></div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{g.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{g.sort_order ?? 0}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {g.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 size={16} /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500"><XCircle size={16} /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button onClick={() => openEdit(g)} className="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">Edit</button>
                    <button onClick={() => requestDelete(g.id)} className="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
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
              <div>
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
              </div>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Gallery' : 'New Gallery'}</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e)=>setForm(f=>({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Active</label>
                  <select value={form.is_active? '1':'0'} onChange={(e)=>setForm(f=>({ ...f, is_active: e.target.value==='1' }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e)=>setForm(f=>({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image {editing && '(leave empty to keep existing)'}</label>
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
                      setImageFile(file);
                      setImagePreview((prev) => {
                        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
                        if (!file) return editing?.image_url || '';
                        return URL.createObjectURL(file);
                      });
                    }}
                  />
                  <div className="h-20 w-20 rounded border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 text-gray-400">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Selected image preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-xs">
                        <ImageIcon size={18} />
                        <span>No image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={()=> setModalOpen(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
              <button onClick={saveGallery} className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;

