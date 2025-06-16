
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight } from 'lucide-react';

interface Variable {
  name: string;
  type: 'continuous' | 'categorical' | 'binary';
  description: string;
  missing: number;
}

interface AxisSelectorProps {
  variables: Variable[];
  xAxis: string;
  yAxis: string;
  onXAxisChange: (variable: string) => void;
  onYAxisChange: (variable: string) => void;
  chartType: string;
}

export const AxisSelector: React.FC<AxisSelectorProps> = ({
  variables,
  xAxis,
  yAxis,
  onXAxisChange,
  onYAxisChange,
  chartType
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'continuous': return 'bg-blue-100 text-blue-800';
      case 'categorical': return 'bg-green-100 text-green-800';
      case 'binary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendedVariables = (axis: 'x' | 'y') => {
    if (chartType === 'scatter' || chartType === 'regression') {
      return variables.filter(v => v.type === 'continuous');
    }
    if (chartType === 'bar') {
      return axis === 'x' 
        ? variables.filter(v => v.type === 'categorical' || v.type === 'binary')
        : variables.filter(v => v.type === 'continuous');
    }
    return variables;
  };

  const clearSelection = (axis: 'x' | 'y') => {
    if (axis === 'x') {
      onXAxisChange('');
    } else {
      onYAxisChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2">Choose Your Variables</h3>
        <p className="text-sm text-gray-600">Select what you want to plot on each axis</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* X-Axis Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              X-Axis (Horizontal)
              {chartType === 'bar' && <Badge variant="outline" className="text-xs">Categories</Badge>}
              {(chartType === 'scatter' || chartType === 'regression') && <Badge variant="outline" className="text-xs">Numbers</Badge>}
            </Label>
            {xAxis && (
              <button
                onClick={() => clearSelection('x')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={xAxis} onValueChange={onXAxisChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select X-axis variable" />
            </SelectTrigger>
            <SelectContent>
              {getRecommendedVariables('x').map((variable) => (
                <SelectItem key={variable.name} value={variable.name}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{variable.name}</span>
                        <Badge className={`text-xs ${getTypeColor(variable.type)}`}>
                          {variable.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{variable.description}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visual Arrow */}
        {xAxis && yAxis && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <span className="font-medium">{xAxis}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium">{yAxis}</span>
            </div>
          </div>
        )}

        {/* Y-Axis Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              Y-Axis (Vertical)
              {chartType === 'bar' && <Badge variant="outline" className="text-xs">Values</Badge>}
              {(chartType === 'scatter' || chartType === 'regression') && <Badge variant="outline" className="text-xs">Numbers</Badge>}
            </Label>
            {yAxis && (
              <button
                onClick={() => clearSelection('y')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={yAxis} onValueChange={onYAxisChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Y-axis variable" />
            </SelectTrigger>
            <SelectContent>
              {getRecommendedVariables('y').map((variable) => (
                <SelectItem key={variable.name} value={variable.name}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{variable.name}</span>
                        <Badge className={`text-xs ${getTypeColor(variable.type)}`}>
                          {variable.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{variable.description}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> {chartType === 'bar' && 'Use categories (like regions) for X-axis and numbers (like prices) for Y-axis.'}
          {chartType === 'scatter' && 'Use two numeric variables to see how they relate to each other.'}
          {chartType === 'regression' && 'Use two numeric variables to see their relationship with a trend line.'}
          {chartType === 'pie' && 'Select a categorical variable to see the distribution.'}
        </p>
      </div>
    </div>
  );
};
