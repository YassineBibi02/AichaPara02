import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SortIndicatorProps {
  direction: 'asc' | 'desc' | null;
}

export const SortIndicator: React.FC<SortIndicatorProps> = ({ direction }) => {
  if (direction === 'asc') {
    return <ChevronUp className="w-4 h-4" />;
  }
  
  if (direction === 'desc') {
    return <ChevronDown className="w-4 h-4" />;
  }
  
  return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
};