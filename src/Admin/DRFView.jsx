import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Award,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { drfAPI } from '../utils/api';
import { formatTitleCase } from '../utils/formatters';

const DRFView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [drf, setDrf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDRF = async () => {
      try {
        setIsLoading(true);
        const response = await drfAPI.getDRF(id);
        if (response.status) {
          setDrf(response.data.drf);
          setFormData(response.data.drf);
        }
      } catch (error) {
        console.error('Error fetching DRF:', error);
        toast.error('Failed to load DRF details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDRF();
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(drf);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(drf);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await drfAPI.updateDRF(id, formData);
      if (response.status) {
        setDrf(response.data.drf);
        setIsEditing(false);
        toast.success('DRF record updated successfully');
      } else {
        toast.error('Failed to update DRF record');
      }
    } catch (error) {
      console.error('Error updating DRF:', error);
      toast.error('Failed to update DRF record');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!drf) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">DRF record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Preserve query parameters when navigating back
              const searchParams = new URLSearchParams(location.search);
              const queryString = searchParams.toString();
              navigate(`/admin/drfs${queryString ? `?${queryString}` : ''}`);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">DRF Details</h1>
            <p className="text-sm text-gray-600">DRF ID: {drf.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-8">
          {/* Personal Information */}
          <section className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="text-blue-600" size={20} />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700">Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pre_title"
                    value={formData.pre_title || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.pre_title || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{drf.name || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">AINET Member ?</label>
                {isEditing ? (
                  <select
                    name="member"
                    value={formData.member || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 rounded text-sm ${
                      drf.is_member === 'Yes' || drf.member 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {drf.is_member === 'Yes' || drf.member ? (drf.member || 'Yes') : 'No'}
                    </span>
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Registration Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="you_are_register_as"
                    value={formData.you_are_register_as || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.you_are_register_as || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Age Group</label>
                {isEditing ? (
                  <select
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Age Group</option>
                    <option value="up to 25">up to 25</option>
                    <option value="26-30">26-30</option>
                    <option value="31-35">31-35</option>
                    <option value="36-40">36-40</option>
                    <option value="41-45">41-45</option>
                    <option value="46-50">46-50</option>
                    <option value="Over 50">Over 50</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{drf.age || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{formatTitleCase(drf.gender) || '-'}</p>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-teal-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="text-teal-600" size={20} />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Mail size={16} className="text-gray-500" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <a href={`mailto:${drf.email}`} className="text-blue-600 hover:underline">
                    {drf.email || '-'}
                  </a>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Phone size={16} className="text-gray-500" />
                  Phone
                </label>
                {isEditing ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      name="country_code"
                      value={formData.country_code || ''}
                      onChange={handleChange}
                      placeholder="Country Code"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      name="phone_no"
                      value={formData.phone_no || ''}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                ) : (
                  <a href={`tel:+${drf.country_code || ''}${drf.phone_no}`} className="text-blue-600 hover:underline">
                    +{drf.country_code || ''} {drf.phone_no || '-'}
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Institution & Address */}
          <section className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="text-purple-600" size={20} />
              Institution & Correspondence Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Briefcase size={16} className="text-gray-500" />
                  Institution
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.institution || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Correspondence</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.address || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.city || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.state || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.pincode || '-'}</p>
                )}
              </div>
            </div>
          </section>

          {/* Conference & Areas */}
          <section className="bg-amber-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="text-amber-600" size={20} />
              Other Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Presenting at Conference ?</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="conference"
                    value={formData.conference || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.conference || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Presentation Type(s)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="types"
                    value={formData.types || ''}
                    onChange={handleChange}
                    placeholder="e.g., Paper, Poster, Workshop, Virtual Presentation"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {drf.types 
                      ? (Array.isArray(drf.types) 
                          ? drf.types.join(', ') 
                          : (typeof drf.types === 'string' 
                              ? drf.types.split(',').map(s => s.trim()).filter(s => s).join(', ')
                              : drf.types))
                      : '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Conference Attendance</label>
                {isEditing ? (
                  <select
                    name="conference_attendance"
                    value={formData.conference_attendance || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Conference</option>
                    <option value="9th_conference">9th Conference</option>
                    <option value="8th_conference">8th Conference</option>
                    <option value="7th_conference">7th Conference</option>
                    <option value="6th_conference">6th Conference</option>
                    <option value="5th_conference">5th Conference</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{drf.conference_attendance || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Area(s) of Work</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="areas"
                    value={formData.areas || ''}
                    onChange={handleChange}
                    placeholder="e.g., Primary, Secondary, Other"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {drf.areas 
                      ? (Array.isArray(drf.areas) 
                          ? drf.areas.join(', ') 
                          : (typeof drf.areas === 'string' 
                              ? drf.areas.split(',').map(s => s.trim()).filter(s => s).join(', ')
                              : drf.areas))
                      : '-'}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Other (Work Area Specification)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="other"
                    value={formData.other || ''}
                    onChange={handleChange}
                    placeholder="Specify other work area"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.other || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Areas of Interest</label>
                {isEditing ? (
                  <textarea
                    name="areas_of_interest"
                    value={formData.areas_of_interest || ''}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">{drf.areas_of_interest || '-'}</p>
                )}
              </div>
              {drf.area_special && (
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Special Area</label>
                  <p className="text-gray-900">{drf.area_special}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-gray-700">Teaching Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{drf.experience || '-'}</p>
                )}
              </div>
            </div>
          </section>

          {/* Additional Information */}
          {(drf.creative_work || drf.student_images) && (
            <section className="bg-green-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drf.creative_work && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Creative Work</label>
                    <p className="text-gray-900">{drf.creative_work}</p>
                  </div>
                )}
                {drf.student_images && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Student Images/File</label>
                    <p className="text-gray-900">{drf.student_images}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Submission Info */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="text-gray-600" size={20} />
              Submission Info
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700">Created At</label>
                <p className="text-gray-900">
                  {new Date(drf.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(drf.updated_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Status</label>
                <p className="text-gray-900">
                  {drf.status || 'Pending'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DRFView;