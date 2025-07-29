import React, { useState } from 'react';
import { Pencil, Trash2, BadgeCheck, X, ExternalLink } from 'lucide-react';

const Highlights = () => {
  const [highlightText, setHighlightText] = useState("AI-powered dashboard is live! 🎉");
  const [highlightLink, setHighlightLink] = useState("https://example.com");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState(highlightText);
  const [newLink, setNewLink] = useState(highlightLink);

  const handleUpdateClick = () => {
    setNewText(highlightText);
    setNewLink(highlightLink);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setHighlightText(newText);
    setHighlightLink(newLink);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this highlight?")) {
      setHighlightText("");
      setHighlightLink("");
    }
  };

  return (
    <div className=" relative">
      <div className="">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Highlights</h2>

        {/* Highlight Box */}
        {highlightText ? (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between bg-slate-100 p-4 rounded-lg border border-slate-200 gap-4">
            <div className="flex-1">
              <span className="flex items-center mb-2">
                <BadgeCheck className="text-teal-500 mr-2" size={18} />
                <span className="text-sm font-medium text-teal-600">Current</span>
              </span>
              <p className="text-gray-700 text-base">{highlightText}</p>
              {highlightLink && (
                <a
                  href={highlightLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline mt-2 text-sm"
                >
                  <ExternalLink size={14} className="mr-1" /> Visit Link
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-col gap-2 self-start sm:self-center">
              <button
                onClick={handleUpdateClick}
                className="flex items-center justify-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow w-full sm:w-auto"
              >
                <Pencil size={16} className="mr-1" />
                Update
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow w-full sm:w-auto"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No highlight available</p>
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

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Update Highlight</h3>

              {/* Highlight Text Field */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Highlight Text</span>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                  rows="3"
                />
              </label>

              {/* Highlight Link Field */}
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Link (optional)</span>
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://example.com"
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
