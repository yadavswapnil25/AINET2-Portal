import React, { useState } from "react";
import { Pencil, Trash2, X, Plus, Link as LinkIcon } from "lucide-react";

const Archives = () => {
  const [conferences, setConferences] = useState([
    { title: "7th AINET Conference, 2024", url: "https://example.com/conf2024" },
    { title: "6th AINET Conference, 2022", url: "https://example.com/conf2022" },
    { title: "5th AINET Conference, 2020", url: "https://example.com/conf2020" },
    { title: "3rd AINET Conference, 2016", url: "https://example.com/conf2016" },
  ]);

  const [events, setEvents] = useState([
    { title: "Teachers' Muse, Vol. 3, 2024", url: "https://example.com/muse2024" },
    { title: "Decentring ELT, 2023", url: "https://example.com/elt2023" },
    { title: "Connecting Eight Effective Classrooms, 2021", url: "https://example.com/class2021" },
    { title: "Research in ELE Directory, 2014", url: "https://example.com/ele2014" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(""); // "conference" | "event"
  const [currentIndex, setCurrentIndex] = useState(null);
  const [tempItem, setTempItem] = useState({ title: "", url: "" });

  const openModal = (section, index = null) => {
    setCurrentSection(section);
    setCurrentIndex(index);
    if (index !== null) {
      setTempItem(section === "conference" ? conferences[index] : events[index]);
    } else {
      setTempItem({ title: "", url: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentSection === "conference") {
      const updated = [...conferences];
      if (currentIndex !== null) {
        updated[currentIndex] = tempItem;
      } else {
        updated.push(tempItem);
      }
      setConferences(updated);
    } else {
      const updated = [...events];
      if (currentIndex !== null) {
        updated[currentIndex] = tempItem;
      } else {
        updated.push(tempItem);
      }
      setEvents(updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (section, index) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      if (section === "conference") {
        setConferences(conferences.filter((_, i) => i !== index));
      } else {
        setEvents(events.filter((_, i) => i !== index));
      }
    }
  };

  return (
    <div className=" relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Archives</h2>

      {/* Archived Conferences */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Archived Conferences</h3>
          <button
            onClick={() => openModal("conference")}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow"
          >
            <Plus size={16} className="mr-2" /> Add Archive Conference
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">URL</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {conferences.map((conf, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">{conf.title}</td>
                  <td className="p-3 border">
                    <a
                      href={conf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <LinkIcon size={16} className="mr-1" /> {conf.url}
                    </a>
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => openModal("conference", index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete("conference", index)}
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

      {/* Archived Other Events */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Archived Other Events</h3>
          <button
            onClick={() => openModal("event")}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow"
          >
            <Plus size={16} className="mr-2" /> Add Archive Event
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">URL</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">{event.title}</td>
                  <td className="p-3 border">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <LinkIcon size={16} className="mr-1" /> {event.url}
                    </a>
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => openModal("event", index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete("event", index)}
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

      {/* Shared Modal */}
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
              {currentIndex !== null ? "Update Archive" : "Add Archive"}
            </h3>
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                type="text"
                value={tempItem.title}
                onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">URL</span>
              <input
                type="text"
                value={tempItem.url}
                onChange={(e) => setTempItem({ ...tempItem, url: e.target.value })}
                placeholder="Enter URL"
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

export default Archives;
