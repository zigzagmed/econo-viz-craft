
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
  xAxisLabelDistance,
  yAxisLabelDistance,
  onXAxisLabelChange,
  onYAxisLabelChange,
  onXAxisLabelDistanceChange,
  onYAxisLabelDistanceChange
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
        <Label className="text-sm font-medium">X-Axis Label Distance</Label>
        <Input
          type="number"
          value={xAxisLabelDistance}
          onChange={(e) => onXAxisLabelDistanceChange(parseInt(e.target.value) || 30)}
          placeholder="Distance from axis"
          min="10"
          max="100"
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

      <div className="space-y-2">
        <Label className="text-sm font-medium">Y-Axis Label Distance</Label>
        <Input
          type="number"
          value={yAxisLabelDistance}
          onChange={(e) => onYAxisLabelDistanceChange(parseInt(e.target.value) || 50)}
          placeholder="Distance from axis"
          min="20"
          max="100"
        />
      </div>
    </div>
  );
};
