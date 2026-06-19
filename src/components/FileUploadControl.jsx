import React, { useRef } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Upload } from 'lucide-react';

const FileUploadControl = ({ onUpload, uploadState, workbook }) => {
  const fileInputRef = useRef(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (file) {
      await onUpload(file);
    }

    event.target.value = '';
  };

  const isUploading = uploadState.status === 'uploading';
  const isSuccess = uploadState.status === 'success';
  const isError = uploadState.status === 'error';

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleSelectClick}
        disabled={isUploading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-border"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        <span>{isUploading ? 'Uploading...' : 'Upload Excel'}</span>
      </button>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
          {workbook?.fileName || 'No workbook uploaded'}
        </div>
        {isSuccess && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{workbook.sheets.length} sheet(s) parsed successfully</span>
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{uploadState.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadControl;
