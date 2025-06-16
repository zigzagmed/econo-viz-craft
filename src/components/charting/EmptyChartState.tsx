
import React from 'react';
import { BarChart } from 'lucide-react';

export const EmptyChartState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-lg">
      <div className="text-center">
        <BarChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to visualize your data?</h3>
        <p className="text-gray-600 mb-4">Select variables to create your first chart</p>
        <ol className="text-sm text-gray-500 text-left space-y-1">
          <li>1. Select one or more variables</li>
          <li>2. Choose a chart type</li>
          <li>3. Customize and export</li>
        </ol>
      </div>
    </div>
  );
};
