
import React, { useState } from 'react';
import { ChartHeader } from './charting/ChartHeader';
import { ChartTypeSelectionCard } from './charting/ChartTypeSelectionCard';
import { RoleBasedVariableSelector } from './charting/RoleBasedVariableSelector';
import { SelectedRolesDisplay } from './charting/SelectedRolesDisplay';
import { ChartDisplay } from './charting/ChartDisplay';
import { useChartingData } from '../hooks/useChartingData';
import { useChartConfig } from '../hooks/useChartConfig';
import { useECharts } from '../hooks/useECharts';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
}

export const ChartingTool = () => {
  const selectedDataset = 'gdp_growth';
  const [chartType, setChartType] = useState<string>('');
  const [variableRoles, setVariableRoles] = useState<VariableRoles>({});

  const { getVariableData, getDatasetInfo } = useChartingData();
  const { chartConfig, setChartConfig } = useChartConfig(variableRoles, chartType);
  const { chartRef, handleExportChart } = useECharts(
    selectedDataset,
    variableRoles,
    chartType,
    chartConfig,
    getVariableData
  );

  const canShowChart = chartType && Object.keys(variableRoles).some(role => variableRoles[role as keyof VariableRoles]);

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
              <RoleBasedVariableSelector
                selectedDataset={selectedDataset}
                chartType={chartType}
                variableRoles={variableRoles}
                onRolesChange={setVariableRoles}
                getDatasetInfo={getDatasetInfo}
              />
            )}
          </div>

          {/* Right Panel - Chart */}
          <div className="col-span-8 space-y-4">
            <ChartDisplay
              canShowChart={canShowChart}
              chartTitle={chartConfig.title}
              chartRef={chartRef}
              selectedDataset={selectedDataset}
              variableRoles={variableRoles}
              chartType={chartType}
              chartConfig={chartConfig}
              customizationOpen={false}
              setCustomizationOpen={() => {}}
              onConfigChange={setChartConfig}
              onExportChart={handleExportChart}
              getVariableData={getVariableData}
              getDatasetInfo={getDatasetInfo}
            />

            {/* Selected Variables Display - Now below the chart */}
            {Object.keys(variableRoles).some(role => variableRoles[role as keyof VariableRoles]) && (
              <SelectedRolesDisplay
                variableRoles={variableRoles}
                chartType={chartType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
