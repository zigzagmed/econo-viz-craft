
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
    histogramBins?: number;
    titlePosition?: 'top' | 'center';
    xAxisLabelDistance?: number;
    yAxisLabelDistance?: number;
    statsDecimals?: number;
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
  const [localConfig, setLocalConfig] = useState({
    titlePosition: 'top' as 'top' | 'center',
    xAxisLabelDistance: 30,
    yAxisLabelDistance: 50,
    histogramBins: 10,
    statsDecimals: 2,
    ...config
  });
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
    { id: 'academic', name: 'Academic (Professional colors)' },
    { id: 'colorblind', name: 'Colorblind Safe (Accessible palette)' },
    { id: 'grayscale', name: 'Grayscale (Black and white)' },
    { id: 'vibrant', name: 'Vibrant (Bright colors)' },
    { id: 'custom', name: 'Custom (Choose your own colors)' }
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

  const showStatsOption = !['pie'].includes(chartType);
  const showHistogramBins = chartType === 'histogram';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Chart Title</Label>
        <Input
          value={localConfig.title}
          onChange={(e) => updateLocalConfig('title', e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Title Position</Label>
        <Select value={localConfig.titlePosition} onValueChange={(value) => updateLocalConfig('titlePosition', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="center">Center</SelectItem>
          </SelectContent>
        </Select>
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
        <Label className="text-sm font-medium">X-Axis Label Distance</Label>
        <Input
          type="number"
          value={localConfig.xAxisLabelDistance}
          onChange={(e) => updateLocalConfig('xAxisLabelDistance', parseInt(e.target.value) || 30)}
          placeholder="Distance from axis"
          min="10"
          max="100"
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

      <div className="space-y-2">
        <Label className="text-sm font-medium">Y-Axis Label Distance</Label>
        <Input
          type="number"
          value={localConfig.yAxisLabelDistance}
          onChange={(e) => updateLocalConfig('yAxisLabelDistance', parseInt(e.target.value) || 50)}
          placeholder="Distance from axis"
          min="20"
          max="100"
        />
      </div>

      {showHistogramBins && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Number of Bins</Label>
            <span className="text-sm text-gray-600">{localConfig.histogramBins}</span>
          </div>
          <Slider
            value={[localConfig.histogramBins]}
            onValueChange={(value) => updateLocalConfig('histogramBins', value[0])}
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
      )}

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Color Scheme</Label>
        <Select value={localConfig.colorScheme} onValueChange={handleColorSchemeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorSchemes.map((scheme) => (
              <SelectItem key={scheme.id} value={scheme.id}>
                {scheme.name}
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
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showStats"
                checked={localConfig.showStats}
                onCheckedChange={(checked) => updateLocalConfig('showStats', checked)}
              />
              <Label htmlFor="showStats" className="text-sm">Show Statistics</Label>
            </div>
            
            {localConfig.showStats && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm">Decimal Places</Label>
                <Select 
                  value={localConfig.statsDecimals?.toString()} 
                  onValueChange={(value) => updateLocalConfig('statsDecimals', parseInt(value))}
                >
                  <SelectTrigger className="w-24">
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
          </>
        )}
      </div>

      <Separator />
      <div className="flex justify-end pt-2">
        <Button onClick={handleApply} className="w-full">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
