import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  User,
  Image as ImageIcon,
  X,
} from "lucide-react";

const News = () => {
  const [newsList, setNewsList] = useState([
    {
      title: "AINET 2025 Launch Event",
      banner: "",
      author: "Dr. Sharma",
      authorImage: "",
      dateTime: "2025-08-01T10:30",
      content: "Exciting updates about the new AINET conference in 2025...",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempNews, setTempNews] = useState({});
  const [currentNewsIndex, setCurrentNewsIndex] = useState(null);

  // Add or update news
  const handleSaveNews = () => {
    if (currentNewsIndex !== null) {
      const updatedList = [...newsList];
      updatedList[currentNewsIndex] = tempNews;
      setNewsList(updatedList);
    } else {
      setNewsList([...newsList, tempNews]);
    }
    setIsModalOpen(false);
    setTempNews({});
    setCurrentNewsIndex(null);
  };

  // Open modal for editing
  const handleEditNews = (index) => {
    setTempNews(newsList[index]);
    setCurrentNewsIndex(index);
    setIsModalOpen(true);
  };

  // Delete news
  const handleDeleteNews = (index) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      setNewsList(newsList.filter((_, i) => i !== index));
    }
  };

  return (
    <div className=" relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">News Section</h2>

      {/* Add News Button */}
      <button
        onClick={() => {
          setTempNews({
            title: "",
            banner: "",
            author: "",
            authorImage: "",
            dateTime: "",
            content: "",
          });
          setCurrentNewsIndex(null);
          setIsModalOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
      >
        + Add News
      </button>

      {/* News Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Banner</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Author Image</th>
              <th className="p-3 text-left">Publish Date & Time</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsList.length > 0 ? (
              newsList.map((news, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{news.title}</td>
                  <td className="p-3">
                    {news.banner ? (
                      <img
                        src={news.banner}
                        alt="News Banner"
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Banner</span>
                    )}
                  </td>
                  <td className="p-3">{news.author}</td>
                  <td className="p-3">
                    {news.authorImage ? (
                      <img
                        src={news.authorImage}
                        alt="Author"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-3">{news.dateTime}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleEditNews(index)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(index)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No news available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentNewsIndex !== null ? "Update News" : "Add News"}
            </h3>

            {/* Title */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                type="text"
                value={tempNews.title}
                onChange={(e) =>
                  setTempNews({ ...tempNews, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>

            {/* Banner */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">
                News Banner
              </span>
              <input
                type="file"
                onChange={(e) =>
                  setTempNews({
                    ...tempNews,
                    banner: URL.createObjectURL(e.target.files[0]),
                  })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>

            {/* Author Name */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">
                Author Name
              </span>
              <input
                type="text"
                value={tempNews.author}
                onChange={(e) =>
                  setTempNews({ ...tempNews, author: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>

            {/* Author Image */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">
                Author Image
              </span>
              <input
                type="file"
                onChange={(e) =>
                  setTempNews({
                    ...tempNews,
                    authorImage: URL.createObjectURL(e.target.files[0]),
                  })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>

            {/* Publish Date & Time */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">
                Publish Date & Time
              </span>
              <input
                type="datetime-local"
                value={tempNews.dateTime}
                onChange={(e) =>
                  setTempNews({ ...tempNews, dateTime: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>

            {/* Content */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">
                News Content
              </span>
              <textarea
                value={tempNews.content}
                onChange={(e) =>
                  setTempNews({ ...tempNews, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-3 h-28"
              />
            </label>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNews}
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

export default News;
