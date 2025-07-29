import React, { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

const Partners = () => {
  const [partners, setPartners] = useState([
    {
      logo: "https://via.placeholder.com/80",
      title: "Partner One",
      subtitle: "Leading EdTech Organization",
    },
    {
      logo: "https://via.placeholder.com/80",
      title: "Partner Two",
      subtitle: "International Language Institution",
    },
    {
      logo: "https://via.placeholder.com/80",
      title: "Partner Three",
      subtitle: "Global Research Group",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(null);
  const [tempPartner, setTempPartner] = useState({});

  const handleUpdatePartner = (index) => {
    setCurrentPartnerIndex(index);
    setTempPartner(partners[index]);
    setIsModalOpen(true);
  };

  const handleSavePartner = () => {
    const updatedPartners = [...partners];
    updatedPartners[currentPartnerIndex] = tempPartner;
    setPartners(updatedPartners);
    setIsModalOpen(false);
  };

  const handleDeletePartner = (index) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

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

      {/* Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Update Partner
            </h3>
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Logo URL</span>
              <input
                type="text"
                value={tempPartner.logo}
                onChange={(e) =>
                  setTempPartner({ ...tempPartner, logo: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                type="text"
                value={tempPartner.title}
                onChange={(e) =>
                  setTempPartner({ ...tempPartner, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Subtitle</span>
              <input
                type="text"
                value={tempPartner.subtitle}
                onChange={(e) =>
                  setTempPartner({ ...tempPartner, subtitle: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePartner}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
