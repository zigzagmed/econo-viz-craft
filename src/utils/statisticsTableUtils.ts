
export type StatEntry = [string, { value: number | string }];

export interface GroupedData {
  [group: string]: Record<string, number | string>;
}

export const formatValue = (value: number | string, decimals: number): string => {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return 'N/A';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(decimals);
  }
  return String(value);
};

export const hasSimpleGrouping = (statEntries: StatEntry[]): boolean => {
  return statEntries.every(([key]) => 
    !key.includes('(') && !key.includes('-') && !key.toLowerCase().includes('correlation') &&
    !key.toLowerCase().includes('slope') && !key.toLowerCase().includes('intercept') &&
    !key.toLowerCase().includes('r²')
  );
};

export const parseGroupedStatistics = (statEntries: StatEntry[]): {
  groupedData: GroupedData;
  summaryStats: StatEntry[];
} => {
  const groupedData: GroupedData = {};
  const summaryStats: StatEntry[] = [];
  
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
      // These are summary/total statistics - add to summary
      summaryStats.push([key, data]);
    } else {
      // Simple ungrouped statistic - treat as its own group
      groupedData[key] = { 'Value': data.value };
    }
  });

  return { groupedData, summaryStats };
};

export const getAllUniqueStats = (
  groupedData: GroupedData, 
  summaryStats: StatEntry[]
): string[] => {
  const allStats = new Set<string>();
  
  Object.values(groupedData).forEach(group => {
    Object.keys(group).forEach(stat => allStats.add(stat));
  });
  
  // Add summary stats as columns if they exist
  summaryStats.forEach(([statName]) => {
    // Clean up the statistic name for column header
    const cleanStatName = statName.replace(/^Total\s+/i, '').trim();
    allStats.add(cleanStatName);
  });
  
  return Array.from(allStats).sort();
};

export const findSummaryMatch = (
  stat: string, 
  summaryStats: StatEntry[]
): StatEntry | undefined => {
  return summaryStats.find(([statName]) => 
    statName.toLowerCase().includes(stat.toLowerCase()) ||
    statName.replace(/^Total\s+/i, '').toLowerCase() === stat.toLowerCase()
  );
};
