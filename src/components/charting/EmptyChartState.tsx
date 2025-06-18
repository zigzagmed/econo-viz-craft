
import React from 'react';
import { BarChart } from 'lucide-react';

export const EmptyChartState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-lg">
      <div className="text-center">
        <BarChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-600">Select variables to create the chart</p>
      </div>
    </div>
  );
};
