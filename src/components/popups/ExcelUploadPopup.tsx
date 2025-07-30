import React, { useState, useRef } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '../../store';
import { uploadCampaignLogsExcel } from '../../store/slices/campaignsSlice';
// useAppDispatch removed as it's not being used

interface ExcelUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  siteId?: string;
  onUploadSuccess?: () => void;
}

export default function ExcelUploadPopup({ isOpen, onClose, campaignId, siteId, onUploadSuccess }: ExcelUploadPopupProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Remove unused dispatch since we're using fetch directly
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleDropZoneClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        ['.xlsx', '.xls', '.csv'].some(ext => file.name.toLowerCase().endsWith(ext))
      );
      
      if (newFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        setError(null);
        setSuccess(null);
      } else {
        setError('Please upload a valid Excel file (.xlsx, .xls, .csv)');
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    console.log(siteId);
    if (siteId) {
      formData.append('siteId', siteId);
    }

    try {
      dispatch(uploadCampaignLogsExcel({ siteId: siteId!, campaignId, files }));

      setSuccess('Excel file uploaded successfully!');
      setFiles([]);
      onUploadSuccess?.();
      // Close the popup after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error uploading Excel file:', err);
      setError('Failed to upload Excel file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Excel File
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isUploading}
              aria-label="Close popup"
              title="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className={`mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isUploading ? 'opacity-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
            >
              <div className="space-y-1 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      onClick={handleFileInputClick}
                      accept=".xlsx,.xls,.csv"
                      ref={fileInputRef}
                      multiple
                      disabled={isUploading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  Excel files up to 10MB (.xlsx, .xls, .csv)
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Files to upload:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                        disabled={isUploading}
                        aria-label={`Remove ${file.name}`}
                        title="Remove file"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 text-sm text-green-600">
                {success}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${files.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
