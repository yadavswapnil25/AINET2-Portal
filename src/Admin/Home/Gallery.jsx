import React, { useState } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";

const Gallery = () => {
  const [banners, setBanners] = useState([
    { url: "https://via.placeholder.com/600x200" },
    { url: "https://via.placeholder.com/600x200?text=Banner+2" },
  ]);

  const [gridImages, setGridImages] = useState([
    { url: "https://via.placeholder.com/200" },
    { url: "https://via.placeholder.com/200?text=Grid+2" },
    { url: "https://via.placeholder.com/200?text=Grid+3" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(""); // "banner" | "grid"
  const [currentIndex, setCurrentIndex] = useState(null);
  const [tempImage, setTempImage] = useState({ url: "" });

  // Open modal for Add or Edit
  const openModal = (section, index = null) => {
    setCurrentSection(section);
    setCurrentIndex(index);
    if (index !== null) {
      setTempImage(section === "banner" ? banners[index] : gridImages[index]);
    } else {
      setTempImage({ url: "" });
    }
    setIsModalOpen(true);
  };

  // Save image (Add or Edit)
  const handleSave = () => {
    if (currentSection === "banner") {
      const updated = [...banners];
      if (currentIndex !== null) {
        updated[currentIndex] = tempImage; // Update
      } else {
        updated.push(tempImage); // Add new
      }
      setBanners(updated);
    } else {
      const updated = [...gridImages];
      if (currentIndex !== null) {
        updated[currentIndex] = tempImage;
      } else {
        updated.push(tempImage);
      }
      setGridImages(updated);
    }
    setIsModalOpen(false);
  };

  // Delete image
  const handleDelete = (section, index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      if (section === "banner") {
        setBanners(banners.filter((_, i) => i !== index));
      } else {
        setGridImages(gridImages.filter((_, i) => i !== index));
      }
    }
  };

  return (
    <div className=" relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Gallery</h2>

      {/* Banner Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">
            Horizontal Banners
          </h3>
          <button
            onClick={() => openModal("banner")}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow"
          >
            <Plus size={16} className="mr-2" /> Add Banner
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Preview</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">
                    <img
                      src={banner.url}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => openModal("banner", index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete("banner", index)}
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
      </div>

      {/* Grid Images Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Grid Images</h3>
          <button
            onClick={() => openModal("grid")}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow"
          >
            <Plus size={16} className="mr-2" /> Add Image
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Preview</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {gridImages.map((img, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">
                    <img
                      src={img.url}
                      alt={`Grid ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => openModal("grid", index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete("grid", index)}
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
      </div>

      {/* Image Modal */}
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
              {currentIndex !== null ? "Update Image" : "Add Image"}
            </h3>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">
                Image Upload
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setTempImage({
                      ...tempImage,
                      url: URL.createObjectURL(file),
                    });
                  }
                }}
                className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
              />
            </label>

            {tempImage.url && (
              <div className="mb-4">
                <img
                  src={tempImage.url}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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

export default Gallery;
