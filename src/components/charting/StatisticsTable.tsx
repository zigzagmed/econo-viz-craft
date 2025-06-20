
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  // Check if we have grouped statistics (like "Category - Statistic" format)
  const hasGroupedStats = statEntries.some(([key]) => 
    key.includes(' (Count)') || key.includes(' (%)') || key.includes(' (Sum)') || 
    key.includes(' (Average)') || key.includes(' (Min)') || key.includes(' (Max)')
  );

  // For bar charts and other grouped statistics, try to pivot
  const groupPattern = /^(.+?)\s*$/;
  const statPattern = /\(([^)]+)\)$/;
  
  if (hasGroupedStats) {
    // Extract groups and statistics
    const groupedData: Record<string, Record<string, number | string>> = {};
    const nonGroupedStats: Array<[string, { value: number | string }]> = [];
    
    statEntries.forEach(([key, data]) => {
      if (key.includes('(') && key.includes(')')) {
        const match = key.match(/^(.+?)\s*\(([^)]+)\)$/);
        if (match) {
          const [, group, stat] = match;
          if (!groupedData[group]) {
            groupedData[group] = {};
          }
          groupedData[group][stat] = data.value;
        }
      } else if (!key.startsWith('Total')) {
        // This might be a simple group statistic without parentheses
        groupedData[key] = { Value: data.value };
      } else {
        nonGroupedStats.push([key, data]);
      }
    });

    const groups = Object.keys(groupedData);
    const allStats = new Set<string>();
    groups.forEach(group => {
      Object.keys(groupedData[group]).forEach(stat => allStats.add(stat));
    });
    const statsArray = Array.from(allStats).sort();

    if (groups.length > 0 && statsArray.length > 0) {
      return (
        <Card className="mt-4 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart Statistics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
                          ? formatValue(groupedData[group][stat])
                          : '-'
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Show non-grouped statistics below */}
            {nonGroupedStats.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Table>
                  <TableBody>
                    {nonGroupedStats.map(([statName, statData]) => (
                      <TableRow key={statName}>
                        <TableCell className="font-medium">{statName}</TableCell>
                        <TableCell className="text-right">{formatValue(statData.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
  }

  // Fallback to simple 2-column layout for non-grouped statistics
  return (
    <Card className="mt-4 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Chart Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Statistic</TableHead>
              <TableHead className="font-medium text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statEntries.map(([statName, statData]) => (
              <TableRow key={statName}>
                <TableCell className="font-medium">{statName}</TableCell>
                <TableCell className="text-right">{formatValue(statData.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
