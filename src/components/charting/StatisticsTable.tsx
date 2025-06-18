
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsTableProps {
  statistics: Record<string, {
    value: number | string;
  }>;
  decimals: number;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
  statistics,
  decimals
}) => {
  const formatValue = (value: number | string): string => {
    if (typeof value === 'string') return value;
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value.toString() : value.toFixed(decimals);
    }
    return String(value);
  };

  const statEntries = Object.entries(statistics);
  
  if (statEntries.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Chart Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {statEntries.map(([statName, statData], index) => (
            <span key={statName} className="whitespace-nowrap">
              <span className="text-gray-600">{statName}:</span>{' '}
              <span className="font-medium">{formatValue(statData.value)}</span>
              {index < statEntries.length - 1 && <span className="text-gray-400 ml-2">•</span>}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
