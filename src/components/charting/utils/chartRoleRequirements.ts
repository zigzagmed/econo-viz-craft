
export interface RoleRequirement {
  required: boolean;
  label: string;
  description: string;
  allowedTypes: ('continuous' | 'categorical' | 'binary')[];
}

export interface ChartRoleRequirements {
  [key: string]: RoleRequirement;
}

export const getChartRoleRequirements = (chartType: string): ChartRoleRequirements => {
  const commonRoles = {
    xAxis: {
      required: true,
      label: 'X-Axis Variable',
      description: 'Variable for the horizontal axis',
      allowedTypes: ['continuous', 'categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
    },
    yAxis: {
      required: true,
      label: 'Y-Axis Variable', 
      description: 'Variable for the vertical axis',
      allowedTypes: ['continuous'] as ('continuous' | 'categorical' | 'binary')[]
    },
    color: {
      required: false,
      label: 'Color Variable',
      description: 'Variable to color-code data points',
      allowedTypes: ['categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
    }
  };

  switch (chartType) {
    case 'scatter':
      return {
        xAxis: { ...commonRoles.xAxis, allowedTypes: ['continuous'] as ('continuous' | 'categorical' | 'binary')[] },
        yAxis: commonRoles.yAxis,
        color: commonRoles.color
      };

    case 'line':
      return {
        xAxis: { ...commonRoles.xAxis, allowedTypes: ['continuous', 'categorical'] as ('continuous' | 'categorical' | 'binary')[] },
        yAxis: commonRoles.yAxis,
        series: {
          required: false,
          label: 'Series Variable',
          description: 'Variable to create multiple lines',
          allowedTypes: ['categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    case 'bar':
      return {
        xAxis: { ...commonRoles.xAxis, allowedTypes: ['categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[] },
        yAxis: commonRoles.yAxis,
        statistic: {
          required: true,
          label: 'Select Statistic',
          description: 'Statistical operation to apply to Y values',
          allowedTypes: ['continuous', 'categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    case 'histogram':
      return {
        xAxis: {
          required: true,
          label: 'Variable',
          description: 'Variable to create histogram for',
          allowedTypes: ['continuous'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    case 'boxplot':
      return {
        xAxis: {
          required: true,
          label: 'Variable',
          description: 'Variable for box plot analysis',
          allowedTypes: ['continuous'] as ('continuous' | 'categorical' | 'binary')[]
        },
        groupBy: {
          required: false,
          label: 'Group By',
          description: 'Variable to group box plots',
          allowedTypes: ['categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    case 'pie':
      return {
        xAxis: {
          required: true,
          label: 'Category Variable',
          description: 'Variable for pie chart categories',
          allowedTypes: ['categorical', 'binary'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    case 'correlation':
      return {
        variables: {
          required: true,
          label: 'Variables',
          description: 'Select multiple variables for correlation analysis (minimum 2)',
          allowedTypes: ['continuous'] as ('continuous' | 'categorical' | 'binary')[]
        }
      };

    default:
      return {};
  }
};
