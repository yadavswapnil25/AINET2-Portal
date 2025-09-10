import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Camera,
  Save,
  Edit3,
  Activity,
  Clock,
  Globe,
  Building,
  Award,
  Settings,
  Bell,
  Key,
  LogOut,
  Trash2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@ainet.org',
        phone: '+91 98765 43210',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        location: 'Mumbai, Maharashtra',
        timezone: 'Asia/Kolkata',
        bio: 'Experienced administrator with expertise in educational technology and ELT management.',
        designation: 'Senior Administrator',
        department: 'Information Technology',
        joinDate: '2020-03-15',
        employeeId: 'AINET-ADM-001'
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        sessionTimeout: 30
      },
      preferences: {
        theme: 'light',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        notifications: {
          email: true,
          sms: false,
          push: true,
          announcements: true,
          updates: true,
          security: true
        }
      }
    }
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('adminProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key]) {
            setValue(key, parsedData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Save to localStorage for demo purposes
      localStorage.setItem('adminProfile', JSON.stringify(data));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.security.newPassword !== data.security.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setValue('security.currentPassword', '');
      setValue('security.newPassword', '');
      setValue('security.confirmPassword', '');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you would upload this to your server
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
              JD
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              John Doe
            </h3>
            <p className="text-sm text-gray-600">Senior Administrator</p>
            <p className="text-sm text-gray-500">AINET-ADM-001</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Personal Information
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register("personalInfo.firstName", { required: "First name is required" })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              {errors.personalInfo?.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.personalInfo.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register("personalInfo.lastName", { required: "Last name is required" })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              {errors.personalInfo?.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.personalInfo.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  {...register("personalInfo.email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              {errors.personalInfo?.email && (
                <p className="text-red-500 text-sm mt-1">{errors.personalInfo.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="tel"
                  {...register("personalInfo.phone")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  {...register("personalInfo.dateOfBirth")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                {...register("personalInfo.gender")}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  {...register("personalInfo.location")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <select
                  {...register("personalInfo.timezone")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              {...register("personalInfo.bio")}
              rows={3}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Work Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  {...register("personalInfo.designation")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  {...register("personalInfo.department")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  {...register("personalInfo.joinDate")}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                {...register("personalInfo.employeeId")}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-red-600" />
          Change Password
        </h3>

        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("security.currentPassword", { required: "Current password is required" })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.security?.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.security.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register("security.newPassword", { 
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.security?.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.security.newPassword.message}</p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("security.confirmPassword", { required: "Please confirm your password" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.security?.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.security.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Preferences */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Security Preferences
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("security.twoFactorEnabled")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Login Alerts */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
                <p className="text-sm text-gray-500">Get notified of new login attempts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("security.loginAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Session Timeout */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                <p className="text-sm text-gray-500">Set automatic logout time</p>
              </div>
            </div>
            <select
              {...register("security.sessionTimeout")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never (until browser closes)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-orange-600" />
          Recent Activity
        </h3>

        <div className="space-y-4">
          {[
            { action: 'Password changed', time: '2 hours ago', status: 'success' },
            { action: 'Login from new device', time: '1 day ago', status: 'info' },
            { action: 'Profile updated', time: '3 days ago', status: 'success' },
            { action: 'Failed login attempt', time: '1 week ago', status: 'warning' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100' : 
                activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {activity.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : activity.status === 'warning' ? (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Activity className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-purple-600" />
          Display & Theme
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              {...register("preferences.theme")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              {...register("preferences.language")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              {...register("preferences.dateFormat")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <select
              {...register("preferences.timeFormat")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'announcements', label: 'Announcements', description: 'Get notified about important announcements' },
            { key: 'updates', label: 'System Updates', description: 'Notifications about system updates' },
            { key: 'security', label: 'Security Alerts', description: 'Important security-related notifications' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`preferences.notifications.${notification.key}`)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Account Actions
        </h3>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-500">Download your personal data</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Deactivate Account</h4>
                <p className="text-sm text-gray-500">Temporarily disable your account</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account</p>
              </div>
            </div>
            <span className="text-red-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage your personal information, security settings, and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'preferences' && renderPreferences()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
