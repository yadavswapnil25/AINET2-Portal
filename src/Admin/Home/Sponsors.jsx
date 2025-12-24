import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { websiteAPI } from "../../utils/api";
import { toast } from "react-hot-toast";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sponsors from public website API
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setIsLoading(true);
        const response = await websiteAPI.getSponsors();
        if (response.status && response.data.sponsors) {
          setSponsors(
            response.data.sponsors.map((s) => ({
              id: s.id,
              logo: s.logo_url || "https://via.placeholder.com/80",
              title: s.name,
              subtitle: s.subtitle || "",
              link_url: s.link_url,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
        toast.error("Failed to load sponsors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const handleManageSponsors = () => {
    window.location.href = "/admin/sponsors";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading sponsors...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Our Sponsors</h2>
        <button
          onClick={handleManageSponsors}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded bg-teal-600 text-white hover:bg-teal-700"
        >
          <Pencil size={16} />
          Manage Sponsors
        </button>
      </div>

      {sponsors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Logo</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Subtitle</th>
                <th className="p-3 border text-center">Link</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((sponsor, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.title}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                  </td>
                  <td className="p-3 border">{sponsor.title}</td>
                  <td className="p-3 border">{sponsor.subtitle}</td>
                  <td className="p-3 border text-center">
                    {sponsor.link_url ? (
                      <a
                        href={sponsor.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 underline text-sm"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">No sponsors available</p>
      )}
    </div>
  );
};

export default Sponsors;


