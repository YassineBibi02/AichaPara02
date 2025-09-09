'use client';

import React from 'react';
import { Checkbox } from '../atoms/Checkbox';
import { clsx } from 'clsx';

interface TableRowProps {
  children: React.ReactNode;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showCheckbox?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  selected = false,
  onSelect,
  showCheckbox = false,
  onClick,
  className
}) => {
  return (
    <tr
      className={clsx(
        'border-b border-slate-200 hover:bg-slate-50 transition-colors',
        selected && 'bg-pink-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {showCheckbox && (
        <td className="w-12 px-4 py-4">
          <Checkbox
            checked={selected}
            onChange={onSelect}
          />
        </td>
      )}
      {children}
    </tr>
  );
};