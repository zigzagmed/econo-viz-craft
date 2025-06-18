
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { TitleCustomization } from './customization/TitleCustomization';
import { AxisCustomization } from './customization/AxisCustomization';
import { ColorCustomization } from './customization/ColorCustomization';
import { HistogramCustomization } from './customization/HistogramCustomization';
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
    yAxisLabelDistance: 50,
    histogramBins: 10,
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
  const showHistogramBins = chartType === 'histogram';

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

      {showHistogramBins && (
        <>
          <Separator />
          <HistogramCustomization
            histogramBins={localConfig.histogramBins}
            onHistogramBinsChange={(bins) => updateLocalConfig('histogramBins', bins)}
          />
        </>
      )}

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

      <Separator />
      <div className="flex justify-end pt-2">
        <Button onClick={handleApply} className="w-full">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
