
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatValue } from '../../../utils/statisticsTableUtils';

interface SimpleStatisticsTableProps {
  statistics: Record<string, { value: number | string }>;
  decimals: number;
  title?: string;
}

export const SimpleStatisticsTable: React.FC<SimpleStatisticsTableProps> = ({
  statistics,
  decimals,
  title = "Chart Statistics"
}) => {
  const statEntries = Object.entries(statistics);

  return (
    <div className="w-auto max-w-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium w-32">{title === "Chart Statistics" ? "Group" : "Statistic"}</TableHead>
            <TableHead className="font-medium w-32">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statEntries.map(([statName, statData]) => (
            <TableRow key={statName}>
              <TableCell className="font-medium">{statName}</TableCell>
              <TableCell>{formatValue(statData.value, decimals)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
