
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleCustomizationProps {
  title: string;
  titlePosition: 'top' | 'center';
  onTitleChange: (title: string) => void;
  onTitlePositionChange: (position: 'top' | 'center') => void;
}

export const TitleCustomization: React.FC<TitleCustomizationProps> = ({
  title,
  onTitleChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Chart Title</Label>
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Enter chart title"
      />
    </div>
  );
};
