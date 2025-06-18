
export const getColorPalette = (scheme: string, customColors?: string[]): string[] => {
  switch (scheme) {
    case 'colorblind':
      return ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999', '#e41a1c', '#dede00'];
    case 'grayscale':
      return ['#333333', '#777777', '#AAAAAA', '#DDDDDD'];
    case 'vibrant':
      return ['#FF5733', '#33FF57', '#3366FF', '#FF33CC', '#33FFFF'];
    case 'custom':
      return customColors || ['#2563eb', '#dc2626', '#16a34a'];
    default: // 'academic'
      return ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
  }
};
