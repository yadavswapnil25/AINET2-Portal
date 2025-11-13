import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, Trash2, MapPin, Calendar, Link2, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { eventAPI } from '../utils/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination/filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isActive, setIsActive] = useState('');
  const [eventType, setEventType] = useState('');
  const [pageInput, setPageInput] = useState('');

  // Create/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    location: '', 
    event_date: '', 
    event_date_end: '', 
    description: '', 
    link_url: '', 
    event_type: '', 
    is_active: true, 
    sort_order: 0, 
    starts_at: '', 
    ends_at: '' 
  });

  const [confirmState, setConfirmState] = useState({ open: false, ids: [], message: '', confirming: false });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventAPI.getEvents({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        is_active: isActive === '' ? undefined : isActive === '1',
        event_type: eventType || undefined,
      });
      if (response.status) {
        setEvents(response.data.events);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [currentPage, perPage, searchTerm, sortBy, sortOrder, isActive, eventType]);

  const openCreate = () => {
    setEditing(null);
    setForm({ 
      title: '', 
      location: '', 
      event_date: '', 
      event_date_end: '', 
      description: '', 
      link_url: '', 
      event_type: '', 
      is_active: true, 
      sort_order: 0, 
      starts_at: '', 
      ends_at: '' 
    });
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title || '',
      location: event.location || '',
      event_date: event.event_date ? event.event_date.substring(0, 10) : '',
      event_date_end: event.event_date_end ? event.event_date_end.substring(0, 10) : '',
      description: event.description || '',
      link_url: event.link_url || '',
      event_type: event.event_type || '',
      is_active: !!event.is_active,
      sort_order: event.sort_order ?? 0,
      starts_at: event.starts_at ? event.starts_at.substring(0, 16) : '',
      ends_at: event.ends_at ? event.ends_at.substring(0, 16) : '',
    });
    setModalOpen(true);
  };

  const saveEvent = async () => {
    try {
      if (!form.title || !form.location) {
        toast.error('Title and Location are required');
        return;
      }
      let res;
      if (editing) {
        res = await eventAPI.updateEvent(editing.id, {
          title: form.title,
          location: form.location,
          event_date: form.event_date || undefined,
          event_date_end: form.event_date_end || undefined,
          description: form.description,
          link_url: form.link_url,
          event_type: form.event_type,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
          starts_at: form.starts_at || undefined,
          ends_at: form.ends_at || undefined,
        });
      } else {
        res = await eventAPI.createEvent({
          title: form.title,
          location: form.location,
          event_date: form.event_date || undefined,
          event_date_end: form.event_date_end || undefined,
          description: form.description,
          link_url: form.link_url,
          event_type: form.event_type,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
          starts_at: form.starts_at || undefined,
          ends_at: form.ends_at || undefined,
        });
      }
      if (res.status) {
        toast.success(editing ? 'Event updated' : 'Event created');
        setModalOpen(false);
        fetchEvents();
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
    setConfirmState({ open: true, ids: idsArr, message: `Delete ${count} event${count>1?'s':''}?`, confirming: false });
  };

  const confirmDelete = async () => {
    const ids = confirmState.ids;
    setConfirmState((s) => ({ ...s, confirming: true }));
    try {
      let res;
      if (ids.length === 1) {
        res = await eventAPI.deleteEvent(ids[0]);
      } else {
        res = await eventAPI.bulkDeleteEvents(ids);
      }
      if (res.status) {
        toast.success('Deleted');
        setSelectedIds([]);
        fetchEvents();
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
    if (selectedIds.length === events.length) setSelectedIds([]);
    else setSelectedIds(events.map(e => e.id));
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

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateRange = (start, end) => {
    if (!start) return 'TBA';
    if (!end || start === end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Event Management</h1>
          <p className="text-sm text-gray-600">Manage upcoming events</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded text-sm">
            <Plus size={16} />
            New Event
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
            placeholder="Search by title, location..."
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <div className="flex items-center gap-2">
            <select
              value={eventType}
              onChange={(e) => { setEventType(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="conference">Conference</option>
              <option value="webinar">Webinar</option>
              <option value="programme">Programme</option>
              <option value="workshop">Workshop</option>
            </select>
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
                  <input type="checkbox" checked={events.length>0 && selectedIds.length===events.length} onChange={toggleSelectAll} />
                </th>
                <th onClick={() => { setSortBy('title'); setSortOrder(sortBy==='title' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th onClick={() => { setSortBy('event_date'); setSortOrder(sortBy==='event_date' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Date {getSortIcon('event_date')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th onClick={() => { setSortBy('sort_order'); setSortOrder(sortBy==='sort_order' && sortOrder==='asc'?'desc':'asc'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">Order {getSortIcon('sort_order')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <input type="checkbox" checked={selectedIds.includes(e.id)} onChange={() => toggleSelect(e.id)} />
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{e.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {e.location}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDateRange(e.event_date, e.event_date_end)}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {e.event_type ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {e.event_type}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{e.sort_order ?? 0}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {e.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 size={16} /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500"><XCircle size={16} /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button onClick={() => openEdit(e)} className="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">Edit</button>
                    <button onClick={() => requestDelete(e.id)} className="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
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
              <h3 className="text-lg font-semibold">{editing ? 'Edit Event' : 'New Event'}</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e)=>setForm(f=>({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input type="text" value={form.location} onChange={(e)=>setForm(f=>({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Online, Maharashtra" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Date</label>
                  <input type="date" value={form.event_date} onChange={(e)=>setForm(f=>({ ...f, event_date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Event Date End</label>
                  <input type="date" value={form.event_date_end} onChange={(e)=>setForm(f=>({ ...f, event_date_end: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e)=>setForm(f=>({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Type</label>
                  <select value={form.event_type} onChange={(e)=>setForm(f=>({ ...f, event_type: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select Type</option>
                    <option value="conference">Conference</option>
                    <option value="webinar">Webinar</option>
                    <option value="programme">Programme</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Link URL</label>
                  <input type="url" value={form.link_url} onChange={(e)=>setForm(f=>({ ...f, link_url: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="https://..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Starts At</label>
                  <input type="datetime-local" value={form.starts_at} onChange={(e)=>setForm(f=>({ ...f, starts_at: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ends At</label>
                <input type="datetime-local" value={form.ends_at} onChange={(e)=>setForm(f=>({ ...f, ends_at: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={()=> setModalOpen(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
              <button onClick={saveEvent} className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;

