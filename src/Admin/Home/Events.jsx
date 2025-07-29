import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, MapPin, Link as LinkIcon, X } from 'lucide-react';

const Events = () => {
  const [conference, setConference] = useState({
    title: "9th AINET International Conference",
    date: "January 2026",
    location: "January 2026 Lucknow, India",
    cta: "Coming soon",
  });

  const [events, setEvents] = useState([
    {
      title: "AINET Foundation Week Programmes.",
      location: "Online",
      date: "5 - 12 September 2025",
      cta: "/haja",
    },
    {
      title: "Rural ELT Conference.",
      location: "Maharashtra",
      date: "October 2025",
      cta: "/jasasja/sahsha",
    },
    {
      title: "Webinar on HELE.",
      location: "Online",
      date: "TBA",
      cta: "/sasaskasias/sajsja",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempConference, setTempConference] = useState(conference);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(null);
  const [tempEvent, setTempEvent] = useState({});

  // Conference handlers
  const handleUpdateConference = () => {
    setTempConference(conference);
    setIsModalOpen(true);
  };

  const handleSaveConference = () => {
    setConference(tempConference);
    setIsModalOpen(false);
  };

  const handleDeleteConference = () => {
    if (window.confirm("Are you sure you want to delete this conference?")) {
      setConference(null);
    }
  };

  // Event handlers
  const handleUpdateEvent = (index) => {
    setCurrentEventIndex(index);
    setTempEvent(events[index]);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    const updatedEvents = [...events];
    updatedEvents[currentEventIndex] = tempEvent;
    setEvents(updatedEvents);
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="">
      {/* UPCOMING CONFERENCE */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Conference</h2>
      {conference ? (
        <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{conference.title}</h3>
          <div className="text-gray-700 space-y-1">
            <p className="flex items-center"><Calendar size={16} className="mr-2 text-blue-500" /> {conference.date}</p>
            <p className="flex items-center"><MapPin size={16} className="mr-2 text-red-500" /> {conference.location}</p>
            <p className="flex items-center"><LinkIcon size={16} className="mr-2 text-green-600" /> {conference.cta}</p>
          </div>
          <div className="flex space-x-3 mt-4">
            <button onClick={handleUpdateConference} className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow">
              <Pencil size={16} className="mr-1" /> Update
            </button>
            <button onClick={handleDeleteConference} className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow">
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No upcoming conference</p>
      )}

      {/* UPCOMING EVENTS */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
      {events.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">CTA Link</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3 border">{event.title}</td>
                  <td className="p-3 border">{event.location}</td>
                  <td className="p-3 border">{event.date}</td>
                  <td className="p-3 border text-blue-600 underline cursor-pointer">{event.cta}</td>
                  <td className="p-3 border text-center flex justify-center space-x-3 h-full">
                    <button onClick={() => handleUpdateEvent(index)} className="text-blue-500 hover:text-blue-700 ">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteEvent(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">No upcoming events</p>
      )}

      {/* Conference Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Conference</h3>
            <input type="text" value={tempConference.title} onChange={(e) => setTempConference({ ...tempConference, title: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Conference Title" />
            <input type="text" value={tempConference.date} onChange={(e) => setTempConference({ ...tempConference, date: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Date" />
            <input type="text" value={tempConference.location} onChange={(e) => setTempConference({ ...tempConference, location: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Location" />
            <input type="text" value={tempConference.cta} onChange={(e) => setTempConference({ ...tempConference, cta: e.target.value })} className="w-full mb-4 border border-gray-300 rounded-md p-3" placeholder="CTA Link" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg">Cancel</button>
              <button onClick={handleSaveConference} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] relative">
            <button onClick={() => setIsEventModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Event</h3>
            <input type="text" value={tempEvent.title} onChange={(e) => setTempEvent({ ...tempEvent, title: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Event Title" />
            <input type="text" value={tempEvent.location} onChange={(e) => setTempEvent({ ...tempEvent, location: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Location" />
            <input type="text" value={tempEvent.date} onChange={(e) => setTempEvent({ ...tempEvent, date: e.target.value })} className="w-full mb-3 border border-gray-300 rounded-md p-3" placeholder="Date" />
            <input type="text" value={tempEvent.cta} onChange={(e) => setTempEvent({ ...tempEvent, cta: e.target.value })} className="w-full mb-4 border border-gray-300 rounded-md p-3" placeholder="CTA Link" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg">Cancel</button>
              <button onClick={handleSaveEvent} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
