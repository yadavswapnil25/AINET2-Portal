import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { websiteAPI } from '../utils/api';

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_no: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await websiteAPI.subscribeNewsletter({
        name: formData.name,
        email: formData.email,
        whatsapp_no: formData.whatsapp_no || null,
      });

      if (response.status) {
        toast.success('Successfully subscribed to newsletter!');
        setFormData({
          name: '',
          email: '',
          whatsapp_no: '',
        });
      } else {
        toast.error(response.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-8" style={{
      background: 'linear-gradient(135deg, #e0e7ef 0%, #d1f2eb 100%)',
      borderRadius: '16px',
    }}>
      <h2 className="text-4xl font-light text-gray-600 mb-8 leading-tight">
        Stay Curious,<br />
        Stay Informed!
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        
        <input
          type="email"
          placeholder="Enter your Mail Id"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        
        <input
          type="text"
          placeholder="Enter your WhatsApp No."
          value={formData.whatsapp_no}
          onChange={(e) => setFormData({ ...formData, whatsapp_no: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-bold text-gray-800 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;

