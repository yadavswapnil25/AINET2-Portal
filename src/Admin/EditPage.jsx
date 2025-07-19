import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: '',
    joinDate: ''
  });

  // Track original data to detect changes
  const [originalData, setOriginalData] = useState({});
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/users/${id}`);
        setFormData(response.data);
        setOriginalData(response.data);
        toast.success('User data loaded successfully');
        console.log(originalData, "originalData");
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Track modified fields
    if (value !== originalData[name]) {
      setModifiedFields(prev => new Set(prev).add(name));
    } else {
      setModifiedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(name);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only send modified fields
    const changedData = {};
    modifiedFields.forEach(field => {
      changedData[field] = formData[field];
    });

    // If no fields were modified, show message and return
    if (Object.keys(changedData).length === 0) {
      toast.info('No changes were made');
      return;
    }

    try {
      await axios.patch(`/api/users/${id}`, changedData);
      toast.success('User updated successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Failed to update user');
    }
  };

  const isFieldModified = (fieldName) => modifiedFields.has(fieldName);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit User Information</h2>
          <p className="text-sm text-gray-500 mt-1">Only modified fields will be updated</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
              {isFieldModified('name') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('name')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
              {isFieldModified('email') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('email')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
              {isFieldModified('phone') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('phone')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
              {isFieldModified('role') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('role')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Department Field */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
              {isFieldModified('department') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('department')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
              {isFieldModified('status') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('status')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select a status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Join Date Field */}
          <div>
            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
              Join Date
              {isFieldModified('joinDate') && (
                <span className="ml-2 text-xs text-blue-600">(Modified)</span>
              )}
            </label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                isFieldModified('joinDate')
                  ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {modifiedFields.size > 0 ? (
              <span>{modifiedFields.size} field(s) modified</span>
            ) : (
              <span>No changes made yet</span>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={modifiedFields.size === 0}
              className={`px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                modifiedFields.size > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPage; 