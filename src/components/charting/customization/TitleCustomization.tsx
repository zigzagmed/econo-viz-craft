
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TitleCustomizationProps {
  title: string;
  titlePosition: 'top' | 'center';
  onTitleChange: (title: string) => void;
  onTitlePositionChange: (position: 'top' | 'center') => void;
}

export const TitleCustomization: React.FC<TitleCustomizationProps> = ({
  title,
  titlePosition,
  onTitleChange,
  onTitlePositionChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Chart Title</Label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Title Position</Label>
        <Select value={titlePosition} onValueChange={onTitlePositionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="center">Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
