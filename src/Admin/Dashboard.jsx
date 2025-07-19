import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Table from './Table';
import UserModal from './UserModal';

// Sample user data
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
  },
  {
    id: 3,
    name: "Karla Sorensen",
    email: "karla@example.com",
    phone: "+45 55 44 33 22",
    role: "Manager",
    department: "Sales",
    status: "active",
    joinDate: "9 MAY 17:38",
    avatar: "KS"
  },
  {
    id: 4,
    name: "Ida Jorgensen",
    email: "ida@example.com",
    phone: "+45 11 22 33 44",
    role: "User",
    department: "Marketing",
    status: "inactive",
    joinDate: "19 MAY 12:56",
    avatar: "IJ"
  },
  {
    id: 5,
    name: "Albert Andersen",
    email: "albert@example.com",
    phone: "+45 77 88 99 00",
    role: "Admin",
    department: "IT",
    status: "active",
    joinDate: "21 July 12:56",
    avatar: "AA"
  },
  {
    id: 6,
    name: "Emma Nielsen",
    email: "emma@example.com",
    phone: "+45 33 44 55 66",
    role: "User",
    department: "Finance",
    status: "active",
    joinDate: "22 MAY 14:30",
    avatar: "EN"
  },
  {
    id: 7,
    name: "Oliver Hansen",
    email: "oliver@example.com",
    phone: "+45 66 77 88 99",
    role: "Manager",
    department: "Operations",
    status: "inactive",
    joinDate: "23 MAY 09:15",
    avatar: "OH"
  },
  {
    id: 8,
    name: "Sofia Larsen",
    email: "sofia@example.com",
    phone: "+45 44 55 66 77",
    role: "User",
    department: "HR",
    status: "active",
    joinDate: "24 MAY 16:45",
    avatar: "SL"
  },
  {
    id: 9,
    name: "Lucas Petersen",
    email: "lucas@example.com",
    phone: "+45 22 33 44 55",
    role: "User",
    department: "IT",
    status: "active",
    joinDate: "25 MAY 08:20",
    avatar: "LP"
  },
  {
    id: 10,
    name: "Mia Christiansen",
    email: "mia@example.com",
    phone: "+45 99 88 77 66",
    role: "Manager",
    department: "Sales",
    status: "inactive",
    joinDate: "26 MAY 11:10",
    avatar: "MC"
  },
  {
    id: 11,
    name: "Noah Andersen",
    email: "noah@example.com",
    phone: "+45 11 44 77 88",
    role: "User",
    department: "Marketing",
    status: "active",
    joinDate: "27 MAY 15:30",
    avatar: "NA"
  },
  {
    id: 12,
    name: "Ella Sorensen",
    email: "ella@example.com",
    phone: "+45 55 22 99 33",
    role: "Admin",
    department: "IT",
    status: "active",
    joinDate: "28 MAY 09:45",
    avatar: "ES"
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(sampleUsers);
  const [currentPage, setCurrentPage] = useState(1);
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
  const usersPerPage = 10;

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
      // Adjust current page if needed
      const newTotalPages = Math.ceil((filteredUsers.length - 1) / usersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
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

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

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

      setUsers([...users, newUser]);
      alert('User added successfully!');
    } else {
      // Update existing user (for edit mode)
      setUsers(users.map(user => 
        user.email === formData.email 
          ? { ...user, ...formData }
          : user
      ));
      alert('User updated successfully!');
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome to your admin dashboard</p>
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
        {currentUsers.length > 0 ? (
          <Table
            users={currentUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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

export default Dashboard;