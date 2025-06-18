
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsTableProps {
  statistics: Record<string, {
    mean?: number;
    std?: number;
    min?: number;
    max?: number;
    count?: number;
    missing?: number;
  }>;
  decimals: number;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
  statistics,
  decimals
}) => {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return 'N/A';
    return num.toFixed(decimals);
  };

  const variables = Object.keys(statistics);
  
  if (variables.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Variable Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variable</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Mean</TableHead>
              <TableHead>Std Dev</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Missing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.map((variable) => {
              const stats = statistics[variable];
              return (
                <TableRow key={variable}>
                  <TableCell className="font-medium">{variable}</TableCell>
                  <TableCell>{stats.count || 'N/A'}</TableCell>
                  <TableCell>{formatNumber(stats.mean)}</TableCell>
                  <TableCell>{formatNumber(stats.std)}</TableCell>
                  <TableCell>{formatNumber(stats.min)}</TableCell>
                  <TableCell>{formatNumber(stats.max)}</TableCell>
                  <TableCell>{stats.missing || 0}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
