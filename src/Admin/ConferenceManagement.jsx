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
  BookOpen,
  Users,
  Settings
} from 'lucide-react';

const ConferenceManagement = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      currentConference: {
        bannerImage: '',
        fullTitle: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        registrationLink: '',
        theme: '',
        themeDescription: '',
        subThemes: []
      },
      previousConferences: [],
      conferenceDetails: {
        pageTitle: 'AINET Conferences',
        searchEnabled: true,
        filterOptions: ['All', 'Upcoming', 'Past', 'By Location', 'By Theme']
      }
    }
  });

  const { fields: subThemeFields, append: appendSubTheme, remove: removeSubTheme } = useFieldArray({
    control,
    name: "currentConference.subThemes"
  });

  const { fields: previousConferenceFields, append: appendPreviousConference, remove: removePreviousConference } = useFieldArray({
    control,
    name: "previousConferences"
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('conferenceData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key]) {
            setValue(key, parsedData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading conference data:', error);
      }
    }
  }, [setValue]);

  // Save data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('conferenceData', JSON.stringify(data));
  };

  const onSubmit = (data) => {
    saveToLocalStorage(data);
    toast.success('Conference data saved successfully!');
  };

  const addSubTheme = () => {
    appendSubTheme({ title: '', description: '' });
  };

  const addPreviousConference = () => {
    appendPreviousConference({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      image: '',
      description: ''
    });
  };

  const removePreviousConferenceItem = (index) => {
    removePreviousConference(index);
  };

  const renderCurrentConferenceForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Current Conference Details
        </h3>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image URL
            </label>
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="url"
                {...register("currentConference.bannerImage", { required: "Banner image is required" })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/banner-image.jpg"
              />
            </div>
            {errors.currentConference?.bannerImage && (
              <p className="text-red-500 text-sm mt-1">{errors.currentConference.bannerImage.message}</p>
            )}
          </div>

          {/* Full Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Conference Title
            </label>
            <input
              type="text"
              {...register("currentConference.fullTitle", { required: "Conference title is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full conference title"
            />
            {errors.currentConference?.fullTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.currentConference.fullTitle.message}</p>
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
                  {...register("currentConference.startDate", { required: "Start date is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.currentConference?.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.startDate.message}</p>
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
                  {...register("currentConference.startTime", { required: "Start time is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.currentConference?.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.startTime.message}</p>
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
                  {...register("currentConference.endDate", { required: "End date is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.currentConference?.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.endDate.message}</p>
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
                  {...register("currentConference.endTime", { required: "End time is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.currentConference?.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location & Registration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  {...register("currentConference.location", { required: "Location is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Conference venue"
                />
              </div>
              {errors.currentConference?.location && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.location.message}</p>
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
                  {...register("currentConference.registrationLink", { required: "Registration link is required" })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/register"
                />
              </div>
              {errors.currentConference?.registrationLink && (
                <p className="text-red-500 text-sm mt-1">{errors.currentConference.registrationLink.message}</p>
              )}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conference Theme
            </label>
            <input
              type="text"
              {...register("currentConference.theme", { required: "Theme is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Main conference theme"
            />
            {errors.currentConference?.theme && (
              <p className="text-red-500 text-sm mt-1">{errors.currentConference.theme.message}</p>
            )}
          </div>

          {/* Theme Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme Description
            </label>
            <textarea
              {...register("currentConference.themeDescription", { required: "Theme description is required" })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the conference theme in detail..."
            />
            {errors.currentConference?.themeDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.currentConference.themeDescription.message}</p>
            )}
          </div>

          {/* Sub-themes Management */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Sub-themes
              </label>
              <button
                type="button"
                onClick={addSubTheme}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-theme
              </button>
            </div>

            <div className="space-y-4">
              {subThemeFields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <input
                      {...register(`currentConference.subThemes.${index}.title`)}
                      placeholder="Sub-theme title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      {...register(`currentConference.subThemes.${index}.description`)}
                      placeholder="Sub-theme description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubTheme(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors self-start sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviousConferencesForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Previous Conferences
          </h3>
          <button
            type="button"
            onClick={addPreviousConference}
            className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Conference
          </button>
        </div>

        <div className="space-y-4">
          {previousConferenceFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conference Title
                  </label>
                  <input
                    {...register(`previousConferences.${index}.title`)}
                    placeholder="Conference title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    {...register(`previousConferences.${index}.location`)}
                    placeholder="Conference location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register(`previousConferences.${index}.startDate`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register(`previousConferences.${index}.endDate`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    {...register(`previousConferences.${index}.image`)}
                    placeholder="https://example.com/conference-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register(`previousConferences.${index}.description`)}
                    placeholder="Conference description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removePreviousConferenceItem(index)}
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

  const renderConferenceDetailsForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Conference Page Settings
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              {...register("conferenceDetails.pageTitle")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AINET Conferences"
            />
          </div>

          {/* Search Toggle */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("conferenceDetails.searchEnabled")}
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
              {watch("conferenceDetails.filterOptions")?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...watch("conferenceDetails.filterOptions")];
                      newOptions[index] = e.target.value;
                      setValue("conferenceDetails.filterOptions", newOptions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = watch("conferenceDetails.filterOptions").filter((_, i) => i !== index);
                      setValue("conferenceDetails.filterOptions", newOptions);
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
                  const newOptions = [...watch("conferenceDetails.filterOptions"), "New Filter"];
                  setValue("conferenceDetails.filterOptions", newOptions);
                }}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Filter Option
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
        <Globe className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-base sm:text-lg font-medium">Conference Page Preview</p>
        <p className="text-sm">Preview functionality will be implemented here</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conference Management</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage conference page content, upcoming events, and previous conferences
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
                    { id: 'current', label: 'Current Conference', icon: BookOpen },
                    { id: 'previous', label: 'Previous Conferences', icon: Calendar },
                    { id: 'details', label: 'Conference Details', icon: Settings }
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
                {activeTab === 'current' && renderCurrentConferenceForm()}
                {activeTab === 'previous' && renderPreviousConferencesForm()}
                {activeTab === 'details' && renderConferenceDetailsForm()}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConferenceManagement; 