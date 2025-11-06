import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { websiteAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(null);
  const [tempPartner, setTempPartner] = useState({});

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await websiteAPI.getPartners();
        if (response.status && response.data.partners) {
          setPartners(response.data.partners.map(p => ({
            id: p.id,
            logo: p.logo_url || 'https://via.placeholder.com/80',
            title: p.name,
            subtitle: p.subtitle || '',
            link_url: p.link_url,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        toast.error('Failed to load partners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleUpdatePartner = (index) => {
    // Navigate to PartnerManagement page
    window.location.href = '/admin/partners';
  };

  const handleDeletePartner = (index) => {
    // Navigate to PartnerManagement page
    window.location.href = '/admin/partners';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading partners...</p>
      </div>
    );
  }

  return (
    <div className=" relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Our Partners
      </h2>

      {partners.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Logo</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Subtitle</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">
                    <img
                      src={partner.logo}
                      alt={partner.title}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                  </td>
                  <td className="p-3 border">{partner.title}</td>
                  <td className="p-3 border">{partner.subtitle}</td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleUpdatePartner(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">No partners available</p>
      )}

    </div>
  );
};

export default Partners;
