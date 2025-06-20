
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

  // Check for grouped statistics patterns like "Group (Statistic)" or "Group - Statistic"
  const groupedData: Record<string, Record<string, number | string>> = {};
  const totalStats: Array<[string, { value: number | string }]> = [];
  
  statEntries.forEach(([key, data]) => {
    // Pattern 1: "Group (Statistic)" format
    const parenthesesMatch = key.match(/^(.+?)\s*\(([^)]+)\)$/);
    // Pattern 2: "Group - Statistic" format  
    const dashMatch = key.match(/^(.+?)\s*-\s*(.+)$/);
    
    if (parenthesesMatch) {
      const [, group, stat] = parenthesesMatch;
      if (!groupedData[group]) {
        groupedData[group] = {};
      }
      groupedData[group][stat] = data.value;
    } else if (dashMatch && !key.toLowerCase().includes('total')) {
      const [, group, stat] = dashMatch;
      if (!groupedData[group]) {
        groupedData[group] = {};
      }
      groupedData[group][stat] = data.value;
    } else if (key.toLowerCase().includes('total') || key.toLowerCase().includes('sample size') || 
               key.toLowerCase().includes('correlation') || key.toLowerCase().includes('slope') ||
               key.toLowerCase().includes('intercept') || key.toLowerCase().includes('r²')) {
      // These are summary/total statistics
      totalStats.push([key, data]);
    } else {
      // Simple ungrouped statistic - treat as its own group
      groupedData[key] = { 'Value': data.value };
    }
  });

  const groups = Object.keys(groupedData);
  
  // If we have grouped data, create a pivoted table
  if (groups.length > 0) {
    // Get all unique statistics across all groups
    const allStats = new Set<string>();
    groups.forEach(group => {
      Object.keys(groupedData[group]).forEach(stat => allStats.add(stat));
    });
    const statsArray = Array.from(allStats).sort();

    return (
      <Card className="mt-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Chart Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Main grouped statistics table */}
          {statsArray.length > 0 && (
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
          )}
          
          {/* Summary statistics below if any */}
          {totalStats.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Summary Statistics</h4>
              <Table>
                <TableBody>
                  {totalStats.map(([statName, statData]) => (
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
