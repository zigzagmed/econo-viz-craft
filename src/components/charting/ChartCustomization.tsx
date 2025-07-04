
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TitleCustomization } from './customization/TitleCustomization';
import { AxisCustomization } from './customization/AxisCustomization';
import { ColorCustomization } from './customization/ColorCustomization';
import { DisplayOptionsCustomization } from './customization/DisplayOptionsCustomization';

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
    yAxisLabelDistance: 30,
    statsDecimals: 2,
    ...config
  });
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

  const handleColorSchemeChange = (value: string) => {
    updateLocalConfig('colorScheme', value);
    
    if (value === 'custom') {
      updateLocalConfig('customColors', customColors);
    } else {
      updateLocalConfig('customColors', undefined);
    }
  };

  const handleCustomColorsChange = (colors: string[]) => {
    setCustomColors(colors);
    updateLocalConfig('customColors', colors);
  };

  const showStatsOption = !['pie'].includes(chartType);
  const showTrendLineOption = chartType === 'scatter';

  return (
    <div className="space-y-4">
      <TitleCustomization
        title={localConfig.title}
        titlePosition={localConfig.titlePosition}
        onTitleChange={(title) => updateLocalConfig('title', title)}
        onTitlePositionChange={(position) => updateLocalConfig('titlePosition', position)}
      />

      <Separator />

      <AxisCustomization
        xAxisLabel={localConfig.xAxisLabel}
        yAxisLabel={localConfig.yAxisLabel}
        xAxisLabelDistance={localConfig.xAxisLabelDistance}
        yAxisLabelDistance={localConfig.yAxisLabelDistance}
        onXAxisLabelChange={(label) => updateLocalConfig('xAxisLabel', label)}
        onYAxisLabelChange={(label) => updateLocalConfig('yAxisLabel', label)}
        onXAxisLabelDistanceChange={(distance) => updateLocalConfig('xAxisLabelDistance', distance)}
        onYAxisLabelDistanceChange={(distance) => updateLocalConfig('yAxisLabelDistance', distance)}
      />

      <Separator />

      <ColorCustomization
        colorScheme={localConfig.colorScheme}
        customColors={customColors}
        onColorSchemeChange={handleColorSchemeChange}
        onCustomColorsChange={handleCustomColorsChange}
      />

      <Separator />

      <DisplayOptionsCustomization
        showStats={localConfig.showStats}
        statsDecimals={localConfig.statsDecimals}
        onShowStatsChange={(show) => updateLocalConfig('showStats', show)}
        onStatsDecimalsChange={(decimals) => updateLocalConfig('statsDecimals', decimals)}
        showStatsOption={showStatsOption}
      />

      {showTrendLineOption && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Trend Line</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="trend-line" className="text-sm">Show trend line</Label>
              <Switch
                id="trend-line"
                checked={localConfig.showTrendLine}
                onCheckedChange={(checked) => updateLocalConfig('showTrendLine', checked)}
              />
            </div>
          </div>
        </>
      )}

      <Separator />
      <div className="flex justify-end pt-2">
        <Button onClick={handleApply} className="w-full">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
