import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { websiteAPI } from "../../utils/api";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setIsLoading(true);
        const response = await websiteAPI.getGalleries();
        if (response.status && response.data.galleries) {
          setGalleries(response.data.galleries);
        }
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
        toast.error("Failed to load galleries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading galleries...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Gallery</h2>

      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No galleries available</p>
          <button
            onClick={() => navigate("/admin/galleries")}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm"
          >
            Add Gallery Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={gallery.image_url || "https://via.placeholder.com/400x300"}
                  alt={gallery.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/galleries`)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    title="Edit"
                  >
                    <Pencil size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/galleries`)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{gallery.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
