import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllSites } from '../../store/slices/sitesSlice';
import type { Campaign, CampaignFormData, Site } from '../../types';

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Omit<Campaign, '_id' | 'createdAt' | '__v' | 'monitoring'>) => void;
  isLoading?: boolean;
  initialData?: CampaignFormData;
}

// Use the Site type directly since it already has the required properties

export function CampaignForm({ isOpen, onClose, onSubmit, isLoading, initialData }: CampaignFormProps) {

  const dispatch = useAppDispatch();

  const { sites } = useAppSelector((state) => state.sites);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    brand: '',
    agency: '',
    industry: '',
    campaignType: '',
    sites: [],
  } as CampaignFormData);
  
  const [selectedSites, setSelectedSites] = useState<Site[]>([]);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Education',
    'Entertainment',
    'Automotive',
    'Fashion',
    'Food & Beverage',
    'Other'
  ];

  const campaignTypes = [
    {
      id: 1,
      label: 'DOOH Campaign',
      value: 'dooh'
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name === 'sites') return;
    
    // For non-array fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSiteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = e.target.value;
    const site = sites.find(s => s._id === siteId);
    if (site && !formData.sites.some(s => s._id === site._id)) {

      setFormData(prev => ({
        ...prev,
        sites: [...prev.sites, site]
      }));
      
      // Update selectedSites for display
      setSelectedSites(prev => [...prev, site]);
    }
    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  const removeSite = (siteId: string) => {
    setFormData(prev => ({
      ...prev,
      sites: prev.sites.filter(site => site._id !== siteId)
    }));
    setSelectedSites(prev => prev.filter(site => site._id !== siteId));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedSites(sites.filter(s => initialData?.sites?.some(site => site._id === s._id)));
    } else {
      setFormData(prev => ({
        ...prev,
        sites: []
      }));
      setSelectedSites([]);
    }
    dispatch(getAllSites());
  }, [dispatch, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto py-8">
    <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-md my-8">
      <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[var(--text)]">Create New Campaign</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form id="campaign-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[var(--text-muted)]">Campaign Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>

                <label htmlFor="agency" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Agency
                  </label>
                  <input
                    type="text"
                    id="agency"
                    name="agency"
                    value={formData.agency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="campaignType" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Campaign Type *
                  </label>
                  <select
                    id="campaignType"
                    name="campaignType"
                    value={formData.campaignType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Campaign Type</option>
                    {campaignTypes.map((type) => (
                      <option key={type.id} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                  <label htmlFor="sites" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Sites *
                  </label>
                  <div className="space-y-2">
                    <select
                      title="Select a site"
                      id="sites"
                      name="sites"
                      value=""
                      onChange={handleSiteSelect}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                      disabled={isLoading}
                    >
                      <option value="">Select a site</option>
                      {sites.map((site, index) => (
                        <option key={index} value={site._id}>
                          {site.siteName}
                        </option>
                      ))}
                    </select>
                    
                    {selectedSites.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-[var(--text-muted)] mb-1">Selected Sites:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSites.map(site => (
                            <span key={site._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--primary)] text-[var(--text)]">
                              {site.siteName}
                              <button 
                                type="button"
                                onClick={() => removeSite(site._id)}
                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                                aria-label={`Remove ${site.siteName}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3 px-6 py-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50"
                >
                  Cancel
                </button>
            <button
              type="submit"
              form="campaign-form"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[var(--text)] bg-[var(--primary)] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--text)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
