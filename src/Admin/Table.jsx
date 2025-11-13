import React, { useEffect, useRef } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Avatar Component
const Avatar = ({ name }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const colors = {
    'IC': 'bg-blue-500',
    'MA': 'bg-green-500',
    'KS': 'bg-green-500',
    'IJ': 'bg-blue-500',
    'AA': 'bg-green-500',
    'EN': 'bg-pink-500',
    'OH': 'bg-blue-500',
    'SL': 'bg-blue-500',
    'LP': 'bg-purple-500',
    'MC': 'bg-red-500',
    'NA': 'bg-indigo-500',
    'ES': 'bg-yellow-500'
  };

  const initials = getInitials(name);
  const colorClass = colors[initials] || 'bg-gray-500';

  return (
    <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center text-white font-medium text-sm shadow`}>
      {initials}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const isActive = status === 'active';
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
      ${isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
      }
    `}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      {status}
    </span>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const colors = {
    Admin: 'bg-purple-100 text-purple-800',
    Manager: 'bg-blue-100 text-blue-800',
    Owner: 'bg-orange-100 text-orange-800',
    User: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[role] || colors.User}`}>
      {role}
    </span>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = React.useState('');

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

  // Handle page input change
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // Handle page input Enter key
  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
        setPageInput('');
      } else {
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
          onPageChange(page);
        }
        setPageInput('');
      } else {
        setPageInput('');
      }
    } else {
      setPageInput('');
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={`
                  px-3 py-1 text-xs font-medium rounded transition-colors
                  ${page === currentPage
                    ? 'bg-teal-500 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyPress={handlePageInputKeyPress}
              onBlur={handlePageInputBlur}
              placeholder={currentPage.toString()}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main User Table Component
const Table = ({
  users,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  selectedUserIds = [],
  onToggleSelect = () => {},
  onToggleSelectAll = () => {},
  enableSelection = true,
}) => {
  const navigate = useNavigate();
  const headerCheckboxRef = useRef(null);

  const allSelected =
    enableSelection &&
    users.length > 0 &&
    users.every((user) => selectedUserIds.includes(user.id));
  const someSelected =
    enableSelection &&
    users.some((user) => selectedUserIds.includes(user.id)) &&
    !allSelected;

  useEffect(() => {
    if (enableSelection && headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected, allSelected, enableSelection]);

  const handleEdit = (user) => {
    // Use onEdit prop if provided, otherwise navigate
    if (onEdit) {
      onEdit(user);
    } else {
      navigate(`/admin/edit/${user.id}`);
    }
  };

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {enableSelection && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`transition-colors ${
                  enableSelection && selectedUserIds.includes(user.id) ? 'bg-teal-50' : 'hover:bg-gray-50'
                }`}
              >
                {enableSelection && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => onToggleSelect(user.id)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                )}
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar name={user.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.joinDate}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center"
                    >
                      <Edit size={12} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Table;