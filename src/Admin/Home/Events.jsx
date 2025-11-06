import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Calendar, MapPin, Link as LinkIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { websiteAPI, eventAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';

const Events = () => {
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(null);
  const [tempEvent, setTempEvent] = useState({});

  // Fetch conference and events from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch conference (event_type='conference', limit=1, sort by sort_order)
        const conferenceResponse = await websiteAPI.getEvents({ 
          limit: 1, 
          event_type: 'conference' 
        });
        
        if (conferenceResponse.status && conferenceResponse.data.events.length > 0) {
          const conf = conferenceResponse.data.events[0];
          setConference({
            id: conf.id,
            title: conf.title,
            date: conf.date_display || 'TBA',
            location: conf.location,
            cta: conf.link_url || 'Coming soon',
            event_date: conf.event_date,
            event_date_end: conf.event_date_end,
            description: conf.description,
          });
        }

        // Fetch other events (excluding conference)
        const eventsResponse = await websiteAPI.getEvents({ limit: 10 });
        if (eventsResponse.status) {
          // Filter out the conference event
          const otherEvents = eventsResponse.data.events.filter(
            e => e.event_type !== 'conference' || e.id !== (conferenceResponse.data.events[0]?.id)
          );
          setEvents(otherEvents.map(e => ({
            id: e.id,
            title: e.title,
            location: e.location,
            date: e.date_display || 'TBA',
            cta: e.link_url || '#',
          })));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Conference handlers
  const handleUpdateConference = () => {
    // Navigate to EventManagement page to edit the conference
    if (conference?.id) {
      navigate(`/admin/events`);
      // You can also pass the event ID if needed
    }
  };

  const handleDeleteConference = async () => {
    if (window.confirm("Are you sure you want to delete this conference?")) {
      try {
        if (conference?.id) {
          const res = await eventAPI.deleteEvent(conference.id);
          if (res.status) {
            toast.success('Conference deleted');
            setConference(null);
            // Refresh events list
            const eventsResponse = await websiteAPI.getEvents({ limit: 10 });
            if (eventsResponse.status) {
              setEvents(eventsResponse.data.events.map(e => ({
                id: e.id,
                title: e.title,
                location: e.location,
                date: e.date_display || 'TBA',
                cta: e.link_url || '#',
              })));
            }
          } else {
            toast.error('Failed to delete conference');
          }
        }
      } catch (error) {
        console.error('Failed to delete conference:', error);
        toast.error('Failed to delete conference');
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

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
