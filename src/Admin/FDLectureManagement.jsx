import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  Search,
  Filter,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const FDLectureManagement = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      pageTitle: "Faculty Development Lectures",
      generalSettings: {
        searchEnabled: true,
        filterEnabled: true,
        showUpcoming: true,
        showPrevious: true
      },
      upcomingLecture: {
        bannerImage: "",
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        registrationLink: "",
        topic: "",
        guestSpeaker: ""
      },
      previousLectures: []
    }
  });

  const { fields: previousLectureFields, append: appendPreviousLecture, remove: removePreviousLectureField } = useFieldArray({
    control,
    name: "previousLectures"
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('fdLectureData');
    if (savedData) {
      try {
        reset(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading FDLecture data:', error);
      }
    }
  }, [reset]);

  // Save data to localStorage whenever form changes
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('fdLectureData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('fdLectureData', JSON.stringify(data));
      toast.success('FDLecture data saved successfully!');
      reset(data);
    } catch (error) {
      toast.error('Error saving FDLecture data');
    } finally {
      setIsSaving(false);
    }
  };

  const addPreviousLecture = () => {
    const newLecture = {
      image: "",
      title: "",
      date: "",
      description: ""
    };
    appendPreviousLecture(newLecture);
  };

  const removePreviousLecture = (index) => {
    removePreviousLectureField(index);
  };

  const renderUpcomingLectureForm = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Upcoming FDLecture Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
          <input
            type="text"
            {...register("upcomingLecture.bannerImage")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter banner image URL"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            {...register("upcomingLecture.title", { required: "Title is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter lecture title"
          />
          {errors.upcomingLecture?.title && (
            <p className="text-red-500 text-sm mt-1">{errors.upcomingLecture.title.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            {...register("upcomingLecture.startDate", { required: "Start date is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.upcomingLecture?.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.upcomingLecture.startDate.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
          <input
            type="time"
            {...register("upcomingLecture.startTime", { required: "Start time is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.upcomingLecture?.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.upcomingLecture.startTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            {...register("upcomingLecture.endDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
          <input
            type="time"
            {...register("upcomingLecture.endTime")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            {...register("upcomingLecture.location")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter location"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
          <input
            type="url"
            {...register("upcomingLecture.registrationLink")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter registration URL"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guest Speaker</label>
        <input
          type="text"
          {...register("upcomingLecture.guestSpeaker")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter guest speaker name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Topic Description</label>
        <textarea
          {...register("upcomingLecture.topic")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter detailed topic description"
        />
      </div>
    </div>
  );

  const renderPreviousLecturesForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Previous FDLectures
        </h3>
        <button
          type="button"
          onClick={addPreviousLecture}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Lecture
        </button>
      </div>

      {previousLectureFields.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No previous lectures added yet.</p>
          <p className="text-sm">Click "Add Lecture" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {previousLectureFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Lecture {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePreviousLecture(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    {...register(`previousLectures.${index}.image`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    {...register(`previousLectures.${index}.title`, { required: "Title is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter lecture title"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    {...register(`previousLectures.${index}.date`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register(`previousLectures.${index}.description`)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter lecture description"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGeneralSettingsForm = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        General Settings
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
        <input
          type="text"
          {...register("pageTitle")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter page title"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Page Features</h4>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("generalSettings.searchEnabled")}
              className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Enable search functionality</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("generalSettings.filterEnabled")}
              className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Enable filter options</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("generalSettings.showUpcoming")}
              className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Show upcoming lecture section</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("generalSettings.showPrevious")}
              className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Show previous lectures section</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">FDLecture Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage faculty development lecture content and settings</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md transition-colors ${
              isPreviewMode 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Eye size={16} className="mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          
          <button
            type="submit"
            form="fdLectureForm"
            disabled={isSaving || !isDirty}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              !isPreviewMode
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              isPreviewMode
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Preview
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px] sm:min-h-[600px]">
        {isPreviewMode ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-blue-700 text-sm sm:text-base">Preview mode - This would show how your FDLecture page will look.</p>
            </div>
          </div>
        ) : (
          <form id="fdLectureForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {renderGeneralSettingsForm()}
            {renderUpcomingLectureForm()}
            {renderPreviousLecturesForm()}
          </form>
        )}
      </div>

      {/* Save Status */}
      {isDirty && !isPreviewMode && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FDLectureManagement; 