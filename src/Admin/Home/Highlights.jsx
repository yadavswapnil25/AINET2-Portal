import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, BadgeCheck, X, Plus, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { highlightAPI } from '../../utils/api';

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ heading: 'HIGHLIGHTS', subheading: '', link_url: '', is_active: true, sort_order: 0 });

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setIsLoading(true);
      const response = await highlightAPI.getHighlights();
      if (response.status) {
        setHighlights(response.data.highlights || []);
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
      toast.error('Failed to load highlights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ heading: 'HIGHLIGHTS', subheading: '', link_url: '', is_active: true, sort_order: 0 });
    setIsModalOpen(true);
  };

  const handleUpdateClick = (highlight) => {
    setEditing(highlight);
    setForm({
      heading: highlight.heading || 'HIGHLIGHTS',
      subheading: highlight.subheading || '',
      link_url: highlight.link_url || '',
      is_active: highlight.is_active !== undefined ? highlight.is_active : true,
      sort_order: highlight.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const response = await highlightAPI.updateHighlight(editing.id, form);
        if (response.status) {
          toast.success('Highlight updated successfully');
          fetchHighlights();
          setIsModalOpen(false);
        }
      } else {
        const response = await highlightAPI.createHighlight(form);
        if (response.status) {
          toast.success('Highlight created successfully');
          fetchHighlights();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving highlight:', error);
      toast.error('Failed to save highlight');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this highlight?")) {
      try {
        const response = await highlightAPI.deleteHighlight(id);
        if (response.status) {
          toast.success('Highlight deleted successfully');
          fetchHighlights();
        }
      } catch (error) {
        console.error('Error deleting highlight:', error);
        toast.error('Failed to delete highlight');
      }
    }
  };

  const activeHighlight = highlights.find(h => h.is_active) || highlights[0];

  return (
    <div className="relative">
      <div className="">
        {/* Heading */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Highlights</h2>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Highlight
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-teal-600" size={24} />
          </div>
        ) : activeHighlight ? (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between bg-slate-100 p-4 rounded-lg border border-slate-200 gap-4">
            <div className="flex-1">
              <span className="flex items-center mb-2">
                <BadgeCheck className={`mr-2 ${activeHighlight.is_active ? 'text-teal-500' : 'text-gray-400'}`} size={18} />
                <span className={`text-sm font-medium ${activeHighlight.is_active ? 'text-teal-600' : 'text-gray-500'}`}>
                  {activeHighlight.is_active ? 'Active' : 'Inactive'}
                </span>
              </span>
              <p className="text-gray-800 font-semibold text-sm mb-1">{activeHighlight.heading}</p>
              <p className="text-gray-700 text-base">{activeHighlight.subheading}</p>
              {activeHighlight.link_url && (
                <p className="text-blue-600 text-sm mt-1">🔗 {activeHighlight.link_url}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-col gap-2 self-start sm:self-center">
              <button
                onClick={() => handleUpdateClick(activeHighlight)}
                className="flex items-center justify-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow w-full sm:w-auto"
              >
                <Pencil size={16} className="mr-1" />
                Update
              </button>
              <button
                onClick={() => handleDelete(activeHighlight.id)}
                className="flex items-center justify-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow w-full sm:w-auto"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No highlight available. Click "Add Highlight" to create one.</p>
        )}

        {/* All Highlights List */}
        {highlights.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">All Highlights</h3>
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div key={highlight.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{highlight.heading}</span>
                      {highlight.is_active && (
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{highlight.subheading}</p>
                    {highlight.link_url && (
                      <p className="text-blue-600 text-xs mt-1">🔗 {highlight.link_url}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateClick(highlight)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(highlight.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {editing ? 'Update Highlight' : 'Create Highlight'}
              </h3>

              {/* Heading Field */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Heading</span>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="HIGHLIGHTS"
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                />
              </label>

              {/* Subheading Field */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Subheading</span>
                <textarea
                  value={form.subheading}
                  onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                  placeholder="9th AINET International Conference 2026 - To Be Announced SOON"
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                  rows="3"
                />
              </label>

              {/* Link URL Field */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Link URL (Optional)</span>
                <input
                  type="url"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  placeholder="https://example.com or /events/webinar"
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Clicking the highlight will redirect to this URL</p>
              </label>

              {/* Active Status */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <select
                  value={form.is_active ? '1' : '0'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </label>

              {/* Sort Order */}
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Sort Order</span>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                />
              </label>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full sm:w-auto"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Highlights;
