import React from 'react';

const KPICard = ({ title, value, target, unit, status, icon: Icon }) => {
  const isPositive = status === 'good';
  const isWarning = status === 'warning';
  const isDanger = status === 'danger';

  let statusColor = 'text-gray-500 dark:text-gray-400';
  if (isPositive) statusColor = 'text-success';
  if (isWarning) statusColor = 'text-warning';
  if (isDanger) statusColor = 'text-danger';

  return (
    <div className="card flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${statusColor}`} />}
      </div>
      <div className="flex items-baseline mb-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
      {target && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
          Target: <span className="font-medium text-gray-700 dark:text-gray-300">{target}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
