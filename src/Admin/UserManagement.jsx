import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';
import { userAPI } from '../utils/api';
import Table from './Table';
import UserModal from './UserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  });

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
          role: user.membership_type || 'User',
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
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers(1, searchTerm);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete user "${userToDelete.name}"?`)) {
      return;
    }

    try {
      const response = await userAPI.deleteUser(userToDelete.id);
      
      if (response.status) {
        toast.success('User deleted successfully');
        fetchUsers(currentPage, searchTerm);
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
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
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
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    if (modalMode === 'add' && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password validation for new users
    if (modalMode === 'add' && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
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
        setShowModal(false);
        fetchUsers(currentPage, searchTerm);
      } else {
        toast.error(response.message || `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] ||
                          `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`;
      toast.error(errorMessage);
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
        <button
          onClick={handleAddUser}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors shadow"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users by name, email, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      />
    </div>
  );
};

export default UserManagement;
