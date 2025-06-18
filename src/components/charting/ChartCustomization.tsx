
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface ChartCustomizationProps {
  config: {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    colorScheme: string;
    customColors?: string[];
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
  const [showCustomColors, setShowCustomColors] = useState(config.colorScheme === 'custom');
  const [customColors, setCustomColors] = useState(config.customColors || ['#2563eb', '#dc2626', '#16a34a']);

  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const colorSchemes = [
    { id: 'academic', name: 'Academic', description: 'Professional colors' },
    { id: 'colorblind', name: 'Colorblind Safe', description: 'Accessible palette' },
    { id: 'grayscale', name: 'Grayscale', description: 'Black and white' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bright colors' },
    { id: 'custom', name: 'Custom', description: 'Choose your own colors' }
  ];

  const handleColorSchemeChange = (value: string) => {
    updateConfig('colorScheme', value);
    setShowCustomColors(value === 'custom');
    
    if (value === 'custom') {
      updateConfig('customColors', customColors);
    } else {
      updateConfig('customColors', undefined);
    }
  };

  const handleCustomColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
    updateConfig('customColors', newColors);
  };

  const addCustomColor = () => {
    const newColors = [...customColors, '#000000'];
    setCustomColors(newColors);
    updateConfig('customColors', newColors);
  };

  const removeCustomColor = (index: number) => {
    if (customColors.length > 1) {
      const newColors = customColors.filter((_, i) => i !== index);
      setCustomColors(newColors);
      updateConfig('customColors', newColors);
    }
  };

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
        <Select value={config.colorScheme} onValueChange={handleColorSchemeChange}>
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

        {showCustomColors && (
          <div className="space-y-3 mt-3 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Custom Colors</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomColor}
                className="h-8"
              >
                <Palette className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {customColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleCustomColorChange(index, e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => handleCustomColorChange(index, e.target.value)}
                    className="flex-1 h-8"
                    placeholder="#000000"
                  />
                  {customColors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomColor(index)}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
