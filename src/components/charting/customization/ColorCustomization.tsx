
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

interface ColorCustomizationProps {
  colorScheme: string;
  customColors: string[];
  onColorSchemeChange: (scheme: string) => void;
  onCustomColorsChange: (colors: string[]) => void;
}

export const ColorCustomization: React.FC<ColorCustomizationProps> = ({
  colorScheme,
  customColors,
  onColorSchemeChange,
  onCustomColorsChange
}) => {
  const colorSchemes = [
    { id: 'academic', name: 'Academic (Professional colors)' },
    { id: 'colorblind', name: 'Colorblind Safe (Accessible palette)' },
    { id: 'grayscale', name: 'Grayscale (Black and white)' },
    { id: 'vibrant', name: 'Vibrant (Bright colors)' },
    { id: 'custom', name: 'Custom (Choose your own colors)' }
  ];

  const showCustomColors = colorScheme === 'custom';

  const handleCustomColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    onCustomColorsChange(newColors);
  };

  const addCustomColor = () => {
    onCustomColorsChange([...customColors, '#000000']);
  };

  const removeCustomColor = (index: number) => {
    if (customColors.length > 1) {
      const newColors = customColors.filter((_, i) => i !== index);
      onCustomColorsChange(newColors);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Color Scheme</Label>
      <Select value={colorScheme} onValueChange={onColorSchemeChange}>
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
  );
};
