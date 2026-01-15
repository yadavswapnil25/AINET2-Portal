import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft,
  Star,
  MessageSquare,
  Mail,
  User,
  Calendar,
  FileText,
  Trash2,
} from 'lucide-react';
import { feedbackAPI } from '../utils/api';

const FeedbackView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await feedbackAPI.getFeedback(id);
        if (response.status) {
          setFeedback(response.data.feedback);
        } else {
          toast.error('Failed to load feedback');
          navigate('/admin/feedback');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast.error('Failed to load feedback details');
        navigate('/admin/feedback');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return '-';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Feedback not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/feedback')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to feedback list"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Feedback Details</h1>
            <p className="text-sm text-gray-600">Feedback ID: {feedback.id}</p>
          </div>
        </div>
      </div>

      {/* Feedback Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Rating */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
            <Star className="text-yellow-400" size={18} />
            Rating
          </label>
          <div className="mt-1">
            {renderStars(feedback.rating)}
          </div>
        </div>

        {/* Name */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
            <User size={18} className="text-gray-400" />
            Name
          </label>
          <p className="text-gray-900">{feedback.name || '-'}</p>
        </div>

        {/* Email */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
            <Mail size={18} className="text-gray-400" />
            Email
          </label>
          {feedback.email ? (
            <a href={`mailto:${feedback.email}`} className="text-blue-600 hover:underline">
              {feedback.email}
            </a>
          ) : (
            <p className="text-gray-500">-</p>
          )}
        </div>

        {/* Comment */}
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-gray-400" />
            Comment
          </label>
          {feedback.comment ? (
            <p className="text-gray-900 whitespace-pre-wrap">{feedback.comment}</p>
          ) : (
            <p className="text-gray-400 italic">No comment provided</p>
          )}
        </div>

        {/* DRF ID */}
        {feedback.drf_id && (
          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
              <FileText size={18} className="text-gray-400" />
              Related DRF
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-900">#{feedback.drf_id}</span>
              <button
                onClick={() => navigate(`/admin/drfs/${feedback.drf_id}`)}
                className="text-teal-600 hover:text-teal-900 text-sm font-medium"
              >
                View DRF
              </button>
            </div>
          </div>
        )}

        {/* DRF Details (if loaded) */}
        {feedback.drf && (
          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm font-bold text-gray-700 mb-2">DRF Information</label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {feedback.drf.name || '-'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {feedback.drf.email || '-'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Institution:</span> {feedback.drf.institution || '-'}
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-gray-400" />
              Created At
            </label>
            <p className="text-gray-900">{formatDate(feedback.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-gray-400" />
              Updated At
            </label>
            <p className="text-gray-900">{formatDate(feedback.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;












