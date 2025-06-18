
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

  // Split entries into two rows
  const midPoint = Math.ceil(statEntries.length / 2);
  const firstRow = statEntries.slice(0, midPoint);
  const secondRow = statEntries.slice(midPoint);

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Chart Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* First row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {firstRow.map(([statName, statData]) => (
              <div key={statName} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{statName}</div>
                <div className="text-sm font-medium">{formatValue(statData.value)}</div>
              </div>
            ))}
          </div>
          
          {/* Second row if needed */}
          {secondRow.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {secondRow.map(([statName, statData]) => (
                <div key={statName} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{statName}</div>
                  <div className="text-sm font-medium">{formatValue(statData.value)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
