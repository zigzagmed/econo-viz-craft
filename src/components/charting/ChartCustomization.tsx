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
    colorVariable?: string;
  };
  onConfigChange: (config: any) => void;
  chartType: string;
  selectedVariables: string[];
  availableVariables?: string[];
  onClose?: () => void;
}

export const ChartCustomization: React.FC<ChartCustomizationProps> = ({
  config,
  onConfigChange,
  chartType,
  selectedVariables,
  availableVariables = [],
  onClose
}) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [showCustomColors, setShowCustomColors] = useState(config.colorScheme === 'custom');
  const [customColors, setCustomColors] = useState(config.customColors || ['#2563eb', '#dc2626', '#16a34a']);

  const updateLocalConfig = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onConfigChange(localConfig);
    if (onClose) {
      onClose();
    }
  };

  const colorSchemes = [
    { id: 'academic', name: 'Academic', description: 'Professional colors' },
    { id: 'colorblind', name: 'Colorblind Safe', description: 'Accessible palette' },
    { id: 'grayscale', name: 'Grayscale', description: 'Black and white' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bright colors' },
    { id: 'custom', name: 'Custom', description: 'Choose your own colors' }
  ];

  const handleColorSchemeChange = (value: string) => {
    updateLocalConfig('colorScheme', value);
    setShowCustomColors(value === 'custom');
    
    if (value === 'custom') {
      updateLocalConfig('customColors', customColors);
    } else {
      updateLocalConfig('customColors', undefined);
    }
  };

  const handleCustomColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
    updateLocalConfig('customColors', newColors);
  };

  const addCustomColor = () => {
    const newColors = [...customColors, '#000000'];
    setCustomColors(newColors);
    updateLocalConfig('customColors', newColors);
  };

  const removeCustomColor = (index: number) => {
    if (customColors.length > 1) {
      const newColors = customColors.filter((_, i) => i !== index);
      setCustomColors(newColors);
      updateLocalConfig('customColors', newColors);
    }
  };

  const showTrendLineOption = ['scatter', 'regression', 'line'].includes(chartType);
  const showStatsOption = !['pie'].includes(chartType);
  const showColorVariable = ['bar', 'scatter', 'line'].includes(chartType);

  // Get available variables for color mapping (excluding already selected ones)
  const colorVariableOptions = availableVariables.filter(variable => 
    !selectedVariables.includes(variable)
  );

  const handleColorVariableChange = (value: string) => {
    updateLocalConfig('colorVariable', value === 'none' ? undefined : value);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Chart Title</Label>
        <Input
          value={localConfig.title}
          onChange={(e) => updateLocalConfig('title', e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">X-Axis Label</Label>
        <Input
          value={localConfig.xAxisLabel}
          onChange={(e) => updateLocalConfig('xAxisLabel', e.target.value)}
          placeholder="X-axis label"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Y-Axis Label</Label>
        <Input
          value={localConfig.yAxisLabel}
          onChange={(e) => updateLocalConfig('yAxisLabel', e.target.value)}
          placeholder="Y-axis label"
        />
      </div>

      <Separator />

      {showColorVariable && colorVariableOptions.length > 0 && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color Variable</Label>
            <Select 
              value={localConfig.colorVariable || 'none'} 
              onValueChange={handleColorVariableChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variable for coloring (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {colorVariableOptions.map((variable) => (
                  <SelectItem key={variable} value={variable}>
                    {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {localConfig.colorVariable && (
              <p className="text-xs text-gray-500">
                Chart elements will be colored based on {localConfig.colorVariable} values
              </p>
            )}
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium">Color Scheme</Label>
        <Select value={localConfig.colorScheme} onValueChange={handleColorSchemeChange}>
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
              checked={localConfig.showStats}
              onCheckedChange={(checked) => updateLocalConfig('showStats', checked)}
            />
            <Label htmlFor="showStats" className="text-sm">Show Statistics</Label>
          </div>
        )}

        {showTrendLineOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showTrendLine"
              checked={localConfig.showTrendLine}
              onCheckedChange={(checked) => updateLocalConfig('showTrendLine', checked)}
            />
            <Label htmlFor="showTrendLine" className="text-sm">Show Trend Line</Label>
          </div>
        )}
      </div>

      {/* Apply Button - At the bottom */}
      <Separator />
      <div className="flex justify-end pt-2">
        <Button onClick={handleApply} className="w-full">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
