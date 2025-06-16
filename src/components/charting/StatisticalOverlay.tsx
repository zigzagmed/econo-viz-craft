
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { calculateStatistics } from '../../utils/statisticalUtils';

interface StatisticalOverlayProps {
  dataset: string;
  variables: string[];
  getVariableData: (dataset: string, variables: string[]) => any;
}

export const StatisticalOverlay: React.FC<StatisticalOverlayProps> = ({
  dataset,
  variables,
  getVariableData
}) => {
  const data = getVariableData(dataset, variables);
  const stats = calculateStatistics(data, variables);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Variable Statistics</Label>
      <div className="space-y-3">
        {variables.map((variable) => {
          const varStats = stats[variable];
          if (!varStats) return null;

          return (
            <div key={variable} className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">{variable}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Mean:</span>
                  <span className="ml-1 font-medium">{varStats.mean?.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Std Dev:</span>
                  <span className="ml-1 font-medium">{varStats.std?.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Min:</span>
                  <span className="ml-1 font-medium">{varStats.min?.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max:</span>
                  <span className="ml-1 font-medium">{varStats.max?.toFixed(3)}</span>
                </div>
              </div>
              {varStats.missing > 0 && (
                <Badge variant="outline" className="text-xs mt-2">
                  {varStats.missing} missing values
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
