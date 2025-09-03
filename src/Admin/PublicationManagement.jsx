import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  BookOpen, Calendar, FileText, Users, Globe, Plus, 
  Edit, Trash2, Eye, Save, Upload, X, Check, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const PublicationManagement = () => {
  const [activeTab, setActiveTab] = useState('decentring-elt');
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
      decentringElt: {
        heading: "Decentring ELT Book",
        coverImageUrl: "",
        title: "Decentring English Language Teaching: A Critical Perspective",
        editors: [{ name: "", image: "" }],
        description: "",
        buyLinks: { amazon: "", flipkart: "", pothi: "", download: "" },
        downloadText: "Download PDF",
        bookInfo: { language: "English", date: "", pages: "", dimensions: "" }
      },
      conferences: [],
      occasionalPapers: [],
      teacherMuse: [],
      publications: []
    }
  });

  const { fields: editorFields, append: appendEditor, remove: removeEditor } = useFieldArray({
    control, name: "decentringElt.editors"
  });

  const { fields: conferenceFields, append: appendConference, remove: removeConference } = useFieldArray({
    control, name: "conferences"
  });

  const { fields: paperFields, append: appendPaper, remove: removePaper } = useFieldArray({
    control, name: "occasionalPapers"
  });

  const { fields: museFields, append: appendMuse, remove: removeMuse } = useFieldArray({
    control, name: "teacherMuse"
  });

  const { fields: publicationFields, append: appendPublication, remove: removePublication } = useFieldArray({
    control, name: "publications"
  });

  useEffect(() => {
    const savedData = localStorage.getItem('publicationData');
    if (savedData) {
      try {
        reset(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading publication data:', error);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (isDirty) {
        localStorage.setItem('publicationData', JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('publicationData', JSON.stringify(data));
      toast.success('Publication data saved successfully!');
      reset(data);
    } catch (error) {
      toast.error('Error saving publication data');
    } finally {
      setIsSaving(false);
    }
  };

  const addNewItem = (type) => {
    const newItem = {
      id: Date.now(),
      title: "",
      description: "",
      image: "",
      date: new Date().toISOString().split('T')[0]
    };

    switch (type) {
      case 'conference':
        newItem.registrationLink = "";
        appendConference(newItem);
        break;
      case 'paper':
        newItem.author = "";
        newItem.abstract = "";
        newItem.pdfUrl = "";
        appendPaper(newItem);
        break;
      case 'muse':
        newItem.author = "";
        newItem.content = "";
        appendMuse(newItem);
        break;
      case 'publication':
        newItem.link = "";
        newItem.category = "";
        appendPublication(newItem);
        break;
    }
  };

  const removeItem = (type, index) => {
    switch (type) {
      case 'conference': removeConference(index); break;
      case 'paper': removePaper(index); break;
      case 'muse': removeMuse(index); break;
      case 'publication': removePublication(index); break;
    }
  };

  const tabs = [
    { id: 'decentring-elt', label: 'Decentring ELT Book', icon: BookOpen },
    { id: 'conferences', label: 'AINET Conferences', icon: Calendar },
    { id: 'papers', label: 'Occasional Papers', icon: FileText },
    { id: 'muse', label: 'Teacher Muse', icon: Users },
    { id: 'publications', label: 'AINET Publications', icon: Globe }
  ];

  const renderDecentringEltForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Section Heading</label>
          <input
            type="text"
            {...register("decentringElt.heading", { required: "Heading is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.decentringElt?.heading && (
            <p className="text-red-500 text-sm mt-1">{errors.decentringElt.heading.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
          <input
            type="text"
            {...register("decentringElt.coverImageUrl")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
        <input
          type="text"
          {...register("decentringElt.title", { required: "Book title is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Editors</label>
        {editorFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mb-2">
            <input
              type="text"
              {...register(`decentringElt.editors.${index}.name`)}
              placeholder="Editor name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              {...register(`decentringElt.editors.${index}.image`)}
              placeholder="Editor image URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeEditor(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendEditor({ name: "", image: "" })}
          className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Editor
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          {...register("decentringElt.description")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter book description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buy Links</label>
          <div className="space-y-2">
            <input
              type="url"
              {...register("decentringElt.buyLinks.amazon")}
              placeholder="Amazon link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="url"
              {...register("decentringElt.buyLinks.flipkart")}
              placeholder="Flipkart link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="url"
              {...register("decentringElt.buyLinks.pothi")}
              placeholder="Pothi link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="url"
              {...register("decentringElt.buyLinks.download")}
              placeholder="Download link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book Information</label>
          <div className="space-y-2">
            <input
              type="text"
              {...register("decentringElt.bookInfo.language")}
              placeholder="Language"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="date"
              {...register("decentringElt.bookInfo.date")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              {...register("decentringElt.bookInfo.pages")}
              placeholder="Number of pages"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              {...register("decentringElt.bookInfo.dimensions")}
              placeholder="Dimensions (e.g., 6x9 inches)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Download Button Text</label>
        <input
          type="text"
          {...register("decentringElt.downloadText")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g., Download PDF, Get Free Copy"
        />
      </div>
    </div>
  );

  const renderConferencesForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Conference Entries</h3>
        <button
          type="button"
          onClick={() => addNewItem('conference')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Conference
        </button>
      </div>

      {conferenceFields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Conference {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeItem('conference', index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register(`conferences.${index}.title`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                {...register(`conferences.${index}.date`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register(`conferences.${index}.description`)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                {...register(`conferences.${index}.image`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
              <input
                type="url"
                {...register(`conferences.${index}.registrationLink`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      ))}

      {conferenceFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No conferences added yet. Click "Add Conference" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderPapersForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Occasional Papers</h3>
        <button
          type="button"
          onClick={() => addNewItem('paper')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Paper
        </button>
      </div>

      {paperFields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Paper {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeItem('paper', index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register(`occasionalPapers.${index}.title`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                {...register(`occasionalPapers.${index}.author`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
              <input
                type="date"
                {...register(`occasionalPapers.${index}.date`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF URL</label>
              <input
                type="url"
                {...register(`occasionalPapers.${index}.pdfUrl`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <textarea
                {...register(`occasionalPapers.${index}.abstract`)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      ))}

      {paperFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No papers added yet. Click "Add Paper" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderMuseForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Teacher Muse Entries</h3>
        <button
          type="button"
          onClick={() => addNewItem('muse')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Entry
        </button>
      </div>

      {museFields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Entry {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeItem('muse', index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register(`teacherMuse.${index}.title`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                {...register(`teacherMuse.${index}.author`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
              <input
                type="date"
                {...register(`teacherMuse.${index}.date`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                {...register(`teacherMuse.${index}.image`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                {...register(`teacherMuse.${index}.content`)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter the content of the teacher muse entry..."
              />
            </div>
          </div>
        </div>
      ))}

      {museFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No teacher muse entries yet. Click "Add Entry" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderPublicationsForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">AINET Publications</h3>
        <button
          type="button"
          onClick={() => addNewItem('publication')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Publication
        </button>
      </div>

      {publicationFields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Publication {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeItem('publication', index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register(`publications.${index}.title`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                {...register(`publications.${index}.category`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select category</option>
                <option value="research">Research Papers</option>
                <option value="books">Books</option>
                <option value="journals">Journals</option>
                <option value="newsletters">Newsletters</option>
                <option value="reports">Reports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                {...register(`publications.${index}.image`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
              <input
                type="url"
                {...register(`publications.${index}.link`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register(`publications.${index}.description`)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      ))}

      {publicationFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No publications added yet. Click "Add Publication" to get started.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Publication Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage all publication content and sections</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
              isPreviewMode 
                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Eye size={16} className="mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </button>
          
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving || !isDirty}
            className="px-4 sm:px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px] sm:min-h-[600px]">
        {isPreviewMode ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-blue-700 text-sm sm:text-base">Preview mode - This would show how your publication page will look.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {activeTab === 'decentring-elt' && renderDecentringEltForm()}
            {activeTab === 'conferences' && renderConferencesForm()}
            {activeTab === 'papers' && renderPapersForm()}
            {activeTab === 'muse' && renderMuseForm()}
            {activeTab === 'publications' && renderPublicationsForm()}
          </form>
        )}
      </div>

      {/* Unsaved Changes Indicator */}
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

export default PublicationManagement; 