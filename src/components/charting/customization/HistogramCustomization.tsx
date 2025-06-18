
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface HistogramCustomizationProps {
  histogramBins: number;
  onHistogramBinsChange: (bins: number) => void;
}

export const HistogramCustomization: React.FC<HistogramCustomizationProps> = ({
  histogramBins,
  onHistogramBinsChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Number of Bins</Label>
        <span className="text-sm text-gray-600">{histogramBins}</span>
      </div>
      <Slider
        value={[histogramBins]}
        onValueChange={(value) => onHistogramBinsChange(value[0])}
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
