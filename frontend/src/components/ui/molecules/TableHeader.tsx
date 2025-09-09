import React from 'react';
import { Checkbox } from '../atoms/Checkbox';
import { SortIndicator } from '../atoms/SortIndicator';
import { clsx } from 'clsx';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableHeaderProps {
  columns: Column[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  showCheckbox?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  showCheckbox = false,
  allSelected = false,
  someSelected = false,
  onSelectAll,
  className
}) => {
  return (
    <thead className={clsx('bg-slate-50 border-b border-slate-200', className)}>
      <tr>
        {showCheckbox && (
          <th className="w-12 px-4 py-3">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={onSelectAll}
            />
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.key}
            className={clsx(
              'px-4 py-3 text-sm font-medium text-slate-700',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.sortable && 'cursor-pointer hover:bg-slate-100 select-none',
              column.width && `w-${column.width}`
            )}
            onClick={() => column.sortable && onSort?.(column.key)}
          >
            <div className={clsx(
              'flex items-center gap-2',
              column.align === 'center' && 'justify-center',
              column.align === 'right' && 'justify-end'
            )}>
              <span>{column.label}</span>
              {column.sortable && (
                <SortIndicator
                  direction={sortColumn === column.key ? sortDirection : null}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};