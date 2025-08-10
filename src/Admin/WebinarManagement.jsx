import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3,
  Eye,
  Save,
  Globe,
  Video,
  Users,
  Settings,
  Search,
  Filter
} from 'lucide-react';

const WebinarManagement = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      upcomingWebinar: {
        bannerImage: '',
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        registrationLink: '',
        topic: '',
        guestSpeaker: '',
        topicDescription: ''
      },
      previousWebinars: [],
      webinarSettings: {
        pageTitle: 'AINET Webinars',
        searchEnabled: true,
        filterOptions: ['All', 'Upcoming', 'Past', 'By Topic', 'By Speaker'],
        locationTypes: ['Google Meet', 'Zoom', 'Microsoft Teams', 'In-Person', 'Hybrid']
      }
    }
  });

  const { fields: previousWebinarFields, append: appendPreviousWebinar, remove: removePreviousWebinar } = useFieldArray({
    control,
    name: "previousWebinars"
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('webinarData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key]) {
            setValue(key, parsedData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading webinar data:', error);
      }
    }
  }, [setValue]);

  // Save data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('webinarData', JSON.stringify(data));
  };

  const onSubmit = (data) => {
    saveToLocalStorage(data);
    toast.success('Webinar data saved successfully!');
  };

  const addPreviousWebinar = () => {
    appendPreviousWebinar({
      title: '',
      date: '',
      image: '',
      description: '',
      guestSpeaker: ''
    });
  };

  const removePreviousWebinarItem = (index) => {
    removePreviousWebinar(index);
  };

  const renderUpcomingWebinarForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Webinar Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image URL
            </label>
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                {...register("upcomingWebinar.bannerImage", { required: "Banner image is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/webinar-banner.jpg"
              />
            </div>
            {errors.upcomingWebinar?.bannerImage && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.bannerImage.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webinar Title
            </label>
            <input
              type="text"
              {...register("upcomingWebinar.title", { required: "Webinar title is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter webinar title"
            />
            {errors.upcomingWebinar?.title && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.title.message}</p>
            )}
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register("upcomingWebinar.startDate", { required: "Start date is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.upcomingWebinar?.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="time"
                {...register("upcomingWebinar.startTime", { required: "Start time is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.upcomingWebinar?.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.startTime.message}</p>
            )}
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register("upcomingWebinar.endDate", { required: "End date is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.upcomingWebinar?.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.endDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="time"
                {...register("upcomingWebinar.endTime", { required: "End time is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.upcomingWebinar?.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.endTime.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Platform
            </label>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register("upcomingWebinar.location", { required: "Location is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Google Meet, Zoom, or venue"
              />
            </div>
            {errors.upcomingWebinar?.location && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.location.message}</p>
            )}
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Link
            </label>
            <div className="flex items-center space-x-2">
              <Link className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                {...register("upcomingWebinar.registrationLink", { required: "Registration link is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/register"
              />
            </div>
            {errors.upcomingWebinar?.registrationLink && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.registrationLink.message}</p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webinar Topic
            </label>
            <input
              type="text"
              {...register("upcomingWebinar.topic", { required: "Topic is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Main webinar topic"
            />
            {errors.upcomingWebinar?.topic && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.topic.message}</p>
            )}
          </div>

          {/* Guest Speaker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guest Speaker Name
            </label>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register("upcomingWebinar.guestSpeaker", { required: "Guest speaker is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Speaker's full name"
              />
            </div>
            {errors.upcomingWebinar?.guestSpeaker && (
              <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.guestSpeaker.message}</p>
            )}
          </div>
        </div>

        {/* Topic Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Description
          </label>
          <textarea
            {...register("upcomingWebinar.topicDescription", { required: "Topic description is required" })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the webinar topic in detail..."
          />
          {errors.upcomingWebinar?.topicDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.upcomingWebinar.topicDescription.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPreviousWebinarsForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Video className="w-5 h-5 mr-2 text-blue-600" />
            Previous Webinars
          </h3>
          <button
            type="button"
            onClick={addPreviousWebinar}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Webinar
          </button>
        </div>

        <div className="space-y-4">
          {previousWebinarFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webinar Title
                  </label>
                  <input
                    {...register(`previousWebinars.${index}.title`)}
                    placeholder="Webinar title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    {...register(`previousWebinars.${index}.date`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Speaker
                  </label>
                  <input
                    {...register(`previousWebinars.${index}.guestSpeaker`)}
                    placeholder="Speaker name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    {...register(`previousWebinars.${index}.image`)}
                    placeholder="https://example.com/webinar-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register(`previousWebinars.${index}.description`)}
                    placeholder="Webinar description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removePreviousWebinarItem(index)}
                  className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWebinarSettingsForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Webinar Page Settings
        </h3>

        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              {...register("webinarSettings.pageTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AINET Webinars"
            />
          </div>

          {/* Search Toggle */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("webinarSettings.searchEnabled")}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Enable search functionality</span>
            </label>
          </div>

          {/* Filter Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Options
            </label>
            <div className="space-y-2">
              {watch("webinarSettings.filterOptions")?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...watch("webinarSettings.filterOptions")];
                      newOptions[index] = e.target.value;
                      setValue("webinarSettings.filterOptions", newOptions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = watch("webinarSettings.filterOptions").filter((_, i) => i !== index);
                      setValue("webinarSettings.filterOptions", newOptions);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newOptions = [...watch("webinarSettings.filterOptions"), "New Filter"];
                  setValue("webinarSettings.filterOptions", newOptions);
                }}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Filter Option
              </button>
            </div>
          </div>

          {/* Location Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Platform Types
            </label>
            <div className="space-y-2">
              {watch("webinarSettings.locationTypes")?.map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => {
                      const newTypes = [...watch("webinarSettings.locationTypes")];
                      newTypes[index] = e.target.value;
                      setValue("webinarSettings.locationTypes", newTypes);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTypes = watch("webinarSettings.locationTypes").filter((_, i) => i !== index);
                      setValue("webinarSettings.locationTypes", newTypes);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTypes = [...watch("webinarSettings.locationTypes"), "New Platform"];
                  setValue("webinarSettings.locationTypes", newTypes);
                }}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Platform Type
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Eye className="w-5 h-5 mr-2 text-blue-600" />
        Preview
      </h3>
      <div className="text-center py-12 text-gray-500">
        <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Webinar Page Preview</p>
        <p className="text-sm">Preview functionality will be implemented here</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Webinar Management</h1>
          <p className="mt-2 text-gray-600">
            Manage webinar page content, upcoming events, and previous webinars
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Edit3 className="w-4 h-4 inline mr-2" />
              Edit Mode
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview Mode
            </button>
          </div>

          {!isPreviewMode && (
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Publish
            </button>
          )}
        </div>

        {isPreviewMode ? (
          renderPreview()
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'upcoming', label: 'Upcoming Webinar', icon: Video },
                    { id: 'previous', label: 'Previous Webinars', icon: Calendar },
                    { id: 'settings', label: 'Webinar Settings', icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 inline mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'upcoming' && renderUpcomingWebinarForm()}
                {activeTab === 'previous' && renderPreviousWebinarsForm()}
                {activeTab === 'settings' && renderWebinarSettingsForm()}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WebinarManagement; 