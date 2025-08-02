import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FullLayout } from '../../layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '../../store';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getCampaignDetails } from '../../store/slices/campaignsSlice';
import type { ExcelStats, Sheet } from '../../types';
import { DataStats } from '../../components/molecules/DataStats';
import { LogsTabsView } from '../../components/molecules/LogsTabsView';
import { analyseMonitoringData, getAnalyticsFromExcel } from '../../store/slices/analyticsSlice';

export function CampaignAnalyticsPage() {
  const { id, siteId } = useParams<{ id: string, siteId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaign, status } = useAppSelector((state) => state.campaigns);
  const { excelAnalytics: excelAnalytics } = useAppSelector((state) => state.analytics);
  const { monitoringAnalytics: monitoringAnalytics } = useAppSelector((state) => state.analytics);


  useEffect(() => {
    if (id) {
      dispatch(getCampaignDetails(id));
    }
  }, [id, dispatch]);

  const [excelData, setExcelData] = useState<Sheet[] | null>(null);
  const [excelStats, setExcelStats] = useState<ExcelStats | null>(null);
  // const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = async () => {
    setExcelData(null);
    setExcelStats(null);
    
    if (!id || !siteId) {
      return;
    }
    try {
      await dispatch(getAnalyticsFromExcel({ id, siteId }));
      await dispatch(analyseMonitoringData({ id, siteId }));
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  useEffect(() => {
    if (excelAnalytics && excelAnalytics?.excel_data) {
      setExcelData(excelAnalytics?.excel_data?.sheets);
      setExcelStats(excelAnalytics?.excel_data?.stats)
    }
  },[excelAnalytics]);

  console.log("monitoringData", monitoringAnalytics?.monitoring_data)
  console.log("excelData", excelAnalytics?.excel_data)

  
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
              type="button"
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
            <h1 className="text-2xl font-bold text-[var(--text)]">Campaign Analytics</h1>
          </div>
        </div>
        

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden p-4">
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-grow">
            <div className="">
              <div>
                  <h1 className="text-lg text-[var(--text)] font-semibold">Select Uploaded Logs File</h1>
                  <p className="text-md text-muted-foreground">Select an Excel file (.xls or .xlsx) from your computer.</p>
              </div>
              <div>
                  {/* <FileUpload onFileSelect={handleFileSelect} /> */}
                  <button type="button" onClick={handleFileSelect}>Click here to analyze your log report</button>
              </div>
            </div>
            {/* Data Stats section */}
            <section className="lg:col-span-1">
              <DataStats stats={excelStats} />
            </section>

            {/* Logs Tabs View */}
            <section className="lg:col-span-2">
              {excelData && <LogsTabsView excelData={excelData} />}
            </section>
          </div>
          <button
            type="button"
            onClick={() => handleFileSelect}
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
          >
            Back to Campaigns
          </button>
        </div>
      </div>

    </FullLayout>
  );
}

export default CampaignAnalyticsPage;