import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';
import { userAPI } from '../utils/api';
import Table from './Table';
import UserModal from './UserModal';
import { useDebounce } from '../utils/useDebounce';

const ROLE_OPTIONS = [
  { value: '', label: 'Select role' },
  { value: '1', label: 'Administrator' },
  { value: '2', label: 'User' },
  { value: '3', label: 'Owner' },
];

const getRoleLabel = (roleId) => {
  switch (roleId) {
    case 1:
      return 'Admin';
    case 3:
      return 'Owner';
    case 2:
    default:
      return 'User';
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile: '',
    whatsapp_no: '',
    gender: '',
    dob: '',
    address: '',
    state: '',
    district: '',
    membership_type: '',
    membership_plan: '',
    m_id: '',
    role_id: '',
    addMonths: '',
  });
  const [errors, setErrors] = useState({});
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      const response = await userAPI.getUsers({
        page,
        per_page: 10,
        search,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (response.status && response.data) {
        // Map API response to table format
        const mappedUsers = response.data.users.map((user) => ({
          id: user.id,
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          email: user.email,
          phone: user.mobile || user.whatsapp_no || 'N/A',
          role: getRoleLabel(user.role_id),
          department: user.state || user.district || 'N/A',
          status: user.deleted_at ? 'inactive' : 'active',
          joinDate: user.created_at 
            ? new Date(user.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).toUpperCase()
            : 'N/A',
          avatar: user.name 
            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            : (user.first_name?.[0] || '') + (user.last_name?.[0] || ''),
          // Store original user data for editing
          originalData: user,
        }));

        setUsers(mappedUsers);
        setSelectedUserIds((prevSelected) =>
          prevSelected.filter((id) => mappedUsers.some((user) => user.id === id))
        );
        setTotalPages(response.data.pagination?.last_page || 1);
        setCurrentPage(response.data.pagination?.current_page || 1);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  const handleDelete = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete user "${userToDelete.name}"?`)) {
      return;
    }

    try {
      const response = await userAPI.deleteUser(userToDelete.id);
      
      if (response.status) {
        toast.success('User deleted successfully');
        setSelectedUserIds((prevSelected) => prevSelected.filter((id) => id !== userToDelete.id));
        fetchUsers(currentPage, debouncedSearchTerm);
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    const originalUser = user.originalData || user;
    setModalMode('edit');
    setSelectedUser(originalUser);
    setErrors({});
    setFormData({
      name: originalUser.name || '',
      first_name: originalUser.first_name || '',
      last_name: originalUser.last_name || '',
      email: originalUser.email || '',
      password: '', // Don't pre-fill password
      mobile: originalUser.mobile || '',
      whatsapp_no: originalUser.whatsapp_no || '',
      gender: originalUser.gender || '',
      dob: originalUser.dob || '',
      address: originalUser.address || '',
      state: originalUser.state || '',
      district: originalUser.district || '',
      membership_type: originalUser.membership_type || '',
      membership_plan: originalUser.membership_plan || '',
      m_id: originalUser.m_id || '',
      role_id: originalUser.role_id ? String(originalUser.role_id) : '',
      addMonths: (() => {
        const rawValue =
          originalUser.addMonths ??
          originalUser.add_months ??
          originalUser.membership_validity_months ??
          originalUser.membership_duration_months ??
          originalUser.validity_months ??
          originalUser.duration_months;
        if (rawValue === null || rawValue === undefined || rawValue === '') return '';
        return String(rawValue);
      })(),
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setErrors({});
    setFormData({
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      mobile: '',
      whatsapp_no: '',
      gender: '',
      dob: '',
      address: '',
      state: '',
      district: '',
      membership_type: '',
      membership_plan: '',
      m_id: '',
      role_id: '',
      addMonths: '',
    });
    setShowModal(true);
  };

  const handleToggleSelectUser = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = users.map((user) => user.id);
    const allSelected =
      currentPageIds.length > 0 && currentPageIds.every((id) => selectedUserIds.includes(id));

    if (allSelected) {
      setSelectedUserIds((prevSelected) => prevSelected.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedUserIds((prevSelected) => Array.from(new Set([...prevSelected, ...currentPageIds])));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`)) {
      return;
    }

    try {
      const response = await userAPI.bulkDeleteUsers(selectedUserIds);

      if (response.status) {
        toast.success(`${selectedUserIds.length} user(s) deleted successfully`);
        setSelectedUserIds([]);
        fetchUsers(currentPage, debouncedSearchTerm);
      } else {
        toast.error(response.message || 'Failed to delete selected users');
      }
    } catch (error) {
      console.error('Error deleting selected users:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.message ||
        error.message ||
        'Failed to delete selected users';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    // Basic validation
    if (!formData.email) {
      const errorMessage = 'Email is required';
      setErrors({ email: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    if (modalMode === 'add' && !formData.password) {
      const errorMessage = 'Password is required for new users';
      setErrors({ password: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMessage = 'Please enter a valid email address';
      setErrors({ email: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    // Password validation for new users
    if (modalMode === 'add' && formData.password.length < 8) {
      const errorMessage = 'Password must be at least 8 characters';
      setErrors({ password: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    if (!formData.role_id) {
      const errorMessage = 'Role is required';
      setErrors({ role_id: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    const parsedAddMonths =
      formData.addMonths === '' || formData.addMonths === null
        ? null
        : Number(formData.addMonths);

    if (formData.addMonths !== '' && (Number.isNaN(parsedAddMonths) || parsedAddMonths < 0)) {
      const errorMessage = 'Membership validity (months) must be a non-negative number';
      setErrors({ addMonths: [errorMessage] });
      toast.error(errorMessage);
      return;
    }

    try {
      const userData = {
        name: formData.name || `${formData.first_name} ${formData.last_name}`.trim(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile: formData.mobile,
        whatsapp_no: formData.whatsapp_no,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        state: formData.state,
        district: formData.district,
        membership_type: formData.membership_type,
        membership_plan: formData.membership_plan,
      m_id: formData.m_id,
      role_id: formData.role_id ? Number(formData.role_id) : null,
      addMonths: parsedAddMonths,
      };

      // Only include password if provided (for new users or password updates)
      if (formData.password) {
        userData.password = formData.password;
      }

      let response;
      if (modalMode === 'add') {
        response = await userAPI.createUser(userData);
      } else {
        response = await userAPI.updateUser(selectedUser.id, userData);
      }

      if (response.status) {
        toast.success(`User ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        setErrors({});
        setShowModal(false);
        fetchUsers(currentPage, debouncedSearchTerm);
      } else {
        toast.error(response.message || `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      let validationErrors = error.response?.data?.errors;
      if (typeof validationErrors === 'string') {
        try {
          validationErrors = JSON.parse(validationErrors);
        } catch (parseError) {
          console.error('Failed to parse validation errors', parseError);
        }
      }
      if (error.response?.status === 422 && validationErrors && typeof validationErrors === 'object') {
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        if (firstError) {
          toast.error(firstError);
        } else {
          toast.error('Validation failed. Please check the highlighted fields.');
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`;
        toast.error(errorMessage);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600">Manage your users and their permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkDelete}
            disabled={selectedUserIds.length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow flex items-center space-x-2 ${
              selectedUserIds.length === 0
                ? 'bg-red-100 text-red-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <span>Delete Selected{selectedUserIds.length > 0 ? ` (${selectedUserIds.length})` : ''}</span>
          </button>
          <button
            onClick={handleAddUser}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors shadow"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users by name, email, mobile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {users.length > 0 ? (
          <Table
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            selectedUserIds={selectedUserIds}
            onToggleSelect={handleToggleSelectUser}
            onToggleSelectAll={handleToggleSelectAll}
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No users found matching your search.</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        roleOptions={ROLE_OPTIONS}
        errors={errors}
        onClose={() => setErrors({})}
        setErrors={setErrors}
      />
    </div>
  );
};

export default UserManagement;
