
import React, { useState } from 'react';
import { ChartHeader } from './charting/ChartHeader';
import { ChartTypeSelectionCard } from './charting/ChartTypeSelectionCard';
import { VariableSelectionCard } from './charting/VariableSelectionCard';
import { SelectedVariablesDisplay } from './charting/SelectedVariablesDisplay';
import { ChartDisplay } from './charting/ChartDisplay';
import { useChartingData } from '../hooks/useChartingData';
import { useChartConfig } from '../hooks/useChartConfig';
import { useECharts } from '../hooks/useECharts';

export const ChartingTool = () => {
  const selectedDataset = 'gdp_growth';
  const [chartType, setChartType] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  const { getVariableData, getDatasetInfo } = useChartingData();
  const { chartConfig, setChartConfig } = useChartConfig(selectedVariables, chartType);
  const { chartRef, handleExportChart } = useECharts(
    selectedDataset,
    selectedVariables,
    chartType,
    chartConfig,
    getVariableData
  );

  const getChartRequirements = (type: string) => {
    const requirements = {
      bar: { min: 1, max: 2, description: 'Choose 1-2 variables for comparison' },
      line: { min: 2, max: 3, description: 'Choose 2-3 variables to show trends' },
      pie: { min: 1, max: 1, description: 'Choose exactly 1 categorical variable' },
      scatter: { min: 2, max: 2, description: 'Choose exactly 2 continuous variables' },
      histogram: { min: 1, max: 1, description: 'Choose exactly 1 continuous variable' },
      boxplot: { min: 1, max: 3, description: 'Choose 1-3 variables for distribution analysis' },
      violin: { min: 1, max: 2, description: 'Choose 1-2 variables for distribution' },
      density: { min: 1, max: 2, description: 'Choose 1-2 continuous variables' },
      regression: { min: 2, max: 2, description: 'Choose exactly 2 continuous variables' },
      correlation: { min: 2, max: 10, description: 'Choose 2-10 variables for correlation matrix' },
      residual: { min: 2, max: 2, description: 'Choose exactly 2 continuous variables' },
      qqplot: { min: 1, max: 1, description: 'Choose exactly 1 continuous variable' },
    };
    return requirements[type] || { min: 1, max: 1, description: 'Select variables' };
  };

  const canShowChart = chartType && selectedVariables.length > 0;
  const requirements = chartType ? getChartRequirements(chartType) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ChartHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Chart Setup */}
          <div className="col-span-4 space-y-4">
            <ChartTypeSelectionCard
              chartType={chartType}
              onTypeChange={setChartType}
            />

            {chartType && (
              <VariableSelectionCard
                selectedDataset={selectedDataset}
                selectedVariables={selectedVariables}
                onVariablesChange={setSelectedVariables}
                getDatasetInfo={getDatasetInfo}
                requirements={requirements}
              />
            )}

            {selectedVariables.length > 0 && (
              <SelectedVariablesDisplay
                selectedVariables={selectedVariables}
                chartType={chartType}
                colorVariable={chartConfig.colorVariable}
              />
            )}
          </div>

          {/* Right Panel - Chart */}
          <div className="col-span-8">
            <ChartDisplay
              canShowChart={canShowChart}
              chartTitle={chartConfig.title}
              chartRef={chartRef}
              selectedDataset={selectedDataset}
              selectedVariables={selectedVariables}
              chartType={chartType}
              chartConfig={chartConfig}
              customizationOpen={false}
              setCustomizationOpen={() => {}}
              onConfigChange={setChartConfig}
              onExportChart={handleExportChart}
              getVariableData={getVariableData}
              getDatasetInfo={getDatasetInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
