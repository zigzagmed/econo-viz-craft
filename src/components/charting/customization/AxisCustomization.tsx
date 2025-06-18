
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AxisCustomizationProps {
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisLabelDistance: number;
  yAxisLabelDistance: number;
  onXAxisLabelChange: (label: string) => void;
  onYAxisLabelChange: (label: string) => void;
  onXAxisLabelDistanceChange: (distance: number) => void;
  onYAxisLabelDistanceChange: (distance: number) => void;
}

export const AxisCustomization: React.FC<AxisCustomizationProps> = ({
  xAxisLabel,
  yAxisLabel,
  onXAxisLabelChange,
  onYAxisLabelChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">X-Axis Label</Label>
        <Input
          value={xAxisLabel}
          onChange={(e) => onXAxisLabelChange(e.target.value)}
          placeholder="X-axis label"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Y-Axis Label</Label>
        <Input
          value={yAxisLabel}
          onChange={(e) => onYAxisLabelChange(e.target.value)}
          placeholder="Y-axis label"
        />
      </div>
    </div>
  );
};
