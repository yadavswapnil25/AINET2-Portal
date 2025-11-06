import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { websiteAPI } from "../../utils/api";
import { Play, Eye } from "lucide-react";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await websiteAPI.getNews();
        if (response.status && response.data.news) {
          setNewsList(response.data.news);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        toast.error("Failed to load news");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">AINET In News</h2>

      {newsList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No news available</p>
          <button
            onClick={() => navigate("/admin/news-management")}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm"
          >
            Add News
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {newsList.map((newsItem) => (
            <div key={newsItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Publisher Header */}
              <div className="relative bg-red-600 p-6">
                {newsItem.location && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">
                    {newsItem.location}
                  </div>
                )}
                <div className="flex items-center justify-center h-16">
                  {newsItem.publisher_logo_url ? (
                    <img src={newsItem.publisher_logo_url} alt={newsItem.publisher_name} className="h-12 object-contain" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{newsItem.publisher_name || 'N/A'}</span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  {newsItem.has_video && (
                    <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Play size={16} className="text-white" />
                    </div>
                  )}
                  {newsItem.view_count > 0 && (
                    <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* News Content */}
              <div className="p-6">
                {newsItem.conference_name && (
                  <p className="text-xs text-gray-500 uppercase mb-2">{newsItem.conference_name}</p>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 underline">
                  {newsItem.link_url ? (
                    <a href={newsItem.link_url} target="_blank" rel="noreferrer" className="hover:text-teal-600">
                      {newsItem.title}
                    </a>
                  ) : (
                    newsItem.title
                  )}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{newsItem.summary}</p>
                {newsItem.published_date && (
                  <p className="text-xs text-gray-500 mt-3">
                    Published: {new Date(newsItem.published_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
