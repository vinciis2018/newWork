import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FullLayout } from '../../layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '../../store';
import { CalendarIcon, ArrowLeftIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import MediaUploadPopup from '../../components/popups/MediaUploadPopup';
import ExcelUploadPopup from '../../components/popups/ExcelUploadPopup';
import { getCampaignDetails, updateCampaign } from '../../store/slices/campaignsSlice';
import { CampaignForm } from '../../components/popups/CampaignForm';
import SiteCard from '../../components/molecules/SiteCard';
import { formatDate } from '../../utilities/dateTimeUtils';

export function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaign, status } = useAppSelector((state) => state.campaigns);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [selectedSiteForMedia, setSelectedSiteForMedia] = useState<string | null>(null);
  const [selectedSiteForExcel, setSelectedSiteForExcel] = useState<string | null>(null);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getCampaignDetails(id));
    }
  }, [id, dispatch]);

  const handleMediaUploadSuccess = () => {
    if (id) {
      dispatch(getCampaignDetails(id));
      setSelectedSiteForMedia(null);
    }
  };

  const handleExcelUpload = (siteId: string) => {
    setSelectedSiteForExcel(siteId);
    setIsExcelUploadOpen(true);
  };

  const handleExcelUploadSuccess = () => {
    if (id) {
      dispatch(getCampaignDetails(id));
    }
    setSelectedSiteForExcel(null);
    setIsExcelUploadOpen(false);
  };

  const handleMonitoringDataUpload = (siteId: string) => {
    setSelectedSiteForMedia(siteId);
    setIsMediaUploadOpen(true);
  };

  if (status === 'loading') {
    return (
      <FullLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </FullLayout>
    );
  }

  if (status === 'idle' || !campaign) {
    return (
      <FullLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Campaign not found</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </FullLayout>
    );
  }

  return (
    <FullLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className='flex justify-between items-center mb-6'>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Campaigns
            </button>
            <h1 className="text-2xl font-bold text-[var(--text)]">Campaign Details</h1>
          </div>
     
          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => campaign && setIsEditModalOpen(true)}
              disabled={!campaign}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--text)] rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Campaign
            </button>
            <button type="button" onClick={() => navigate(`/campaigns/analytics/${campaign._id}`)}>View Analytics</button>
          </div>
        </div>
        

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {campaign.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Campaign Details
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Campaign Info */}
              <div className="md:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    <DocumentTextIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Description
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {campaign.description || 'No description provided.'}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <CalendarIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Timeline
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Start Date</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="h-4 w-4" />
                        {campaign.startDate && campaign.endDate ? (
                          `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                        ) : 'No dates set'}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">End Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sites Section */}
                <div className="mt-8 w-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Sites</h2>
                  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                    {campaign?.sites?.map((site) => (
                      <div key={site._id}>
                        <SiteCard 
                          campaignId={campaign._id}
                          site={site}
                          handleExcelUpload={handleExcelUpload}
                          handleMonitoringDataUpload={handleMonitoringDataUpload}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">
                    CAMPAIGN DETAILS
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Brand</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.brand || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Agency</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.agency || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Industry</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.industry || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.campaignType || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Upload Popup */}
      <MediaUploadPopup
        isOpen={isMediaUploadOpen}
        onClose={() => {
          setIsMediaUploadOpen(false);
          setSelectedSiteForMedia(null);
        }}
        campaignId={id || ''}
        siteId={selectedSiteForMedia || ''}
        onUploadSuccess={handleMediaUploadSuccess}
      />

      {/* Excel Upload Popup */}
      <ExcelUploadPopup
        isOpen={isExcelUploadOpen}
        onClose={() => {
          setIsExcelUploadOpen(false);
          setSelectedSiteForExcel(null);
        }}
        campaignId={id || ''}
        siteId={selectedSiteForExcel || ''}
        onUploadSuccess={handleExcelUploadSuccess}
      />

      {/* Edit Campaign Modal */}
      <CampaignForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (updatedCampaign) => {
          if (id && campaign) {
            await dispatch(updateCampaign({ 
              id, 
              data: updatedCampaign 
            }));
            setIsEditModalOpen(false);
            // Refresh the campaign details
            dispatch(getCampaignDetails(id));
          }
        }}
        isLoading={false}
        initialData={campaign ? {
          name: campaign.name,
          description: campaign.description || '',
          startDate: campaign.startDate || '',
          endDate: campaign.endDate || '',
          brand: campaign.brand || '',
          agency: campaign.agency || '',
          industry: campaign.industry || '',
          campaignType: campaign.campaignType || '',
          sites: campaign.sites || []
        } : undefined}
      />
    </FullLayout>
  );
}

export default CampaignDetailsPage;