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
} from 'lucide-react';
import { ppfAPI } from '../utils/api';

const PPFView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ppf, setPpf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPPF = async () => {
      try {
        setIsLoading(true);
        const response = await ppfAPI.getPPF(id);
        if (response.status) {
          setPpf(response.data.ppf);
        }
      } catch (error) {
        console.error('Error fetching PPF:', error);
        toast.error('Failed to load PPF details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPPF();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!ppf) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">PPF record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/ppfs')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">PPF Details</h1>
            <p className="text-sm text-gray-600">PPF ID: {ppf.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-8">
          {/* Paper Info */}
          <section className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Presentation Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{ppf.pr_title || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nature</label>
                <p className="text-gray-900">
                  <span className="inline-flex px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                    {ppf.pr_nature || '-'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Sub Theme</label>
                <p className="text-gray-900">{ppf.sub_theme || '-'}</p>
              </div>
              {ppf.sub_theme_other && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Other Theme</label>
                  <p className="text-gray-900">{ppf.sub_theme_other}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Abstract</label>
              <p className="text-gray-900 whitespace-pre-wrap mt-1">{ppf.pr_abstract || '-'}</p>
            </div>
          </section>

          {/* Main Presenter */}
          <section className="bg-teal-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="text-teal-600" size={20} />
              Main Presenter
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{ppf.main_title || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900 font-medium">{ppf.main_name || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Briefcase size={16} className="text-gray-500" />
                  Work Place
                </label>
                <p className="text-gray-900">{ppf.main_work || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail size={16} className="text-gray-500" />
                  Email
                </label>
                <a href={`mailto:${ppf.main_email}`} className="text-blue-600 hover:underline">
                  {ppf.main_email || '-'}
                </a>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone size={16} className="text-gray-500" />
                  Phone
                </label>
                <a href={`tel:+${ppf.main_country_code || ''}${ppf.main_phone}`} className="text-blue-600 hover:underline">
                  +{ppf.main_country_code || ''} {ppf.main_phone || '-'}
                </a>
              </div>
              {ppf.pr1_bio && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-gray-900 mt-1">{ppf.pr1_bio}</p>
                </div>
              )}
            </div>
          </section>

          {/* Co-authors */}
          {[1, 2, 3].map((num) => {
            const coEmail = ppf[`co${num}_email`];
            const coName = ppf[`co${num}_name`];
            if (!coName) return null;

            return (
              <section key={num} className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Co-author {num}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <p className="text-gray-900">{ppf[`co${num}_title`] || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900 font-medium">{coName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Briefcase size={16} className="text-gray-500" />
                      Work Place
                    </label>
                    <p className="text-gray-900">{ppf[`co${num}_work`] || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail size={16} className="text-gray-500" />
                      Email
                    </label>
                    {coEmail && (
                      <a href={`mailto:${coEmail}`} className="text-blue-600 hover:underline">
                        {coEmail}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone size={16} className="text-gray-500" />
                      Phone
                    </label>
                    {ppf[`co${num}_phone`] && (
                      <a href={`tel:+${ppf[`co${num}_country_code`] || ''}${ppf[`co${num}_phone`]}`} className="text-blue-600 hover:underline">
                        +{ppf[`co${num}_country_code`] || ''} {ppf[`co${num}_phone`]}
                      </a>
                    )}
                  </div>
                  {ppf[`pr${num + 1}_bio`] && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <p className="text-gray-900 mt-1">{ppf[`pr${num + 1}_bio`]}</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}

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
                  {new Date(ppf.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(ppf.updated_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-gray-900">
                  {ppf.status || 'Pending'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PPFView;
