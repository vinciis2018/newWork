import { useNavigate } from "react-router-dom";
import type { Site } from "../../types";
import { BuildingOfficeIcon, MapPinIcon, PhotoIcon, DocumentArrowUpIcon, ChartBarIcon, TrashIcon } from "@heroicons/react/24/outline";


interface SiteCardProps {
  site: Site;
  handleExcelUpload: (siteId: string) => void;
  handleMonitoringDataUpload: (siteId: string) => void;
  campaignId: string;
}

export default function SiteCard ({ campaignId, site, handleExcelUpload, handleMonitoringDataUpload }: SiteCardProps) {
  const navigate = useNavigate();
  return (
    <div key={site._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-2" />
              {site.siteName}
            </h3>
            {typeof site.siteLocation === 'object' && (
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {site.siteLocation?.address}
              </p>
            )}
            {site.siteType && (
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {site.siteType}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => handleMonitoringDataUpload(site._id)}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Upload Media"
            >
              <PhotoIcon className="h-5 w-5" />
            </button>
            <button 
              type="button"
              onClick={() => handleExcelUpload(site._id)}
              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
              title="Upload Excel"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
            </button>
            <button 
              type="button"
              onClick={() => navigate(`/campaigns/analytics/${campaignId}/${site._id}`)}
              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
              title="Upload Excel"
            >
              <ChartBarIcon className="h-5 w-5" />
            </button>
            <button 
              type="button"
              // onClick={() => handleRemoveSite(site._id)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {site.commonNames && site.commonNames.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Also Known As</h4>
            <div className="flex flex-wrap gap-1">
              {site.commonNames.map((name, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* logs data */}

        {site.excelFiles && site.excelFiles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Excel Files ({site.excelFiles.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {site.excelFiles.map((file, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {file.originalName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* monitoring data */}
        {site.monitoringData && site.monitoringData.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Monitoring Data ({site.monitoringData.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {site.monitoringData.map((data, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {new Date(data.date).toLocaleDateString()} ({data.monitoringMedia.length})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
