import React from 'react';
import { Upload } from 'lucide-react';

const UploadRequiredNotice = ({ title = 'Visualization locked until upload' }) => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center dark:border-dark-border">
      <Upload className="h-10 w-10 text-primary" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Upload an Excel or CSV file from the header first. Visualizations remain hidden until a workbook is parsed successfully.
      </p>
    </div>
  );
};

export default UploadRequiredNotice;
