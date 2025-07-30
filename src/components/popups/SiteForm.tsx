import { useState } from 'react';
import type { SiteFormData } from '../../types';

interface SiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (site: SiteFormData) => void;
  isLoading?: boolean;
}

export function SiteForm({ isOpen, onClose, onSubmit, isLoading }: SiteFormProps) {

  const [formData, setFormData] = useState<SiteFormData>({
    siteName: '',
    commonNames: ['LED'],
    siteImages: ['https://imgs.search.brave.com/vatG32pjyOqEy4VWrBkooS-Ihe1tLXKRBIBTrpzeKFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cudmlzdGFybWVkaWEuY29tL2h1YmZzL291/dCUyMG9mJTIwaG9t/ZSUyMGFkdmVydGlz/aW5nJTIwaW4lMjBQ/aWNjYWxsaSUyMFNx/dWFyZS5wbmc='],
    siteType: 'dooh',
    siteLocation: {
      address: '',
      latitude: '',
      longitude: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  const siteTypes = [
    { id: 1, value: 'dooh', label: 'Digital Out of Home (DOOH)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested siteLocation fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof SiteFormData] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto py-8">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-md my-8">
        <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-[var(--background)] pt-4 pb-2 -mt-4 -mx-6 px-6 border-b border-[var(--border)]">
            <h3 className="text-xl font-semibold text-[var(--text)]">Create New Site</h3>
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

          <div className="">
            <form id="site-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Site Name */}
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Site Type */}
                <div>
                  <label htmlFor="siteType" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Site Type *
                  </label>
                  <select
                    id="siteType"
                    name="siteType"
                    value={formData.siteType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                    required
                    disabled={isLoading}
                  >
                    {siteTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Section */}
                <div className="space-y-4 p-4 border border-[var(--border)] rounded-md">
                  <h4 className="text-sm font-medium text-[var(--text-muted)]">Location Details</h4>
                  
                  {/* Address */}
                  <div>
                    <label htmlFor="siteLocation.address" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="siteLocation.address"
                      name="siteLocation.address"
                      value={formData.siteLocation.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label htmlFor="siteLocation.city" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="siteLocation.city"
                        name="siteLocation.city"
                        value={formData.siteLocation.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="siteLocation.state" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="siteLocation.state"
                        name="siteLocation.state"
                        value={formData.siteLocation.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Country */}
                    <div>
                      <label htmlFor="siteLocation.country" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        id="siteLocation.country"
                        name="siteLocation.country"
                        value={formData.siteLocation.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* ZIP/Postal Code */}
                    <div>
                      <label htmlFor="siteLocation.zipCode" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="siteLocation.zipCode"
                        name="siteLocation.zipCode"
                        value={formData.siteLocation.zipCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Latitude */}
                    <div>
                      <label htmlFor="siteLocation.latitude" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="siteLocation.latitude"
                        name="siteLocation.latitude"
                        value={formData.siteLocation.latitude}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Longitude */}
                    <div>
                      <label htmlFor="siteLocation.longitude" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="siteLocation.longitude"
                        name="siteLocation.longitude"
                        value={formData.siteLocation.longitude}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background-alt)] text-[var(--text)]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Common Names (read-only for now) */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                    Common Names
                  </label>
                  <div className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background-alt)]">
                    {formData.commonNames.join(', ')}
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Default names can be updated later in site settings.
                  </p>
                </div>
              </div>
            </form>
          </div>
          
          {/* Form Footer */}
          <div className="sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] mt-6 flex justify-end space-x-3 px-6 py-4">
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
              form="site-form"
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
                'Create Site'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
