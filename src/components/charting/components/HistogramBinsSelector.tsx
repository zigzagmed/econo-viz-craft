
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface HistogramBinsSelectorProps {
  bins: number;
  onBinsChange: (bins: number) => void;
}

export const HistogramBinsSelector: React.FC<HistogramBinsSelectorProps> = ({
  bins,
  onBinsChange
}) => {
  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Number of Bins</Label>
        <span className="text-sm text-gray-600">{bins}</span>
      </div>
      <Slider
        value={[bins]}
        onValueChange={(value) => onBinsChange(value[0])}
        max={32}
        min={2}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>2</span>
        <span>32</span>
      </div>
    </div>
  );
};
