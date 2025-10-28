import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { drfAPI } from '../utils/api';

const DRFView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drf, setDrf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDRF = async () => {
      try {
        setIsLoading(true);
        const response = await drfAPI.getDRF(id);
        if (response.status) {
          setDrf(response.data.drf);
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
            onClick={() => navigate('/admin/drfs')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">DRF Details</h1>
            <p className="text-sm text-gray-600">DRF ID: {drf.id}</p>
          </div>
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
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{drf.pre_title || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900 font-medium">{drf.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Status</label>
                <p className="text-gray-900">
                  <span className={`inline-flex px-2 py-1 rounded text-sm ${
                    drf.is_member === 'Yes' || drf.member 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {drf.is_member === 'Yes' || drf.member ? (drf.member || 'Yes') : 'No'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Registration Type</label>
                <p className="text-gray-900">{drf.you_are_register_as || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <p className="text-gray-900">{drf.age || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-900">{drf.gender || '-'}</p>
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
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail size={16} className="text-gray-500" />
                  Email
                </label>
                <a href={`mailto:${drf.email}`} className="text-blue-600 hover:underline">
                  {drf.email || '-'}
                </a>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone size={16} className="text-gray-500" />
                  Phone
                </label>
                <a href={`tel:+${drf.country_code || ''}${drf.phone_no}`} className="text-blue-600 hover:underline">
                  +{drf.country_code || ''} {drf.phone_no || '-'}
                </a>
              </div>
            </div>
          </section>

          {/* Institution & Address */}
          <section className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="text-purple-600" size={20} />
              Institution & Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Briefcase size={16} className="text-gray-500" />
                  Institution
                </label>
                <p className="text-gray-900">{drf.institution || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{drf.address || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <p className="text-gray-900">{drf.city || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">State</label>
                <p className="text-gray-900">{drf.state || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pincode</label>
                <p className="text-gray-900">{drf.pincode || '-'}</p>
              </div>
            </div>
          </section>

          {/* Conference & Areas */}
          <section className="bg-amber-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="text-amber-600" size={20} />
              Conference & Areas of Interest
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Conference Activities</label>
                <p className="text-gray-900">{drf.conference || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Areas of Interest</label>
                <p className="text-gray-900 whitespace-pre-wrap">{drf.areas || '-'}</p>
              </div>
              {drf.area_special && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Special Area</label>
                  <p className="text-gray-900">{drf.area_special}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <p className="text-gray-900">{drf.experience || '-'}</p>
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
                    <label className="text-sm font-medium text-gray-700">Creative Work</label>
                    <p className="text-gray-900">{drf.creative_work}</p>
                  </div>
                )}
                {drf.student_images && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Student Images/File</label>
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
                <label className="text-sm font-medium text-gray-700">Created At</label>
                <p className="text-gray-900">
                  {new Date(drf.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(drf.updated_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
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