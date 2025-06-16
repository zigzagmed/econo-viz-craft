
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface ChartCustomizationProps {
  config: {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    colorScheme: string;
    showStats: boolean;
    showTrendLine: boolean;
  };
  onConfigChange: (config: any) => void;
  chartType: string;
  selectedVariables: string[];
}

export const ChartCustomization: React.FC<ChartCustomizationProps> = ({
  config,
  onConfigChange,
  chartType,
  selectedVariables
}) => {
  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const colorSchemes = [
    { id: 'academic', name: 'Academic', description: 'Professional colors' },
    { id: 'colorblind', name: 'Colorblind Safe', description: 'Accessible palette' },
    { id: 'grayscale', name: 'Grayscale', description: 'Black and white' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bright colors' }
  ];

  const showTrendLineOption = ['scatter', 'regression', 'line'].includes(chartType);
  const showStatsOption = !['pie'].includes(chartType);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Chart Title</Label>
        <Input
          value={config.title}
          onChange={(e) => updateConfig('title', e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">X-Axis Label</Label>
        <Input
          value={config.xAxisLabel}
          onChange={(e) => updateConfig('xAxisLabel', e.target.value)}
          placeholder="X-axis label"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Y-Axis Label</Label>
        <Input
          value={config.yAxisLabel}
          onChange={(e) => updateConfig('yAxisLabel', e.target.value)}
          placeholder="Y-axis label"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Color Scheme</Label>
        <Select value={config.colorScheme} onValueChange={(value) => updateConfig('colorScheme', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorSchemes.map((scheme) => (
              <SelectItem key={scheme.id} value={scheme.id}>
                <div className="flex flex-col">
                  <span>{scheme.name}</span>
                  <span className="text-xs text-gray-500">{scheme.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Display Options</Label>
        
        {showStatsOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showStats"
              checked={config.showStats}
              onCheckedChange={(checked) => updateConfig('showStats', checked)}
            />
            <Label htmlFor="showStats" className="text-sm">Show Statistics</Label>
          </div>
        )}

        {showTrendLineOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showTrendLine"
              checked={config.showTrendLine}
              onCheckedChange={(checked) => updateConfig('showTrendLine', checked)}
            />
            <Label htmlFor="showTrendLine" className="text-sm">Show Trend Line</Label>
          </div>
        )}
      </div>

      {selectedVariables.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Variables</Label>
            <div className="space-y-1">
              {selectedVariables.map((variable, index) => (
                <div key={variable} className="text-xs bg-gray-100 p-2 rounded">
                  {index === 0 ? 'X-axis: ' : index === 1 ? 'Y-axis: ' : 'Series: '}{variable}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
