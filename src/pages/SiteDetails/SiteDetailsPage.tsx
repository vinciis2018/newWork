import { useParams, useNavigate } from 'react-router-dom';
import { FullLayout } from '../../layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '../../store';
import { CalendarIcon, ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { getSiteDetails } from '../../store/slices/sitesSlice';

export function SiteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaign } = useAppSelector((state) => state.campaigns);

  useEffect(() => {
    if (id) {
      dispatch(getSiteDetails(id));
    }
  }, [dispatch, id]);

  if (!campaign) {
    return (
      <FullLayout>
        <div className="p-8 text-center">
          <p>Loading campaign details...</p>
        </div>
      </FullLayout>
    );
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <FullLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className='flex justify-between items-center'>
          <button
            // variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Campaigns
          </button>
          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button> Edit Campaign</button>
            <button>View Analytics</button>
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
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(campaign.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">End Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
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

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">
                    CAMPAIGN METRICS
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Conversions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullLayout>
  );
}

export default SiteDetailsPage;