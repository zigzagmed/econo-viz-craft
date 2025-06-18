
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DisplayOptionsCustomizationProps {
  showStats: boolean;
  statsDecimals: number;
  onShowStatsChange: (show: boolean) => void;
  onStatsDecimalsChange: (decimals: number) => void;
  showStatsOption: boolean;
}

export const DisplayOptionsCustomization: React.FC<DisplayOptionsCustomizationProps> = ({
  showStats,
  statsDecimals,
  onShowStatsChange,
  onStatsDecimalsChange,
  showStatsOption
}) => {
  if (!showStatsOption) return null;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Display Options</Label>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showStats"
            checked={showStats}
            onCheckedChange={onShowStatsChange}
          />
          <Label htmlFor="showStats" className="text-sm">Show Statistics</Label>
        </div>
        
        {showStats && (
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Decimal Places</Label>
            <Select 
              value={statsDecimals.toString()} 
              onValueChange={(value) => onStatsDecimalsChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
