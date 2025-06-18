
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface StatisticSelectorProps {
  selectedStatistic?: string;
  onStatisticChange: (statistic: string | undefined) => void;
}

const statisticOptions = [
  { value: 'sum', label: 'Sum', description: 'Total sum of Y values for each X category' },
  { value: 'average', label: 'Average', description: 'Average of Y values for each X category' },
  { value: 'count', label: 'Count', description: 'Count of records for each X category' },
  { value: 'min', label: 'Minimum', description: 'Minimum Y value for each X category' },
  { value: 'max', label: 'Maximum', description: 'Maximum Y value for each X category' }
];

export const StatisticSelector: React.FC<StatisticSelectorProps> = ({
  selectedStatistic,
  onStatisticChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Select Statistic</label>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm">Choose how to aggregate Y values for each X category</p>
              <div className="pt-2 border-t">
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">Required Field</Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <Select
        value={selectedStatistic || 'none'}
        onValueChange={(value) => onStatisticChange(value === 'none' ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select statistic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {statisticOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
