import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';
import axios from 'axios';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'User',
    department: '',
    status: 'active'
  });

  const fetchUsers = async () => {
    try { 
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('/api/users');
      // Sort users by ID to ensure proper order
      const sortedUsers = response.data.sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
      setTotalPages(Math.ceil(sortedUsers.length / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      // For demo purposes, use sample data if API fails
      const sampleUsers = [
        {
          id: 1,
          name: "Isabella Christensen",
          email: "isabella@example.com",
          phone: "+45 12 34 56 78",
          role: "Admin",
          department: "IT",
          status: "active",
          joinDate: "11 MAY 12:56",
          avatar: "IC"
        },
        {
          id: 2,
          name: "Mathilde Andersen",
          email: "mathilde@example.com",
          phone: "+45 98 76 54 32",
          role: "User",
          department: "HR",
          status: "inactive",
          joinDate: "11 MAY 10:35",
          avatar: "MA"
        }
      ];
      setUsers(sampleUsers);
      setTotalPages(Math.ceil(sampleUsers.length / 10));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (userToDelete) => {
    try {
      // Delete user from the API
      await axios.delete(`/api/users/${userToDelete.id}`);
      
      // Update local state
      const updatedUsers = users
        .filter(user => user.id !== userToDelete.id)
        .map((user, index) => ({
          ...user,
          id: index + 1 // Reassign IDs sequentially
        }));
      
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
      
      // Update total pages
      setTotalPages(Math.ceil(updatedUsers.length / 10));
      
      // Adjust current page if necessary
      if (currentPage > Math.ceil(updatedUsers.length / 10)) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'User',
      department: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      if (modalMode === 'add') {
        // Create new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...formData,
          joinDate: new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).toUpperCase(),
          avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        };

        // Try to add to API first
        try {
          await axios.post('/api/users', newUser);
        } catch (apiError) {
          console.log('API not available, using local state');
        }

        setUsers([...users, newUser]);
        toast.success('User added successfully!');
      } else {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.email === formData.email 
            ? { ...user, ...formData }
            : user
        );

        // Try to update API first
        try {
          await axios.put(`/api/users/${formData.email}`, formData);
        } catch (apiError) {
          console.log('API not available, using local state');
        }

        setUsers(updatedUsers);
        toast.success('User updated successfully!');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {paginatedUsers.length > 0 ? (
          <Table
            users={paginatedUsers}
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