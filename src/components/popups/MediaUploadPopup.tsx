import { useState } from 'react';
import { useAppDispatch } from '../../store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { uploadCampaignMonitoringMedia } from '../../store/slices/campaignsSlice';
import { getS3UploadUrl, saveDataOnS3 } from '../../utilities/awsUtils';

interface MediaUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  siteId?: string;
  onUploadSuccess: () => void;
}

export default function MediaUploadPopup({ isOpen, onClose, campaignId, siteId, onUploadSuccess }: MediaUploadPopupProps) {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [monitoringType, setMonitoringType] = useState("day");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
      const newFiles = Array.from(e.target.files).filter(file => 
        validTypes.includes(file.type)
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

 // Process all files in parallel and wait for all to complete
    const fileUploadPromises = files.map(async (file) => {
      const s3Url = await getS3UploadUrl(file.type, file.name);
      console.log('Uploading file:', file.name);
      await saveDataOnS3(s3Url.data.uploadUrl, file);
      return {
        fileType: file.type,
        fileName: file.name,
        url: s3Url.data.url,
      };
    });

    // Wait for all file uploads to complete
    const fileUrls = await Promise.all(fileUploadPromises);
    console.log('All files uploaded successfully:', fileUrls);
    try {
      await dispatch(uploadCampaignMonitoringMedia({ campaignId, siteId: siteId!, monitoringType: monitoringType, date: date, files: fileUrls }));
      onUploadSuccess();
      setFiles([]);
      // Close the popup after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 relative">
        <button
          title="close"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Upload Media Files
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor="media-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="media-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="monitoring-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monitoring Type
                </label>
                <select
                  id="monitoring-type"
                  value={monitoringType}
                  onChange={(e) => setMonitoringType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/jpeg, image/png, image/jpg, video/mp4"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-[var(--primary)] hover:text-[var(--primary-dark)]">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, JPEG, JPG, PNG (MAX. 100MB)
                </p>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({files.length}):
              </h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-900 dark:text-gray-200 truncate max-w-xs">
                      {file.name}
                    </span>
                    <button
                      title='remove'
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              disabled={isUploading}
              aria-label="Cancel media upload"
              title="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={files.length === 0 || isUploading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text)] ${
                files.length === 0 || isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]`}
            >
              {isUploading ? 'Uploading...' : 'Upload Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
