import { useEffect, useState } from 'react';
import { FullLayout } from '../../layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '../../store';
import { createSite, getAllSites } from '../../store/slices/sitesSlice';
import type { Site, SiteFormData } from '../../types';
import type { RootState } from '../../store';
import { PlusIcon } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';
import { SiteForm } from '../../components/popups/SiteForm';

export function SitesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { sites, status, error } = useAppSelector((state: RootState) => state.sites);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllSites());
    }
  }, [status, dispatch]);

  const handleCreateSite = async (siteData: SiteFormData) => {
    try {
      console.log('Creating site:', siteData);
      
      // Close the form
      setIsFormOpen(false);
      
      // Dispatch the create action with the transformed data
      await dispatch(createSite({
        siteName: siteData.siteName,
        siteLocation: siteData.siteLocation,
        commonNames: siteData.commonNames,
        siteImages: siteData.siteImages,
        siteType: siteData.siteType
      }));
      
      // Refresh the sites list
      dispatch(getAllSites());
    } catch (err) {
      console.error('Failed to create site:', err);
    }
  };

  // Log the campaigns data to console
  useEffect(() => {
    if (status === 'succeeded') {
      console.log('Campaigns data:', sites);
    } else if (status === 'failed') {
      console.error('Error fetching campaigns:', error);
    }
  }, [status, sites, error]);

  console.log(isFormOpen);

  return (
    <FullLayout>
      <section className="py-4 px-4 bg-[var(--background-alt)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text)]">
              Sites
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-[var(--text)] border border-[var(--border)] rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Site</span>
            </button>
          </div>
          
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[var(--text)]">Loading sites...</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error || 'Failed to load campaigns'}</span>
            </div>
          )}

          {status === 'succeeded' && (
            <div className="grid md:grid-cols-3 gap-6">
              {sites && sites.length > 0 ? (
                sites.map((site: Site, index: number) => (
                  <div 
                    key={index} 
                    className="bg-[var(--background)] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    // onClick={() => navigate(`/sites/${site._id}`)}
                  >
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                      {site.siteName}
                    </h3>
                    {/* Add more campaign details here as needed */}
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                      {JSON.stringify(site, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-[var(--text-muted)]">No sites found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSite}
        isLoading={status === 'loading'}
      />
    </FullLayout>
  );
}
