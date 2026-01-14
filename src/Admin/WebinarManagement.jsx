import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Video, 
  Calendar, 
  Clock, 
  MapPin, 
  Link, 
  Users, 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  Edit3, 
  Save 
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
        topicDescription: '',
        isLive: false,
        streamType: '',
        streamUrl: '',
        embedCode: '',
        streamId: ''
      },
      previousWebinars: [],
      webinarSettings: {
        pageTitle: 'AINET Webinars',
        searchEnabled: true,
        filterOptions: ['All', 'Upcoming', 'Previous'],
        locationTypes: ['Google Meet', 'Zoom', 'Physical Venue']
      }
    }
  });

  const { fields: previousWebinarFields, append: appendPreviousWebinar, remove: removePreviousWebinarField } = useFieldArray({
    control,
    name: 'previousWebinars'
  });

  const addPreviousWebinar = () => {
    appendPreviousWebinar({
      title: '',
      date: '',
      guestSpeaker: '',
      image: '',
      description: ''
    });
  };

  const removePreviousWebinarItem = (index) => {
    removePreviousWebinarField(index);
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    // Save to localStorage for now
    localStorage.setItem('webinarData', JSON.stringify(data));
    alert('Webinar data saved successfully!');
  };

  // Load saved data on component mount
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
        console.error('Error loading saved data:', error);
      }
    }
  }, [setValue]);

  const renderUpcomingWebinarForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Video className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Webinar
          </h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Banner Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image URL
            </label>
            <input
              type="url"
              {...register("upcomingWebinar.bannerImage", { required: "Banner image is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/banner-image.jpg"
            />
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

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
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

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
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

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
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

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
          </div>

          {/* Location & Registration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location/Platform
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                <Link className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
          </div>

          {/* Topic & Speaker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
          <div>
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

          {/* Live Streaming Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2 text-red-600" />
              Live Streaming Settings
            </h4>

            {/* Enable Live Stream */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("upcomingWebinar.isLive")}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Enable live streaming on website</span>
              </label>
            </div>

            {/* Stream Type */}
            {watch("upcomingWebinar.isLive") && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream Platform
                  </label>
                  <select
                    {...register("upcomingWebinar.streamType")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select platform</option>
                    <option value="youtube">YouTube Live</option>
                    <option value="facebook">Facebook Live</option>
                    <option value="zoom">Zoom</option>
                    <option value="embed">Custom Embed Code</option>
                    <option value="custom">Custom Stream URL</option>
                  </select>
                </div>

                {/* Stream URL */}
                {watch("upcomingWebinar.streamType") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream URL
                    </label>
                    <input
                      type="url"
                      {...register("upcomingWebinar.streamUrl")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/watch?v=... or https://facebook.com/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For YouTube/Facebook: Paste the full video URL
                    </p>
                  </div>
                )}

                {/* Stream ID (for YouTube/Facebook) */}
                {(watch("upcomingWebinar.streamType") === 'youtube' || watch("upcomingWebinar.streamType") === 'facebook') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video ID (Optional - extracted from URL if not provided)
                    </label>
                    <input
                      type="text"
                      {...register("upcomingWebinar.streamId")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Video ID (e.g., dQw4w9WgXcQ)"
                    />
                  </div>
                )}

                {/* Embed Code */}
                {(watch("upcomingWebinar.streamType") === 'embed' || watch("upcomingWebinar.streamType") === 'zoom') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Embed Code
                    </label>
                    <textarea
                      {...register("upcomingWebinar.embedCode")}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Paste the iframe embed code here..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste the complete iframe code from your streaming platform
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviousWebinarsForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Video className="w-5 h-5 mr-2 text-blue-600" />
            Previous Webinars
          </h3>
          <button
            type="button"
            onClick={addPreviousWebinar}
            className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Webinar
          </button>
        </div>

        <div className="space-y-4">
          {previousWebinarFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="sm:col-span-2">
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

                <div className="sm:col-span-2">
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Webinar Page Settings
        </h3>

        <div className="space-y-4 sm:space-y-6">
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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <Eye className="w-5 h-5 mr-2 text-blue-600" />
        Preview
      </h3>
      <div className="text-center py-8 sm:py-12 text-gray-500">
        <Video className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-base sm:text-lg font-medium">Webinar Page Preview</p>
        <p className="text-sm">Preview functionality will be implemented here</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Webinar Management</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage webinar page content, upcoming events, and previous webinars
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
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
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
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
              className="flex items-center justify-center px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Publish
            </button>
          )}
        </div>

        {isPreviewMode ? (
          renderPreview()
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                  {[
                    { id: 'upcoming', label: 'Upcoming Webinar', icon: Video },
                    { id: 'previous', label: 'Previous Webinars', icon: Calendar },
                    { id: 'settings', label: 'Webinar Settings', icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

              <div className="p-4 sm:p-6">
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