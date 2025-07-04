
export interface Variable {
  name: string;
  type: 'continuous' | 'categorical' | 'binary';
  description: string;
  missing: number;
}

export interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  groupBy?: string;
  bins?: string;
  variables?: string[];
  histogramBins?: number;
  statistic?: string;
}

export interface ChartRoleRequirements {
  [key: string]: {
    required: boolean;
    label: string;
    description: string;
    allowedTypes: ('continuous' | 'categorical' | 'binary')[];
    multiple?: boolean;
  };
}

export interface RoleBasedVariableSelectorProps {
  selectedDataset: string;
  chartType: string;
  variableRoles: VariableRoles;
  onRolesChange: (roles: VariableRoles) => void;
  getDatasetInfo: (dataset: string) => { variables: Variable[] } | null;
}
