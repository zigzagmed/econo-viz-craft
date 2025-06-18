
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

  return (
    <Card className="mt-4 w-fit max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Chart Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium py-2">Statistic</TableHead>
              <TableHead className="text-xs font-medium py-2">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statEntries.map(([statName, statData]) => (
              <TableRow key={statName}>
                <TableCell className="font-medium text-xs py-2">{statName}</TableCell>
                <TableCell className="text-xs py-2">{formatValue(statData.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
