import React from 'react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'datetime';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface TableFiltersProps {
  filters: FilterOption[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  className?: string;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  values,
  onChange,
  onClear,
  className
}) => {
  const hasActiveFilters = Object.values(values).some((v) => v && v !== '');

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        {filters.map((filter) => {
          const value = values[filter.key] ?? '';

          switch (filter.type) {
            case 'text':
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
                      value={value}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              );

            case 'select':
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <Select
                    options={filter.options || []}
                    value={value}
                    onChange={(val) => onChange(filter.key, val)}
                    placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                  />
                </div>
              );

            case 'date':
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <Input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                  />
                </div>
              );

            case 'datetime':
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <Input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => onChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                  />
                </div>
              );

            default:
              return null;
          }
        })}

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClear}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};