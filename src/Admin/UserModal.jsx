import React from 'react';
import { X } from 'lucide-react';

const UserModal = ({
  showModal,
  setShowModal,
  modalMode,
  formData,
  setFormData,
  handleSubmit,
  roleOptions = [],
}) => {
  if (!showModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500/60" onClick={handleClose}></div>

        {/* Modal panel */}
        <div className="inline-block relative overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-30 max-h-[90vh] overflow-y-auto">
          <div className="px-6 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role_id"
                    id="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value || 'default-role-option'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select <span className="font-medium">Administrator</span> for users who need full access to the admin dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder={modalMode === 'add' ? 'Enter password (min 8 characters)' : 'Leave blank to keep current password'}
                    required={modalMode === 'add'}
                  />
                  {modalMode === 'edit' && (
                    <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp_no" className="block text-sm font-medium text-gray-700">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      name="whatsapp_no"
                      id="whatsapp_no"
                      value={formData.whatsapp_no}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Location Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      id="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter district"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Membership Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="membership_type" className="block text-sm font-medium text-gray-700">
                      Membership Type
                    </label>
                    <select
                      name="membership_type"
                      id="membership_type"
                      value={formData.membership_type}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="">Select membership type</option>
                      <option value="Individual">Individual</option>
                      <option value="Institutional">Institutional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="membership_plan" className="block text-sm font-medium text-gray-700">
                      Membership Plan
                    </label>
                    <select
                      name="membership_plan"
                      id="membership_plan"
                      value={formData.membership_plan}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="">Select membership plan</option>
                      <option value="Annual">Annual</option>
                      <option value="LongTerm">Long Term</option>
                      <option value="Overseas">Overseas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="m_id" className="block text-sm font-medium text-gray-700">
                    Membership ID
                  </label>
                  <input
                    type="text"
                    name="m_id"
                    id="m_id"
                    value={formData.m_id}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="Enter membership ID"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-teal-500 border border-transparent rounded-lg shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {modalMode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
