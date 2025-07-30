import { useState, useEffect } from 'react';
import { FullLayout } from '../../layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '../../store';
import { getCampaigns, createCampaign } from '../../store/slices/campaignsSlice';
import type { Campaign } from '../../types';
import type { RootState } from '../../store';
import { CampaignForm } from '../../components/popups/CampaignForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export function CampaignsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { campaigns, status, error } = useAppSelector((state: RootState) => state.campaigns);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCampaigns());
    }
  }, [status, dispatch]);

  const handleCreateCampaign = async (campaignData: Omit<Campaign, '_id' | 'createdAt' | '__v' | 'monitoring'>) => {
    try {
      // Ensure sites is always an array
      const dataToSubmit = {
        ...campaignData,
        sites: campaignData.sites || []
      };
      
      console.log('Creating campaign:', dataToSubmit);
      await dispatch(createCampaign(dataToSubmit)).unwrap();
      // Refresh the campaigns list after successful creation
      dispatch(getCampaigns());
      // Close the form
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to create campaign:', err);
      // Handle error (e.g., show error message to user)
    }
  };

  // Log the campaigns data to console
  useEffect(() => {
    if (status === 'succeeded') {
      console.log('Campaigns data:', campaigns);
    } else if (status === 'failed') {
      console.error('Error fetching campaigns:', error);
    }
  }, [status, campaigns, error]);

  console.log(campaigns);

  return (
    <FullLayout>
      <section className="py-4 px-4 bg-[var(--background-alt)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text)]">
              Campaigns
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-[var(--text)] border border-[var(--border)] rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Campaign</span>
            </button>
          </div>
          
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[var(--text)]">Loading campaigns...</p>
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
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign: Campaign, index: number) => (
                  <div 
                    key={index} 
                    className="bg-[var(--background)] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/campaigns/${campaign._id}`)}
                  >
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                      {campaign.name}
                    </h3>
                    {/* Add more campaign details here as needed */}
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                      {JSON.stringify(campaign, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-[var(--text-muted)]">No campaigns found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CampaignForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCampaign}
        isLoading={status === 'loading'}
      />
    </FullLayout>
  );
}
