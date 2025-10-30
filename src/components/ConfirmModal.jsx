import React from 'react';

const ConfirmModal = ({ open, title = 'Confirm', message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, confirming = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">
          {message}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={confirming}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-2 text-sm rounded text-white ${confirming ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
            disabled={confirming}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


