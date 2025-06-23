
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  GroupedData, 
  StatEntry, 
  formatValue, 
  findSummaryMatch 
} from '../../../utils/statisticsTableUtils';

interface GroupedStatisticsTableProps {
  groupedData: GroupedData;
  summaryStats: StatEntry[];
  statsArray: string[];
  decimals: number;
}

export const GroupedStatisticsTable: React.FC<GroupedStatisticsTableProps> = ({
  groupedData,
  summaryStats,
  statsArray,
  decimals
}) => {
  const groups = Object.keys(groupedData);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium">Group</TableHead>
          {statsArray.map(stat => (
            <TableHead key={stat} className="font-medium text-center">{stat}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map(group => (
          <TableRow key={group}>
            <TableCell className="font-medium">{group}</TableCell>
            {statsArray.map(stat => (
              <TableCell key={stat} className="text-center">
                {groupedData[group][stat] !== undefined 
                  ? formatValue(groupedData[group][stat], decimals)
                  : '-'
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
        
        {/* Add summary row if we have summary statistics */}
        {summaryStats.length > 0 && (
          <TableRow className="border-t-2 bg-gray-50">
            <TableCell className="font-semibold">Total</TableCell>
            {statsArray.map(stat => {
              const summaryMatch = findSummaryMatch(stat, summaryStats);
              return (
                <TableCell key={stat} className="text-center font-medium">
                  {summaryMatch ? formatValue(summaryMatch[1].value, decimals) : '-'}
                </TableCell>
              );
            })}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
