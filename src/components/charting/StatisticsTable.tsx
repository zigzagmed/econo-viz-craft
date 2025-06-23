
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleStatisticsTable } from './tables/SimpleStatisticsTable';
import { GroupedStatisticsTable } from './tables/GroupedStatisticsTable';
import { 
  hasSimpleGrouping, 
  parseGroupedStatistics, 
  getAllUniqueStats 
} from '../../utils/statisticsTableUtils';

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
  const statEntries = Object.entries(statistics);
  
  if (statEntries.length === 0) {
    return null;
  }

  // Check if this looks like bar chart statistics (simple group -> value mapping)
  if (hasSimpleGrouping(statEntries)) {
    return (
      <Card className="mt-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Chart Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SimpleStatisticsTable 
            statistics={statistics} 
            decimals={decimals} 
          />
        </CardContent>
      </Card>
    );
  }

  // Parse grouped statistics
  const { groupedData, summaryStats } = parseGroupedStatistics(statEntries);
  const groups = Object.keys(groupedData);
  
  // If we have grouped data, create a pivoted table
  if (groups.length > 0) {
    const statsArray = getAllUniqueStats(groupedData, summaryStats);

    return (
      <Card className="mt-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Chart Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <GroupedStatisticsTable
            groupedData={groupedData}
            summaryStats={summaryStats}
            statsArray={statsArray}
            decimals={decimals}
          />
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
        <SimpleStatisticsTable 
          statistics={statistics} 
          decimals={decimals}
          title="Statistics"
        />
      </CardContent>
    </Card>
  );
};
