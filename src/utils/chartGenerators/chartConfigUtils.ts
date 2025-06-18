
export const formatTooltipValue = (value: number | string): string => {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return 'N/A';
  if (typeof value === 'number') {
    // Use 0 decimal places for integers, up to 3 for continuous values
    return Number.isInteger(value) ? value.toString() : value.toFixed(3);
  }
  return String(value);
};

export const getAxisLabelConfig = (label: string, isVertical: boolean) => ({
  name: label,
  nameLocation: 'middle',
  nameGap: 30,
  nameTextStyle: {
    fontSize: 14,
    fontWeight: 'normal'
  }
});

export const getTitleConfig = (title: string) => ({
  text: title || 'Chart',
  left: 'center',
  top: 20,
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
